/**
 * ✅ [PORTABILIDADE WEB CONCLUÍDA]
 * * MODIFICAÇÕES REALIZADAS PARA ADAPTAÇÃO WEB (Padrão do App):
 * 1. LAYOUT CENTRALIZADO: O Header se mantém 'full-width', e o formulário junto com os botões foi envelopado em uma View com 'web:max-w-2xl web:mx-auto self-center' para não esticar em monitores.
 * 2. CAMPOS LADO A LADO: Substituído o 'w-[48%]' por 'flex-1' nas duplas de inputs (Marca/Raio, Latitude/Longitude) para uma responsividade mais fluida.
 * 3. FEEDBACK DE MOUSE: Inserido 'cursor-pointer hover:opacity-90' nos Pressables que abrem os Dialogs de Fazenda e Operador.
 */

import React, { useRef, useState } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "expo-router";

// Importando os hooks da API
import { useCriarPivo } from "@/hooks/api/usePivos";
import { useFazendas } from "@/hooks/api/useFazendas";
import { useUsuarios } from "@/hooks/api/useUsuarios";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Screen } from "@/components/custom/Screen";
import { Input } from "@/components/ui/input";
import Header from "@/components/custom/Header";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { User, Check, Tractor, ChevronRight } from "lucide-react-native";

// 1. SCHEMA DA INTERFACE (UI Schema)
const formSchema = z.object({
  fazenda_id: z.string().uuid("Selecione uma fazenda obrigatória"),
  operador_id: z.string().uuid("Selecione um operador obrigatório").optional(),
  nome_pivo: z.string().min(2, "Mínimo de 2 caracteres"),
  codigo_serie: z.string().min(1, "Código é obrigatório"),
  vazao: z.string().optional(),
  modelo: z.string().optional(),
  marca: z.string().optional(),
  raio: z.string().optional(),
  lat: z.string().optional(),
  long: z.string().optional(),
});

type FormPivo = z.infer<typeof formSchema>;

