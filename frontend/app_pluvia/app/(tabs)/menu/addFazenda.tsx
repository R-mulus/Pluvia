/**
 * ✅ [PORTABILIDADE WEB CONCLUÍDA]
 * * MODIFICAÇÕES REALIZADAS PARA ADAPTAÇÃO WEB (Seguindo o padrão do App):
 * 1. LAYOUT CENTRALIZADO: O Header se mantém 'full-width', e o formulário junto com os botões foi envelopado em uma View com 'web:max-w-2xl web:mx-auto self-center' para não esticar em monitores.
 * 2. CAMPOS LADO A LADO: Substituído o 'w-[48%]' por 'flex-1' nas duplas de inputs (Lat/Long, Cidade/Estado, Área/Cultura) para uma responsividade mais fluida.
 * 3. FEEDBACK DE MOUSE: Inserido 'cursor-pointer hover:opacity-90' no Pressable que abre o Dialog do Proprietário.
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

// Importações dos Hooks de API
import { useCriarFazenda } from "@/hooks/api/useFazendas";
import { useUsuarios } from "@/hooks/api/useUsuarios";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Screen } from "@/components/custom/Screen";
import { Input } from "@/components/ui/input";
import Header from "@/components/custom/Header";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { User as UserIcon, Check, ChevronRight } from "lucide-react-native";

// 1. SCHEMA DA INTERFACE
const formSchema = z.object({
  proprietario_id: z.string().uuid("Selecione um proprietário obrigatório"),
  nome_fazenda: z.string().min(3, "Mínimo de 3 caracteres"),
  codigo_identificacao: z.string().min(1, "Código é obrigatório"),
  endereco: z.string().optional(),
  lat: z.string().optional(),
  long: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().max(2, "Apenas a sigla").optional(),
  area_total: z.string().optional(),
  cultura: z.string().optional(),
});

type FormFazenda = z.infer<typeof formSchema>;

export default function CadastrarFazenda() {
  const router = useRouter();

  // Instanciação das requisições
  const { mutateAsync: criarFazenda, isPending: isCreating } =
    useCriarFazenda();
  const { data: usuarios, isPending: isLoadingUsuarios, error } = useUsuarios();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProprietario, setSelectedProprietario] = useState<{
    id: string;
    nome: string;
  } | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormFazenda>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      proprietario_id: "",
      nome_fazenda: "",
      codigo_identificacao: "",
      endereco: "",
      lat: "",
      long: "",
      cidade: "",
      estado: "",
      area_total: "",
      cultura: "",
    },
  });

  const nomeRef = useRef<TextInput>(null);
  const codigoRef = useRef<TextInput>(null);
  const enderecoRef = useRef<TextInput>(null);
  const latRef = useRef<TextInput>(null);
  const longRef = useRef<TextInput>(null);
  const cidadeRef = useRef<TextInput>(null);
  const estadoRef = useRef<TextInput>(null);
  const areaRef = useRef<TextInput>(null);
  const culturaRef = useRef<TextInput>(null);

  const onSubmit = async (data: FormFazenda) => {
    try {
      let coordenadasFinal = undefined;
      if (data.lat && data.long) {
        coordenadasFinal = `${data.lat.trim()}, ${data.long.trim()}`;
      }

      const payload = {
        proprietario_id: data.proprietario_id,
        nome_fazenda: data.nome_fazenda,
        codigo_identificacao: data.codigo_identificacao,
        endereco: data.endereco || undefined,
        cidade: data.cidade || undefined,
        estado: data.estado?.toUpperCase() || undefined,
        coordenadas: coordenadasFinal,
        area_total: data.area_total ? parseFloat(data.area_total) : undefined,
        cultura: data.cultura
          ? data.cultura.split(",").map((c) => c.trim())
          : undefined,
      };

      const response = await criarFazenda(payload);

      Alert.alert("Sucesso", response.mensagem);
      if (router.canGoBack()) {
        router.back();
      } else {
        router.push("/(tabs)/menu");
      }
    } catch (error: any) {
      Alert.alert(
        "Falha no Cadastro",
        error.response?.data?.message ||
          "Ocorreu um erro ao comunicar com o servidor.",
      );
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
          <Header title="Cadastrar Fazenda" subtitle="AXCP2134HIM" />

          {/* // ! - as veis bota um mt-6 (margin top) */}
          <View className="w-full web:max-w-2xl web:mx-auto self-center gap-6">
            <View className="gap-4 w-full">

              {/* // * DIALOG DO PROPRIETÁRIO */}
              <View className="items-start gap-2">
                <Text className="text-xs">Proprietário</Text>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    {/* [WEB] cursor-pointer e hover adicionados ao Pressable */}
                    <Pressable
                      className={`flex-row items-center border-[2px] bg-white w-full overflow-hidden rounded-[12px] h-[40px] cursor-pointer hover:opacity-90 transition-opacity ${errors.proprietario_id ? "border-red-500" : "border-[#b8b8b8]"}`}
                    >
                      <View className="bg-[#00A0A6] px-4 items-center justify-center h-[40px] w-[40px]">
                        <UserIcon color="white" size={24} strokeWidth={2.5} />
                      </View>
                      <View className="flex-1 px-3 items-start justify-center">
                        <Text
                          className={
                            selectedProprietario
                              ? "text-[#0D0D0D] text-sm font-outfit-medium"
                              : "text-muted-foreground text-sm font-outfit-medium"
                          }
                        >
                          {selectedProprietario
                            ? selectedProprietario.nome
                            : "Selecione um proprietário"}
                        </Text>
                      </View>
                      <View className="px-4 items-center justify-center h-[40px] w-[40px]">
                        <ChevronRight color="black" size={16} />
                      </View>
                    </Pressable>
                  </DialogTrigger>

                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Proprietário</DialogTitle>
                      <DialogDescription>
                        Selecione o cliente cadastrado proprietário da fazenda.
                      </DialogDescription>
                    </DialogHeader>

                    <View className="h-[240px] bg-popover border-border rounded-md border shadow-md shadow-black/5 px-1 mt-4">
                      
                      {isLoadingUsuarios ? (
                        <View className="flex-1 items-center justify-center">
                          <ActivityIndicator size="large" color="#00A0A6" />
                        </View>
                      ) : (
                        <ScrollView
                          showsVerticalScrollIndicator={true}
                          keyboardShouldPersistTaps="handled"
                        >
                          {usuarios?.map((usuario) => {
                            const isSelected =
                              selectedProprietario?.id === usuario.id;
                            return (
                              <TouchableOpacity
                                key={usuario.id}
                                activeOpacity={0.7}
                                className={`relative flex w-full flex-row items-center gap-2 rounded-sm py-2 pl-2 pr-8 cursor-pointer hover:bg-[#E1E1E1] ${isSelected ? "bg-[#E1E1E1]" : "active:bg-[#E1E1E1]"}`}
                                onPress={() => {
                                  setSelectedProprietario({
                                    id: usuario.id,
                                    nome: usuario.nome,
                                  });
                                  setValue("proprietario_id", usuario.id, {
                                    shouldValidate: true,
                                  });
                                  setDialogOpen(false);
                                }}
                              >
                                <Text className="text-foreground text-sm font-outfit-medium">
                                  {usuario.nome}
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
                {errors.proprietario_id && (
                  <Text className="text-red-500 text-xs">
                    {errors.proprietario_id.message}
                  </Text>
                )}
              </View>

              {/* === NOME DA FAZENDA === */}
              <View className="items-start gap-2">
                <Text className="text-xs">Nome</Text>
                <Controller
                  control={control}
                  name="nome_fazenda"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      ref={nomeRef}
                      className={`rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul ${errors.nome_fazenda ? "border-red-500" : "border-secundaria-azul"}`}
                      placeholder="Exemplo"
                      autoCapitalize="words"
                      returnKeyType="next"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      onSubmitEditing={() => codigoRef.current?.focus()}
                    />
                  )}
                />
                {errors.nome_fazenda && (
                  <Text className="text-red-500 text-xs">
                    {errors.nome_fazenda.message}
                  </Text>
                )}
              </View>

              {/* // * CÓDIGO */}
              <View className="items-start gap-2">
                <Text className="text-xs">Código Cadastral</Text>
                <Controller
                  control={control}
                  name="codigo_identificacao"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      ref={codigoRef}
                      className={`rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul ${errors.codigo_identificacao ? "border-red-500" : "border-secundaria-azul"}`}
                      placeholder="ABC1234-5D"
                      autoCapitalize="characters"
                      returnKeyType="next"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      onSubmitEditing={() => enderecoRef.current?.focus()}
                    />
                  )}
                />
                {errors.codigo_identificacao && (
                  <Text className="text-red-500 text-xs">
                    {errors.codigo_identificacao.message}
                  </Text>
                )}
              </View>

              {/* // *  ENDEREÇO */}
              <View className="items-start gap-2">
                <Text className="text-xs">Endereço</Text>
                <Controller
                  control={control}
                  name="endereco"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      ref={enderecoRef}
                      className="rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul border-secundaria-azul"
                      placeholder="Rua Exemplo"
                      autoCapitalize="words"
                      returnKeyType="next"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      onSubmitEditing={() => latRef.current?.focus()}
                    />
                  )}
                />
              </View>

              {/* // * COORDENADAS (SEPARADAS */}
              {/* [WEB] Substituído w-[48%] por flex-1 para alinhamento fluído e preenchimento perfeito */}
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
                        returnKeyType="next"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        onSubmitEditing={() => cidadeRef.current?.focus()}
                      />
                    )}
                  />
                </View>
              </View>

              {/* // * CIDADE E ESTADO */}
              {/* [WEB] flex-1 nos containers filhos */}
              <View className="flex-row gap-3">
                <View className="items-start gap-2 flex-1">
                  <Text className="text-xs">Cidade</Text>
                  <Controller
                    control={control}
                    name="cidade"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        ref={cidadeRef}
                        className="rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul border-secundaria-azul"
                        placeholder="Exemplo"
                        autoCapitalize="words"
                        returnKeyType="next"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        onSubmitEditing={() => estadoRef.current?.focus()}
                      />
                    )}
                  />
                </View>
                <View className="items-start gap-2 flex-1">
                  <Text className="text-xs">Estado</Text>
                  <Controller
                    control={control}
                    name="estado"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        ref={estadoRef}
                        className={`rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul ${errors.estado ? "border-red-500" : "border-secundaria-azul"}`}
                        placeholder="MG"
                        autoCapitalize="characters"
                        maxLength={2}
                        returnKeyType="next"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        onSubmitEditing={() => areaRef.current?.focus()}
                      />
                    )}
                  />
                  {errors.estado && (
                    <Text className="text-red-500 text-xs">
                      {errors.estado.message}
                    </Text>
                  )}
                </View>
              </View>

              {/* // * ÁREA E CULTURA */}
              {/* [WEB] flex-1 nos containers filhos */}
              <View className="flex-row gap-3">
                <View className="items-start gap-2 flex-1">
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    className="text-xs"
                  >
                    Área Total (Hectares)
                  </Text>
                  <Controller
                    control={control}
                    name="area_total"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        ref={areaRef}
                        className="rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul border-secundaria-azul"
                        placeholder="1000"
                        keyboardType="numeric"
                        returnKeyType="next"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        onSubmitEditing={() => culturaRef.current?.focus()}
                      />
                    )}
                  />
                </View>
                <View className="items-start gap-2 flex-1">
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    className="text-xs"
                  >
                    Culturas (Separar por vírgula)
                  </Text>
                  <Controller
                    control={control}
                    name="cultura"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        ref={culturaRef}
                        className="rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul border-secundaria-azul"
                        placeholder="Café, Soja"
                        autoCapitalize="words"
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

            {/* // * BOTÕES DE AÇÃO */}
            {/* Mantidos dentro da view web:max-w-2xl para acompanhar a largura do form */}
            <View className="flex-row items-center w-full gap-4 mt-5">
              <Button
                className="bg-incorreto rounded-none rounded-pluvia flex-1 h-[40px]"
                onPress={() => {
                  if (router.canGoBack()) router.back();
                  else router.push("/(tabs)/menu");
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
