import React, { useRef } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, TextInput, Alert, ActivityIndicator } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "expo-router";

import { useCriarUsuario } from "@/hooks/api/useUsuarios";
import { Cargo } from "@/services/api/usuarios.service";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Screen } from "@/components/custom/Screen";
import { Input } from "@/components/ui/input";
import Header from '@/components/custom/Header';

// ! REGEX ERA BIZARRO 💀
const maskCpfCnpj = (value: string) => {
  let v = value.replace(/\D/g, ""); // Remove tudo o que não é dígito

  if (v.length <= 11) {
    // Máscara de CPF: 000.000.000-00
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  } else {
    // Máscara de CNPJ: 00.000.000/0000-00
    v = v.replace(/^(\d{2})(\d)/, "$1.$2");
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
    v = v.replace(/(\d{4})(\d)/, "$1-$2");
  }
  
  return v.substring(0, 18); // Limita o tamanho máximo do CNPJ formatado
};

const maskPhone = (value: string) => {
  let v = value.replace(/\D/g, ""); // Remove tudo o que não é dígito
  
  v = v.replace(/^(\d{2})(\d)/g, "($1) $2"); // Coloca parênteses em volta dos 2 primeiros dígitos
  v = v.replace(/(\d)(\d{4})$/, "$1-$2");    // Coloca hífen antes dos últimos 4 dígitos
  
  return v.substring(0, 15); // Limita o tamanho máximo para (99) 99999-9999
};


// 1. SCHEMA DA INTERFACE
const formSchema = z.object({
  cargo: z.enum(['Administrador', 'Operador', 'Cliente']),
  nome: z.string().min(3, "Mínimo de 3 caracteres"),
  // Usamos .refine para validar apenas a quantidade de números puros
  cpf_cnpj: z.string().refine((val) => val.replace(/\D/g, '').length >= 11, "CPF/CNPJ incompleto"),
  email: z.string().email("E-mail inválido"),
  senha_token: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  telefone: z.string().optional(),
  wpp: z.string().optional(),
});

type FormUsuario = z.infer<typeof formSchema>;

