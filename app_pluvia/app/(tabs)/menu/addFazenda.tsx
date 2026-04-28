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
import { useRouter } from "expo-router";
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
import { User, Check, ChevronRight } from "lucide-react-native";

// * MOCKS DE CLIENTES (Proprietários)
const clientes = [
  { id: 1, label: "Renan da Towner Azul bebê", value: "renan_towner" },
  { id: 2, label: "Fazenda Boa Vista S/A", value: "boa_vista" },
  { id: 3, label: "Agropecuária Silva", value: "agro_silva" },
  { id: 4, label: "João Pedro Pereira", value: "joao_pedro" },
  { id: 5, label: "Mateus Xavier", value: "mateus_xavier" },
  { id: 6, label: "Mateus Xavier", value: "mateus_xavier" },
  { id: 7, label: "Mateus Xavier", value: "mateus_xavier" },
  { id: 8, label: "Mateus Xavier", value: "mateus_xavier" },
  { id: 9, label: "Mateus Xavier", value: "mateus_xavier" },
  { id: 10, label: "Mateus Xavier", value: "mateus_xavier" },
  { id: 11, label: "Mateus Xavier", value: "mateus_xavier" },
  { id: 12, label: "Mateus Xavier", value: "mateus_xavier" },
  { id: 13, label: "Mateus Xavier", value: "mateus_xavier" },
  { id: 14, label: "Mateus Xavier", value: "mateus_xavier" },
  { id: 15, label: "Mateus Xavier", value: "mateus_xavier" },
];

