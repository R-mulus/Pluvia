/**
 * ✅ [PORTABILIDADE WEB CONCLUÍDA]
 * * MODIFICAÇÕES REALIZADAS PARA ADAPTAÇÃO WEB:
 * 1. GRID RESPONSIVO: Adicionado 'useWindowDimensions' para detectar a largura da tela dinamicamente. 
 * - Mobile (< 768px): 1 Coluna
 * - Tablet/Laptop (< 1150px): 2 Colunas
 * - Monitor Desktop: 4 Colunas
 * O 'numColumns' do FlashList foi vinculado a este cálculo.
 * 2. FEEDBACK DE MOUSE: 'cursor-pointer' e 'hover' adicionados ao botão de filtro e ao select.
 * 3. LAYOUT: Inserida uma View como wrapper para manter os elementos organizados mesmo quando a lista preencher múltiplas colunas.
 * 4. ATUALIZAÇÃO (FlashList v2.0.2): Removido o 'estimatedItemSize' pois o cálculo agora é automático na versão atual da biblioteca.
 */


import { useState } from "react";
import * as React from "react";
// [WEB] Importado 'useWindowDimensions' para controlar o Grid do FlashList na web
import { View, Pressable, Platform, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { useRouter, type Href } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { Funnel } from "lucide-react-native";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TriggerRef } from "@rn-primitives/select";

// ! IMPORTS CUSTOM
import { Screen } from "@/components/custom/Screen";
import Header from "@/components/custom/Header";
import PivotCard from "@/components/custom/PivotCard";

const fazendas = [
  { id: 1, label: "Fazenda 1", value: "fazenda_1" },
  { id: 2, label: "Fazenda 2", value: "fazenda_2" },
  { id: 3, label: "Fazenda 3", value: "fazenda_3" },
];

export default function ListaDePivos() {
  const ref = React.useRef<TriggerRef>(null);
  const [open, setOpen] = useState(false); // Estado para controlar a abertura do Select
  
  // [WEB] Ler a largura atual da tela
  const { width } = useWindowDimensions();

  const getColunas = () => {
    if (width >= 1650) return 4; 
    if (width >= 1250) return 3; 
    if (width >= 870) return 2; 
    return 1;                   
  };

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: Platform.select({
      ios: insets.bottom,
      android: insets.bottom + 24,
    }),
    left: 12,
    right: 12,
  };
  const router = useRouter();

  const [pivos, setPivos] = useState([
    { id: "1", nome: "Pivôkkkkkkkkkkkkkkkkkkkkkk", voltagem: 384 },
    { id: "2", nome: "Pivô 2", voltagem: 380 },
    { id: "3", nome: "Pivô Sul", voltagem: 390 },
    { id: "4", nome: "Pivô Norte", voltagem: 390 },
    { id: "5", nome: "Pivô Sul", voltagem: 390 },
    { id: "6", nome: "Pivô Sul", voltagem: 390 },
    { id: "7", nome: "Pivô Sul", voltagem: 390 },
    { id: "8", nome: "Pivô Sul", voltagem: 390 },
    { id: "9", nome: "Pivô Sul", voltagem: 390 },
    { id: "10", nome: "Pivô Sul", voltagem: 390 },
    { id: "11", nome: "Pivô Sul", voltagem: 390 },
  ]);

  return (
    <Screen className="justify-center overflow-scroll">

      {/* // * Cabeçalho */}
      <View className="flex-row justify-between items-center mb-4">
        <Header title="Pivôs" subtitle="AXC23KJ09P" />

        <Select
          onOpenChange={setOpen}
          className="rounded-[12px] active:opacity-50"
        >
          <SelectTrigger
            ref={ref}
            // [WEB] Adicionado cursor-pointer e hover:opacity-90
            className={`
          w-[180px] border-[1px] border-b-[1px] border-[#b8b8b8] rounded-[12px] bg-white cursor-pointer hover:opacity-90
          ${open ? "rounded-b-none border-b-0" : "rounded-[12px] border-b-[1px]"} 
        `}
          >
            <SelectValue placeholder="Fazendas" />
          </SelectTrigger>
          <SelectContent
            insets={contentInsets}
            className={`
          w-[180px] border-[#b8b8b8] bg-white
          ${open ? "rounded-t-none" : "rounded-xl"}
        `}
          >
            <SelectGroup>
              {/* <SelectLabel>Fruits</SelectLabel> */}
              {fazendas.map((fazenda) => (
                <SelectItem
                  key={fazenda.value}
                  label={fazenda.label}
                  value={fazenda.value}
                  className={
                    Number(fazenda.id) % 2 !== 0
                      ? "bg-[#E1E1E1]"
                      : "bg-transparent"
                  }
                >
                  {fazenda.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </View>

      {/* Filtro */}
      <View className="mb-4">
        <Dialog>
          <DialogTrigger asChild>
            {/* [WEB] Adicionado cursor-pointer e hover:opacity-80 */}
            <Pressable className="active:opacity-50 bg-primaria-azul rounded-[12] w-[40] h-[40] items-center justify-center self-end cursor-pointer hover:opacity-80 transition-opacity">
              <Funnel size={24} color="white" strokeWidth={2.5} />
            </Pressable>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Filtro</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <View className="grid gap-4">
              <View className="grid gap-3">
                <Label htmlFor="name-1">Name</Label>
                <Input id="name-1" defaultValue="Pedro Duarte" />
              </View>
              <View className="grid gap-3">
                <Label htmlFor="username-1">Username</Label>
                <Input id="username-1" defaultValue="@peduarte" />
              </View>
            </View>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">
                  <Text>Cancel</Text>
                </Button>
              </DialogClose>
              <Button>
                <Text>Save changes</Text>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </View>

      {/* [WEB] numColumns agora é dinâmico (getColunas()). O 'key' precisa ser forçado a mudar quando as colunas mudam. */}
      <View className="flex-1 -mx-2">
        <FlashList
          key={`colunas-${getColunas()}`} 
          className="flex-1"
          data={pivos}
          numColumns={getColunas()}
          // injetando os dados no Card
          renderItem={({ item }) => <PivotCard id={item.id} nome={item.nome} waterOn anguloAtual={30} anguloFinal={270} anguloInicio={0} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Screen>
  );
}