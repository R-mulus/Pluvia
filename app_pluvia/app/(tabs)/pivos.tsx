// ! CÓDIGO DE EXEMPLO
import { useState } from "react";
import * as React from "react";
import { View, Pressable, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { useRouter, type Href } from "expo-router";
import PivotCard from "@/components/custom/PivotCard";
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
import Header from "@/components/custom/Header";

const fazendas = [
  { id: 1, label: "Fazenda 1", value: "fazenda_1" },
  { id: 2, label: "Fazenda 2", value: "fazenda_2" },
  { id: 3, label: "Fazenda 3", value: "fazenda_3" },
];

export default function ListaDePivos() {
  const ref = React.useRef<TriggerRef>(null);
  const [open, setOpen] = useState(false); // Estado para controlar a abertura do Select
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
    { id: "1", nome: "Pivô 1", voltagem: 384 },
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
    <View className="flex-1 justify-center bg-bg gap-2 px-4 py-6 overflow-scroll">
      <Text className="text-2xl font-outfit-bold text-foreground">Pivôs</Text>

      <View className="flex-row justify-between items-center">
        <Header title="Pivôs" subtitle="AXC23KJ09P" />

        <Select
          onOpenChange={setOpen}
          className="rounded-[12px] active:opacity-50"
        >
          <SelectTrigger
            ref={ref}
            className={`
          w-[180px] border-[1px] border-b-[1px] border-[#b8b8b8] rounded-[12px] bg-white
          ${open ? "rounded-b-none border-b-0" : "rounded-[12px]"} 
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
      <Dialog>
        <DialogTrigger asChild>
          <Pressable className="active:opacity-50 bg-primaria-azul rounded-[12] w-[40] h-[40] items-center justify-center self-end">
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

      <FlashList
        className="flex-1"
        data={pivos}
        // injetando os dados no Card
        renderItem={({ item }) => <PivotCard waterOn={false}/>}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />

      {/* Botão de Teste para fazer Logout */}
      <Button
        variant="destructive"
        className="w-full"
        onPress={() => router.replace("/" as Href)}
      >
        <Text>Sair (Voltar pro Login)</Text>
      </Button>
      <Button
        className="w-full"
        onPress={() => router.replace("/(tabs)/analise")}
      >
        <Text>Ir para Análise</Text>
      </Button>

      <Button
        className="w-full"
        onPress={() => router.replace("/pivos/presets")}
      >
        <Text>Ir para Presets</Text>
      </Button>
    </View>
  );
}