export default function CadastrarFazenda() {
  const router = useRouter();

  // Estados do Dialog e do Cliente selecionado
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState<
    (typeof clientes)[0] | null
  >(null);

  // REFS PARA OS CAMPOS DE FAZENDA
  const nomeRef = useRef<TextInput>(null);
  const codigoRef = useRef<TextInput>(null);
  const enderecoRef = useRef<TextInput>(null);
  const latRef = useRef<TextInput>(null);
  const longRef = useRef<TextInput>(null);
  const cidadeRef = useRef<TextInput>(null);
  const estadoRef = useRef<TextInput>(null);
  const areaRef = useRef<TextInput>(null);
  const culturaRef = useRef<TextInput>(null);

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

          <View className="w-full gap-3">
            {/* FORMULÁRIO */}
            <View className="gap-4 w-full">
              {/* === DIALOG DO PROPRIETÁRIO === */}
              <View className="items-start gap-2">
                <Text className="text-xs">Proprietário</Text>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  {/* TRIGGER (O BOTÃO QUE ABRE O DIALOG) */}
                  <DialogTrigger asChild>
                    <Pressable className="flex-row items-center border-[2px] border-[#b8b8b8] bg-white w-full overflow-hidden rounded-[12px] h-[40px]">
                      <View className="bg-[#00A0A6] px-4 items-center justify-center h-[40px] w-[40px]">
                        <User color="white" size={24} strokeWidth={2.5}/>
                      </View>
                      <View className="flex-1 px-3 items-start justify-center">
                        <Text
                          className={
                            selectedCliente
                              ? "text-[#0D0D0D] text-sm font-outfit-medium"
                              : "text-muted-foreground text-sm font-outfit-medium"
                          }
                        >
                          {selectedCliente
                            ? selectedCliente.label
                            : "Selecione um proprietário"}
                        </Text>
                      </View>
                      <View className="px-4 items-center justify-center h-[40px] w-[40px]">
                        <ChevronRight color="black" size={16}/>
                      </View>
                    </Pressable>
                  </DialogTrigger>

                  {/* CONTEÚDO DO DIALOG */}
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Proprietário</DialogTitle>
                      <DialogDescription>
                        Selecione o cliente cadastrado proprietário da fazenda
                      </DialogDescription>
                    </DialogHeader>

                    <View className="grid gap-4 ">
                      {/* BARRA DE BUSCA */}
                      <View className="grid gap-2">
                        
                        <Label
                          htmlFor="buscar-cliente"
                          className="text-muted-foreground text-xs font-outfit"
                        >
                          Buscar Cliente
                        </Label>
                        <Input
                          id="buscar-cliente"
                          placeholder="Nome do Cliente"
                          className="h-10"
                        />
                      </View>

                      {/* LISTA COM ALTURA FIXA E SCROLL (Estilo espelhado do SelectContent) */}
                      {/* Usei bg-popover, border-border, shadow-md e p-1 que vêm direto do seu select.tsx */}
                      <View className="h-[240px] bg-popover border-border rounded-md border shadow-md shadow-black/5 px-1">
                        <ScrollView
                          showsVerticalScrollIndicator={true}
                          keyboardShouldPersistTaps="handled"
                        >
                          {clientes.map((cliente) => {
                            const isSelected =
                              selectedCliente?.value === cliente.value;

                            return (
                              <TouchableOpacity
                                key={cliente.id}
                                activeOpacity={0.7}
                                // Classes espelhadas exatamente do SelectItem
                                className={`relative flex w-full flex-row items-center gap-2 rounded-sm py-2 pl-2 pr-8 ${
                                  isSelected ? "bg-[#E1E1E1]" : "active:bg-[#E1E1E1]"
                                }`}
                                onPress={() => {
                                  setSelectedCliente(cliente);
                                  // setDialogOpen(false); // Fecha o Dialog automaticamente ao escolher
                                }}
                              >
                                {/* Texto espelhado do SelectPrimitive.ItemText */}
                                <Text className="text-foreground text-sm font-outfit-medium">
                                  {cliente.label}
                                </Text>

                                {/* Ícone Check espelhado do SelectPrimitive.ItemIndicator */}
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
                  onSubmitEditing={() => codigoRef.current?.focus()}
                />
              </View>

              <View className="items-start gap-2">
                <Text className="text-xs">Código Cadastral</Text>
                <Input
                  ref={codigoRef}
                  className="rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul"
                  placeholder="ABC1234-5D"
                  keyboardType="default"
                  autoCapitalize="characters"
                  returnKeyType="next"
                  onSubmitEditing={() => enderecoRef.current?.focus()}
                />
              </View>

              <View className="items-start gap-2">
                <Text className="text-xs">Endereço</Text>
                <Input
                  ref={enderecoRef}
                  className="rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul"
                  placeholder="Rua Exemplo"
                  keyboardType="default"
                  autoCapitalize="words"
                  returnKeyType="next"
                  onSubmitEditing={() => latRef.current?.focus()}
                />
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
                    returnKeyType="next"
                    onSubmitEditing={() => cidadeRef.current?.focus()}
                  />
                </View>
              </View>

              <View className="flex-row gap-3">
                <View className="items-start gap-2 w-[48%]">
                  <Text className="text-xs">Cidade</Text>
                  <Input
                    ref={cidadeRef}
                    className="rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul"
                    placeholder="Exemplo"
                    keyboardType="default"
                    autoCapitalize="words"
                    returnKeyType="next"
                    onSubmitEditing={() => estadoRef.current?.focus()}
                  />
                </View>
                <View className="items-start gap-2 w-[48%]">
                  <Text className="text-xs">Estado</Text>
                  <Input
                    ref={estadoRef}
                    className="rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul"
                    placeholder="Exemplo"
                    keyboardType="default"
                    autoCapitalize="words"
                    returnKeyType="next"
                    onSubmitEditing={() => areaRef.current?.focus()}
                  />
                </View>
              </View>

              <View className="flex-row gap-3">
                <View className="items-start gap-2 w-[48%]">
                  <Text className="text-xs">Área Total (Hectares)</Text>
                  <Input
                    ref={areaRef}
                    className="rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul"
                    placeholder="1000"
                    keyboardType="numeric"
                    returnKeyType="next"
                    onSubmitEditing={() => culturaRef.current?.focus()}
                  />
                </View>
                <View className="items-start gap-2 w-[48%]">
                  <Text className="text-xs">Tipo de Cultura</Text>
                  <Input
                    ref={culturaRef}
                    className="rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul"
                    placeholder="Café"
                    keyboardType="default"
                    autoCapitalize="words"
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
