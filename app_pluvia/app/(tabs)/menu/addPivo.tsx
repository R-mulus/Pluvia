import React, { useRef, useState } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
// import { useRouter } from "expo-router";
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

// * MOCKS DE DADOS
const fazendas = [
  { id: 1, label: "Fazenda Manjubinha", value: "manjubinha" },
  { id: 2, label: "Fazenda Santa Tereza", value: "santa_tereza" },
  { id: 3, label: "Fazenda Boa Vista", value: "boa_vista" },
];

const operadores = [
  { id: 1, label: "Renan da Towner Azul bebê", value: "renan_towner" },
  { id: 2, label: "João Pedro Pereira", value: "joao_pedro" },
  { id: 3, label: "Mateus Xavier", value: "mateus_xavier" },
  { id: 4, label: "Bernardo Cunha", value: "bernardo_cunha" },
];

export default function CadastrarPivo() {
  // const router = useRouter();

  // 1. ESTADOS INDEPENDENTES PARA CADA DIALOG
  const [dialogFazendaOpen, setDialogFazendaOpen] = useState(false);
  const [selectedFazenda, setSelectedFazenda] = useState<
    (typeof fazendas)[0] | null
  >(null);

  const [dialogOperadorOpen, setDialogOperadorOpen] = useState(false);
  const [selectedOperador, setSelectedOperador] = useState<
    (typeof operadores)[0] | null
  >(null);

  // 2. REFS CORRIGIDAS PARA OS CAMPOS DO PIVÔ
  const nomeRef = useRef<TextInput>(null);
  const codigoSerieRef = useRef<TextInput>(null);
  const vazaoRef = useRef<TextInput>(null);
  const modeloRef = useRef<TextInput>(null);
  const marcaRef = useRef<TextInput>(null);
  const raioRef = useRef<TextInput>(null);
  const latRef = useRef<TextInput>(null);
  const longRef = useRef<TextInput>(null);

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
          <Header title="Cadastrar Pivô" subtitle="AXCP2134HIM" />

          <View className="w-full gap-3">
            <View className="gap-4 w-full">
              {/* === DIALOG DA FAZENDA === */}
              <View className="items-start gap-2">
                <Text className="text-xs">Fazenda</Text>

                <Dialog
                  open={dialogFazendaOpen}
                  onOpenChange={setDialogFazendaOpen}
                >
                  <DialogTrigger asChild>
                    <Pressable className="flex-row items-center border-[2px] border-[#b8b8b8] bg-white w-full overflow-hidden rounded-[12px] h-[48px]">
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
                            ? selectedFazenda.label
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

                    <View className="grid gap-4">
                      <View className="grid gap-2">
                        <Label
                          htmlFor="buscar-fazenda"
                          className="text-muted-foreground text-xs font-outfit"
                        >
                          Buscar Fazenda
                        </Label>
                        <Input
                          id="buscar-fazenda"
                          placeholder="Nome da Fazenda"
                          className="h-10"
                        />
                      </View>

                      <View className="h-[240px] bg-popover border-border rounded-md border shadow-md shadow-black/5 p-1">
                        <ScrollView
                          showsVerticalScrollIndicator={true}
                          keyboardShouldPersistTaps="handled"
                        >
                          {fazendas.map((fazenda) => {
                            const isSelected =
                              selectedFazenda?.value === fazenda.value;
                            return (
                              <TouchableOpacity
                                key={fazenda.id}
                                activeOpacity={0.7}
                                className={`relative flex w-full flex-row items-center gap-2 rounded-sm py-2 pl-2 pr-8 ${isSelected ? "bg-accent" : "active:bg-accent"}`}
                                onPress={() => {
                                  setSelectedFazenda(fazenda);
                                }}
                              >
                                <Text className="text-foreground text-sm font-outfit-medium">
                                  {fazenda.label}
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
                      </View>
                    </View>

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button className="rounded-xl bg-primaria-azul">
                          <Text className="text-white">Ok</Text>
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </View>

              {/* === DIALOG DO OPERADOR RESPONSÁVEL === */}
              <View className="items-start gap-2">
                <Text className="text-xs">Operador Responsável</Text>

                <Dialog
                  open={dialogOperadorOpen}
                  onOpenChange={setDialogOperadorOpen}
                >
                  <DialogTrigger asChild>
                    <Pressable className="flex-row items-center border-[2px] border-[#b8b8b8] bg-white w-full overflow-hidden rounded-[12px] h-[48px]">
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
                            ? selectedOperador.label
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

                    <View className="grid gap-4">
                      <View className="grid gap-2">
                        <Label
                          htmlFor="buscar-operador"
                          className="text-muted-foreground text-xs font-outfit"
                        >
                          Buscar Operador
                        </Label>
                        <Input
                          id="buscar-operador"
                          placeholder="Nome do Operador"
                          className="h-10"
                        />
                      </View>

                      <View className="h-[240px] bg-popover border-border rounded-md border shadow-md shadow-black/5 p-1">
                        <ScrollView
                          showsVerticalScrollIndicator={true}
                          keyboardShouldPersistTaps="handled"
                        >
                          {operadores.map((operador) => {
                            const isSelected =
                              selectedOperador?.value === operador.value;
                            return (
                              <TouchableOpacity
                                key={operador.id}
                                activeOpacity={0.7}
                                className={`relative flex w-full flex-row items-center gap-2 rounded-sm py-2 pl-2 pr-8 ${isSelected ? "bg-accent" : "active:bg-accent"}`}
                                onPress={() => {
                                  setSelectedOperador(operador);
                                }}
                              >
                                <Text className="text-foreground text-sm font-outfit-medium">
                                  {operador.label}
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
                      </View>
                    </View>

                    <DialogFooter>
                      <DialogClose asChild>
                        <Button className="rounded-xl bg-primaria-azul">
                          <Text className="text-white">Ok</Text>
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </View>

              {/* === RESTANTE DOS INPUTS === */}
              <View className="items-start gap-2">
                <Text className="text-xs">Nome</Text>
                <Input
                  ref={nomeRef}
                  className="rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul"
                  placeholder="Exemplo"
                  keyboardType="default"
                  autoCapitalize="words"
                  returnKeyType="next"
                  onSubmitEditing={() => codigoSerieRef.current?.focus()}
                />
              </View>

              <View className="items-start gap-2">
                <Text className="text-xs">Código de Série</Text>
                <Input
                  ref={codigoSerieRef}
                  className="rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul"
                  placeholder="ABC1234-5D"
                  keyboardType="default"
                  autoCapitalize="characters" // Códigos de série geralmente são maiúsculos
                  returnKeyType="next"
                  onSubmitEditing={() => vazaoRef.current?.focus()}
                />
              </View>

              <View className="items-start gap-2">
                <Text className="text-xs">Vazão</Text>
                <Input
                  ref={vazaoRef}
                  className="rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul"
                  placeholder="123 L/h"
                  keyboardType="default" // Default para permitir letras como "L/h"
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => modeloRef.current?.focus()}
                />
              </View>

              <View className="items-start gap-2">
                <Text className="text-xs">Modelo</Text>
                <Input
                  ref={modeloRef}
                  className="rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul"
                  placeholder="Exemplo"
                  keyboardType="default"
                  autoCapitalize="words"
                  returnKeyType="next"
                  onSubmitEditing={() => marcaRef.current?.focus()}
                />
              </View>

              <View className="flex-row gap-3">
                <View className="items-start gap-2 w-[48%]">
                  <Text className="text-xs">Marca</Text>
                  <Input
                    ref={marcaRef}
                    className="rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul"
                    placeholder="Exemplo"
                    keyboardType="default"
                    autoCapitalize="words"
                    returnKeyType="next"
                    onSubmitEditing={() => raioRef.current?.focus()}
                  />
                </View>
                <View className="items-start gap-2 w-[48%]">
                  <Text className="text-xs">Raio do Pivô</Text>
                  <Input
                    ref={raioRef}
                    className="rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul"
                    placeholder="12 km"
                    keyboardType="numbers-and-punctuation"
                    returnKeyType="next"
                    onSubmitEditing={() => latRef.current?.focus()}
                  />
                </View>
              </View>

              <View className="flex-row gap-3">
                <View className="items-start gap-2 w-[48%]">
                  <Text className="text-xs">Coordenadas</Text>
                  <Input
                    ref={latRef}
                    className="rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul"
                    placeholder="Lat -12.3456"
                    keyboardType="numbers-and-punctuation"
                    returnKeyType="next"
                    onSubmitEditing={() => longRef.current?.focus()}
                  />
                </View>
                <View className="items-start gap-2 w-[48%]">
                  <Text className="text-xs text-transparent">.</Text>
                  <Input
                    ref={longRef}
                    className="rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul"
                    placeholder="Long -12.3456"
                    keyboardType="numbers-and-punctuation"
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