export default function CadastrarUsuario() {
  const router = useRouter();
  const { mutateAsync: criarUsuario, isPending } = useCriarUsuario();

  // 2. CONFIGURAÇÃO DO FORMULÁRIO
  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormUsuario>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cargo: 'Operador',
      nome: '', cpf_cnpj: '', email: '', senha_token: '', telefone: '', wpp: ''
    }
  });

  const cargoAtual = watch('cargo');

  const cpfRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const senhaRef = useRef<TextInput>(null);
  const telefoneRef = useRef<TextInput>(null);
  const wppRef = useRef<TextInput>(null);

  // 3. FUNÇÃO DE SUBMISSÃO
  const onSubmit = async (data: FormUsuario) => {
    try {
      // Prioriza o WhatsApp, se não tiver, pega o Telefone
      const telefoneFinal = data.wpp ? data.wpp : (data.telefone ? data.telefone : undefined);
      
      // Limpa a máscara do telefone para salvar apenas números no banco
      const telefoneLimpo = telefoneFinal ? telefoneFinal.replace(/\D/g, '') : undefined;

      const payload = {
        nome: data.nome,
        cargo: data.cargo,
        email: data.email,
        senha_token: data.senha_token,
        cpf_cnpj: data.cpf_cnpj.replace(/\D/g, ''), // Limpa a máscara do CPF/CNPJ
        telefone: telefoneLimpo,
      };

      const response = await criarUsuario(payload);
      
      Alert.alert("Sucesso", response.mensagem);
      
      if (router.canGoBack()) router.back();
      else router.push("/(tabs)/menu"); 

    } catch (error: any) {
      Alert.alert("Falha no Cadastro", error.response?.data?.message || "Erro ao conectar com o servidor.");
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        style={{ flex: 1, width: "100%" }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40, gap: 24 }}
        >
          <Header title='Cadastrar Usuário' subtitle='AXCP2134HIM'/>
          
          <View className="w-full gap-3">
            
            {/* === ABAS DE CARGO === */}
            <Tabs
              value={cargoAtual}
              onValueChange={(val) => setValue('cargo', val as Cargo)}
              className="w-full"
            >
              <TabsList className="gap-2">
                <TabsTrigger value="Administrador" className="flex-1 border-2 border-primaria-azul rounded-xl">
                  <Text className='text-[13px]'>Administrador</Text>
                </TabsTrigger>
                <TabsTrigger value="Cliente" className="flex-1 border-2 border-primaria-azul rounded-xl">
                  <Text className='text-[13px]'>Cliente</Text>
                </TabsTrigger>
                <TabsTrigger value="Operador" className="flex-1 border-2 border-primaria-azul rounded-xl">
                  <Text className='text-[13px]'>Operador</Text>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="Administrador"></TabsContent>
              <TabsContent value="Cliente"></TabsContent>
              <TabsContent value="Operador"></TabsContent>
            </Tabs>

            {/* === FORMULÁRIO === */}
            <View className="gap-4 w-full">
              
              <View className="items-start gap-2">
                <Text className="text-xs">Nome</Text>
                <Controller
                  control={control}
                  name="nome"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      className={`rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul ${errors.nome ? 'border-red-500' : ''}`}
                      placeholder="Exemplo"
                      autoCapitalize="words"
                      returnKeyType="next"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      onSubmitEditing={() => cpfRef.current?.focus()}
                    />
                  )}
                />
                {errors.nome && <Text className="text-red-500 text-xs">{errors.nome.message}</Text>}
              </View>

              <View className="items-start gap-2">
                <Text className="text-xs">CPF/CNPJ</Text>
                <Controller
                  control={control}
                  name="cpf_cnpj"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      ref={cpfRef}
                      className={`rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul ${errors.cpf_cnpj ? 'border-red-500' : ''}`}
                      placeholder="00.000.000/0000-00"
                      keyboardType="numeric"
                      returnKeyType="next"
                      onBlur={onBlur}
                      // Aplica a máscara em tempo real durante a digitação
                      onChangeText={(text) => onChange(maskCpfCnpj(text))} 
                      value={value}
                      maxLength={18}
                      onSubmitEditing={() => emailRef.current?.focus()}
                    />
                  )}
                />
                {errors.cpf_cnpj && <Text className="text-red-500 text-xs">{errors.cpf_cnpj.message}</Text>}
              </View>

              <View className="items-start gap-2">
                <Text className="text-xs">E-mail</Text>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      ref={emailRef}
                      className={`rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="exemplo@email.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      returnKeyType="next"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      onSubmitEditing={() => senhaRef.current?.focus()}
                    />
                  )}
                />
                {errors.email && <Text className="text-red-500 text-xs">{errors.email.message}</Text>}
              </View>

              <View className="items-start gap-2">
                <Text className="text-xs">Senha/Token</Text>
                <Controller
                  control={control}
                  name="senha_token"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      ref={senhaRef}
                      className={`rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul ${errors.senha_token ? 'border-red-500' : ''}`}
                      placeholder="Senha"
                      secureTextEntry={true}
                      returnKeyType="next"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      onSubmitEditing={() => telefoneRef.current?.focus()}
                    />
                  )}
                />
                {errors.senha_token && <Text className="text-red-500 text-xs">{errors.senha_token.message}</Text>}
              </View>

              <View className="flex-row gap-3">
                <View className="items-start gap-2 w-[48%]">
                  <Text className="text-xs">Telefone</Text>
                  <Controller
                    control={control}
                    name="telefone"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        ref={telefoneRef}
                        className="rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul"
                        placeholder="(99) 9999-9999"
                        keyboardType="phone-pad"
                        returnKeyType="next"
                        onBlur={onBlur}
                        // Aplica a máscara em tempo real
                        onChangeText={(text) => onChange(maskPhone(text))}
                        value={value}
                        maxLength={15}
                        onSubmitEditing={() => wppRef.current?.focus()}
                      />
                    )}
                  />
                </View>
                <View className="items-start gap-2 w-[48%]">
                  <Text className="text-xs">WhatsApp</Text>
                  <Controller
                    control={control}
                    name="wpp"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        ref={wppRef}
                        className="rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul"
                        placeholder="(99) 99999-9999"
                        keyboardType="phone-pad"
                        returnKeyType="done"
                        onBlur={onBlur}
                        // Aplica a máscara em tempo real
                        onChangeText={(text) => onChange(maskPhone(text))}
                        value={value}
                        maxLength={15}
                      />
                    )}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* === BOTÕES DE AÇÃO === */}
          <View className="flex-row items-center w-full gap-4 mt-5">
            <Button 
              className="bg-incorreto rounded-none rounded-pluvia flex-1 h-[40px]"
              onPress={() => {
                if (router.canGoBack()) router.back();
                else router.push("/(tabs)/menu");
              }}
              disabled={isPending}
            >
              <Text>Cancelar</Text>
            </Button>
            
            <Button 
              className="bg-primaria-verde rounded-none rounded-pluvia flex-1 h-[40px]"
              onPress={handleSubmit(onSubmit)}
              disabled={isPending}
            >
              {isPending ? <ActivityIndicator color="white" /> : <Text>Adicionar</Text>}
            </Button>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}