export default function CadastrarPivo() {
  const router = useRouter();

  // Instanciando as mutações e queries (Busca de dados reais)
  const { mutateAsync: criarPivo, isPending: isCreating } = useCriarPivo();
  const { data: fazendas, isPending: isLoadingFazendas } = useFazendas();
  const { data: usuarios, isPending: isLoadingUsuarios } = useUsuarios();

  const [dialogFazendaOpen, setDialogFazendaOpen] = useState(false);
  const [selectedFazenda, setSelectedFazenda] = useState<{
    id: string;
    nome: string;
  } | null>(null);

  const [dialogOperadorOpen, setDialogOperadorOpen] = useState(false);
  const [selectedOperador, setSelectedOperador] = useState<{
    id: string;
    nome: string;
  } | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormPivo>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fazenda_id: "",
      operador_id: "",
      nome_pivo: "Teste",
      codigo_serie: "",
      vazao: "",
      modelo: "",
      marca: "",
      raio: "",
      lat: "",
      long: "",
    },
  });

  const nomeRef = useRef<TextInput>(null);
  const codigoSerieRef = useRef<TextInput>(null);
  const vazaoRef = useRef<TextInput>(null);
  const modeloRef = useRef<TextInput>(null);
  const marcaRef = useRef<TextInput>(null);
  const raioRef = useRef<TextInput>(null);
  const latRef = useRef<TextInput>(null);
  const longRef = useRef<TextInput>(null);

  // 3. FUNÇÃO DE SUBMISSÃO (Adapter)
  const onSubmit = async (data: FormPivo) => {
    try {
      // Concatena latitude e longitude
      let coordenadasFinal = undefined;
      if (data.lat && data.long) {
        coordenadasFinal = `${data.lat.trim()}, ${data.long.trim()}`;
      }

      // Converte as strings numéricas do teclado para números reais
      const vazaoNum = data.vazao
        ? parseFloat(data.vazao.replace(",", "."))
        : undefined;
      const raioNum = data.raio
        ? parseFloat(data.raio.replace(",", "."))
        : undefined;

      // O payload agora bate 100% com o backend
      const payload = {
        fazenda_id: data.fazenda_id,
        operador_id: data.operador_id || undefined,
        nome_pivo: data.nome_pivo,
        codigo_serie: data.codigo_serie,
        modelo: data.modelo || undefined,
        marca: data.marca || undefined,
        vazao: vazaoNum,
        raio: raioNum,
        coordenadas: coordenadasFinal,
      };

      const response = await criarPivo(payload);

      Alert.alert("Sucesso", response.mensagem);

      if (router.canGoBack()) router.back();
      else router.push("/(tabs)/pivos");
    } catch (error: any) {
      Alert.alert(
        "Falha no Cadastro",
        error.response?.data?.message ||
          "Ocorreu um erro ao comunicar com o servidor.",
      );
    }
  };

  // Filtramos apenas os usuários que são "Operadores" ou "Administradores" para a lista
  const operadoresDisponiveis =
    usuarios?.filter((u) => u.cargo === "Operador") || [];
  // const operadoresDisponiveis = usuarios?.filter(u => u.cargo === 'Operador' || u.cargo === 'Administrador') || [];

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
          {/* ✅ MUDANÇA 1: Header permanece full-width, fora do container centralizado */}
          <Header title="Cadastrar Pivô" subtitle="AXCP2134HIM" />

          {/*
           * ✅ MUDANÇA 2: Container central do formulário (Padrão do App).
           * - No mobile: ocupa 100% da largura.
           * - Na web: max-w-2xl limita a largura e mx-auto centraliza.
           * // ! - as veis bota um mt-6 (margin top)
           */}
          <View className="w-full web:max-w-2xl web:mx-auto self-center gap">
            <View className="gap-4 w-full">
              
              {/* === DIALOG DA FAZENDA === */}
              <View className="items-start gap-2">
                <Text className="text-xs">Fazenda</Text>

                <Dialog
                  open={dialogFazendaOpen}
                  onOpenChange={setDialogFazendaOpen}
                >
                  <DialogTrigger asChild>
                    {/* [WEB] cursor-pointer e hover adicionados ao Pressable */}
                    <Pressable
                      className={`flex-row items-center border-[2px] bg-white w-full overflow-hidden rounded-[12px] h-[48px] cursor-pointer hover:opacity-90 transition-opacity ${errors.fazenda_id ? "border-red-500" : "border-[#b8b8b8]"}`}
                    >
                      <View className="bg-[#00A0A6] px-4 items-center justify-center h-full">
                        <Tractor color="white" size={24} />
                      </View>
                      <View className="flex-1 px-3 items-start justify-center">
                        <Text
                          className={
                            selectedFazenda
                              ? "text-[#0D0D0D] text-sm font-outfit-medium"
                              : "text-muted-foreground text-sm font-outfit-medium"
                          }
                        >
                          {selectedFazenda
                            ? selectedFazenda.nome
                            : "Selecione uma fazenda"}
                        </Text>
                      </View>
                      <View className="px-4 items-center justify-center h-full">
                        <ChevronRight color="#666666" size={20} />
                      </View>
                    </Pressable>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Fazenda</DialogTitle>
                      <DialogDescription>
                        Selecione a fazenda onde o pivô será instalado.
                      </DialogDescription>
                    </DialogHeader>

                    <View className="h-[240px] bg-popover border-border rounded-md border shadow-md shadow-black/5 p-1 mt-4">
                      {isLoadingFazendas ? (
                        <View className="flex-1 items-center justify-center">
                          <ActivityIndicator size="large" color="#00A0A6" />
                        </View>
                      ) : (
                        <ScrollView
                          showsVerticalScrollIndicator={true}
                          keyboardShouldPersistTaps="handled"
                        >
                          {fazendas?.map((fazenda) => {
                            const isSelected =
                              selectedFazenda?.id === fazenda.id;
                            return (
                              <TouchableOpacity
                                key={fazenda.id}
                                activeOpacity={0.7}
                                className={`relative flex w-full flex-row items-center gap-2 rounded-sm py-2 pl-2 pr-8 cursor-pointer hover:bg-[#E1E1E1] ${isSelected ? "bg-accent" : "active:bg-accent"}`}
                                onPress={() => {
                                  setSelectedFazenda({
                                    id: fazenda.id,
                                    nome: fazenda.nome_fazenda,
                                  });
                                  setValue("fazenda_id", fazenda.id, {
                                    shouldValidate: true,
                                  });
                                  setDialogFazendaOpen(false);
                                }}
                              >
                                <Text className="text-foreground text-sm font-outfit-medium">
                                  {fazenda.nome_fazenda}
                                </Text>
                                {isSelected && (
                                  <View className="absolute right-2 flex size-3.5 items-center justify-center">
                                    <Check
                                      size={16}
                                      className="text-foreground shrink-0 font-outfit"
                                      strokeWidth={2.5}
                                    />
                                  </View>
                                )}
                              </TouchableOpacity>
                            );
                          })}
                        </ScrollView>
                      )}
                    </View>
                  </DialogContent>
                </Dialog>
                {errors.fazenda_id && (
                  <Text className="text-red-500 text-xs">
                    {errors.fazenda_id.message}
                  </Text>
                )}
              </View>

              {/* === DIALOG DO OPERADOR RESPONSÁVEL === */}
              <View className="items-start gap-2">
                <Text className="text-xs">Operador Responsável</Text>

                <Dialog
                  open={dialogOperadorOpen}
                  onOpenChange={setDialogOperadorOpen}
                >
                  <DialogTrigger asChild>
                    {/* [WEB] cursor-pointer e hover adicionados ao Pressable */}
                    <Pressable
                      className={`flex-row items-center border-[2px] bg-white w-full overflow-hidden rounded-[12px] h-[48px] cursor-pointer hover:opacity-90 transition-opacity ${errors.operador_id ? "border-red-500" : "border-[#b8b8b8]"}`}
                    >
                      <View className="bg-[#00A0A6] px-4 items-center justify-center h-full">
                        <User color="white" size={24} />
                      </View>
                      <View className="flex-1 px-3 items-start justify-center">
                        <Text
                          className={
                            selectedOperador
                              ? "text-[#0D0D0D] text-sm font-outfit-medium"
                              : "text-muted-foreground text-sm font-outfit-medium"
                          }
                        >
                          {selectedOperador
                            ? selectedOperador.nome
                            : "Selecione um operador"}
                        </Text>
                      </View>
                      <View className="px-4 items-center justify-center h-full">
                        <ChevronRight color="#666666" size={20} />
                      </View>
                    </Pressable>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Operador</DialogTitle>
                      <DialogDescription>
                        Selecione o operador responsável por este pivô.
                      </DialogDescription>
                    </DialogHeader>

                    <View className="h-[240px] bg-popover border-border rounded-md border shadow-md shadow-black/5 p-1 mt-4">
                      {isLoadingUsuarios ? (
                        <View className="flex-1 items-center justify-center">
                          <ActivityIndicator size="large" color="#00A0A6" />
                        </View>
                      ) : (
                        <ScrollView
                          showsVerticalScrollIndicator={true}
                          keyboardShouldPersistTaps="handled"
                        >
                          {operadoresDisponiveis.map((operador) => {
                            const isSelected =
                              selectedOperador?.id === operador.id;
                            return (
                              <TouchableOpacity
                                key={operador.id}
                                activeOpacity={0.7}
                                className={`relative flex w-full flex-row items-center gap-2 rounded-sm py-2 pl-2 pr-8 cursor-pointer hover:bg-[#E1E1E1] ${isSelected ? "bg-accent" : "active:bg-accent"}`}
                                onPress={() => {
                                  setSelectedOperador({
                                    id: operador.id,
                                    nome: operador.nome,
                                  });
                                  setValue("operador_id", operador.id, {
                                    shouldValidate: true,
                                  });
                                  setDialogOperadorOpen(false);
                                }}
                              >
                                <Text className="text-foreground text-sm font-outfit-medium">
                                  {operador.nome}
                                </Text>
                                {isSelected && (
                                  <View className="absolute right-2 flex size-3.5 items-center justify-center">
                                    <Check
                                      size={16}
                                      className="text-foreground shrink-0 font-outfit"
                                      strokeWidth={2.5}
                                    />
                                  </View>
                                )}
                              </TouchableOpacity>
                            );
                          })}
                        </ScrollView>
                      )}
                    </View>
                  </DialogContent>
                </Dialog>
              </View>

              {/* === NOME === */}
              <View className="items-start gap-2">
                <Text className="text-xs">Nome</Text>
                <Controller
                  control={control}
                  name="nome_pivo"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      ref={nomeRef}
                      className={`rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul ${errors.nome_pivo ? "border-red-500" : "border-secundaria-azul"}`}
                      placeholder="Pivô Central 01"
                      autoCapitalize="words"
                      returnKeyType="next"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      onSubmitEditing={() => codigoSerieRef.current?.focus()}
                    />
                  )}
                />
                {errors.nome_pivo && (
                  <Text className="text-red-500 text-xs">
                    {errors.nome_pivo.message}
                  </Text>
                )}
              </View>

              {/* === CÓDIGO DE SÉRIE === */}
              <View className="items-start gap-2">
                <Text className="text-xs">Código de Série</Text>
                <Controller
                  control={control}
                  name="codigo_serie"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      ref={codigoSerieRef}
                      className={`rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul ${errors.codigo_serie ? "border-red-500" : "border-secundaria-azul"}`}
                      placeholder="ABC1234-5D"
                      autoCapitalize="characters"
                      returnKeyType="next"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      onSubmitEditing={() => vazaoRef.current?.focus()}
                    />
                  )}
                />
                {errors.codigo_serie && (
                  <Text className="text-red-500 text-xs">
                    {errors.codigo_serie.message}
                  </Text>
                )}
              </View>

              {/* === VAZÃO (Campo não processado pelo backend no momento) === */}
              <View className="items-start gap-2">
                <Text className="text-xs">Vazão</Text>
                <Controller
                  control={control}
                  name="vazao"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      ref={vazaoRef}
                      className="rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul border-secundaria-azul"
                      placeholder="123 L/h"
                      autoCapitalize="none"
                      returnKeyType="next"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      onSubmitEditing={() => modeloRef.current?.focus()}
                    />
                  )}
                />
              </View>

              {/* === MODELO === */}
              <View className="items-start gap-2">
                <Text className="text-xs">Modelo</Text>
                <Controller
                  control={control}
                  name="modelo"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      ref={modeloRef}
                      className="rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul border-secundaria-azul"
                      placeholder="Zimmatic 9500"
                      autoCapitalize="words"
                      returnKeyType="next"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      onSubmitEditing={() => marcaRef.current?.focus()}
                    />
                  )}
                />
              </View>

              {/* === MARCA / FABRICANTE E RAIO === */}
              {/* [WEB] Substituído w-[48%] por flex-1 para preenchimento fluído */}
              <View className="flex-row gap-3">
                <View className="items-start gap-2 flex-1">
                  <Text className="text-xs">Marca</Text>
                  <Controller
                    control={control}
                    name="marca"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        ref={marcaRef}
                        className="rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul border-secundaria-azul"
                        placeholder="Lindsay"
                        autoCapitalize="words"
                        returnKeyType="next"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        onSubmitEditing={() => raioRef.current?.focus()}
                      />
                    )}
                  />
                </View>
                <View className="items-start gap-2 flex-1">
                  <Text className="text-xs">Raio do Pivô (km)</Text>
                  <Controller
                    control={control}
                    name="raio"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        ref={raioRef}
                        className="rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul border-secundaria-azul"
                        placeholder="1.2"
                        keyboardType="numeric"
                        returnKeyType="next"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        onSubmitEditing={() => latRef.current?.focus()}
                      />
                    )}
                  />
                </View>
              </View>

              {/* === COORDENADAS === */}
              {/* [WEB] Substituído w-[48%] por flex-1 para preenchimento fluído */}
              <View className="flex-row gap-3">
                <View className="items-start gap-2 flex-1">
                  <Text className="text-xs">Latitude</Text>
                  <Controller
                    control={control}
                    name="lat"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        ref={latRef}
                        className="rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul border-secundaria-azul"
                        placeholder="-12.3456"
                        keyboardType="numbers-and-punctuation"
                        returnKeyType="next"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        onSubmitEditing={() => longRef.current?.focus()}
                      />
                    )}
                  />
                </View>
                <View className="items-start gap-2 flex-1">
                  <Text className="text-xs">Longitude</Text>
                  <Controller
                    control={control}
                    name="long"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        ref={longRef}
                        className="rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul border-secundaria-azul"
                        placeholder="-45.6789"
                        keyboardType="numbers-and-punctuation"
                        returnKeyType="done"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                      />
                    )}
                  />
                </View>
              </View>
            </View>

            {/* === BOTÕES DE AÇÃO === */}
            {/* Mantidos dentro da view web:max-w-2xl para acompanhar a largura do form */}
            <View className="flex-row items-center w-full gap-4 mt-5">
              <Button
                className="bg-incorreto rounded-none rounded-pluvia flex-1 h-[40px]"
                onPress={() => {
                  if (router.canGoBack()) router.back();
                  else router.push("/(tabs)/pivos");
                }}
                disabled={isCreating}
              >
                <Text>Cancelar</Text>
              </Button>

              <Button
                className="bg-primaria-verde rounded-none rounded-pluvia flex-1 h-[40px]"
                onPress={handleSubmit(onSubmit)}
                disabled={isCreating}
              >
                {isCreating ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text>Adicionar</Text>
                )}
              </Button>
            </View>
            
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}