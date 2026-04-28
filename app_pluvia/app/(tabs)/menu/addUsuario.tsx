import React, { useRef } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, TextInput } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
// import { useRouter } from "expo-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Screen } from "@/components/custom/Screen";
import { Input } from "@/components/ui/input";
import Header from '@/components/custom/Header';

export default function CadastrarUsuario() {
  // const router = useRouter();
  const [tabValue, setTabValue] = React.useState("operador");

  const cpfRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const senhaRef = useRef<TextInput>(null);
  const telefoneRef = useRef<TextInput>(null);
  const wppRef = useRef<TextInput>(null);

  return (
    <Screen>
      {/* 1. A MÁGICA DO BEHAVIOR: Como você usa edgeToEdge, o Android precisa de 'padding' ou 'height' igual ao iOS. 
        2. KEYBOARD VERTICAL OFFSET: Se a TopBar empurrar a tela para baixo, o teclado vai cobrir o input pela diferença exata da TopBar. 
           Coloquei 100 aqui como margem de segurança, mas você pode ajustar (ex: 80, 120) até o input ficar perfeitamente visível.
      */}
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
            <Tabs
              value={tabValue}
              onValueChange={setTabValue}
              className="w-full"
            >
              <TabsList className="gap-2">
                <TabsTrigger value="administrador" className="flex-1 border-2 border-primaria-azul rounded-xl">
                  <Text className='text-[13px]'>Administrador</Text>
                </TabsTrigger>
                <TabsTrigger value="cliente" className="flex-1 border-2 border-primaria-azul rounded-xl">
                  <Text className='text-[13px]'>Cliente</Text>
                </TabsTrigger>
                <TabsTrigger value="operador" className="flex-1 border-2 border-primaria-azul rounded-xl">
                  <Text className='text-[13px]'>Operador</Text>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="administrador"></TabsContent>
              <TabsContent value="cliente"></TabsContent>
              <TabsContent value="operador"></TabsContent>
            </Tabs>

            {/* FORMULÁRIO */}
          <View className="gap-4 w-full">
            
            <View className="items-start gap-2">
              <Text className="text-xs">Nome</Text>
              <Input
                className="rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul"
                placeholder="Exemplo"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => cpfRef.current?.focus()}
              />
            </View>

            <View className="items-start gap-2">
              <Text className="text-xs">CPF/CNPJ</Text>
              <Input
                ref={cpfRef}
                className="rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul"
                placeholder="00.000.000/0000-00"
                keyboardType="numeric"
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
              />
            </View>

            <View className="items-start gap-2">
              <Text className="text-xs">E-mail</Text>
              <Input
                ref={emailRef}
                className="rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul"
                placeholder="exemplo@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={() => senhaRef.current?.focus()}
              />
            </View>

            <View className="items-start gap-2">
              <Text className="text-xs">Senha/Token</Text>
              <Input
                ref={senhaRef}
                className="rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul"
                placeholder="Senha"
                secureTextEntry={true}
                returnKeyType="next"
                onSubmitEditing={() => telefoneRef.current?.focus()}
              />
            </View>

            <View className="flex-row gap-3">
              <View className="items-start gap-2 w-[48%]">
                <Text className="text-xs">Telefone</Text>
                <Input
                  ref={telefoneRef}
                  className="rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul"
                  placeholder="(99) 9 9999-9999"
                  keyboardType="phone-pad"
                  returnKeyType="next"
                  onSubmitEditing={() => wppRef.current?.focus()}
                />
              </View>
              <View className="items-start gap-2 w-[48%]">
                <Text className="text-xs">WhatsApp</Text>
                <Input
                  ref={wppRef}
                  className="rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul"
                  placeholder="(99) 9 9999-9999"
                  keyboardType="phone-pad"
                  returnKeyType="done"
                />
              </View>
            </View>
          </View>
          </View>

          

          {/* BOTÕES DE AÇÃO */}
          <View className="flex-row items-center w-full gap-4 mt-5">
            <Button className="bg-incorreto rounded-none rounded-pluvia flex-1 h-[40px]">
              <Text>Cancelar</Text>
            </Button>
            <Button className="bg-primaria-verde rounded-none rounded-pluvia flex-1 h-[40px]">
              <Text>Adicionar</Text>
            </Button>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}