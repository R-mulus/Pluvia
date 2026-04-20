// ! CÓDIGO DE EXEMPLO
import { useState } from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useRouter, type Href } from "expo-router";
import Header from "@/components/custom/Header";
import { FlashList } from "@shopify/flash-list";
import PresetCard from "@/components/custom/PresetCard";

export default function Presets() {
  const [predefinicoes, setPredefinicoes] = useState([
    { id: "1", nome: "Pivô 1", voltagem: 384 },
    { id: "2", nome: "Pivô 2", voltagem: 380 },
    { id: "3", nome: "Pivô Sul", voltagem: 390 },
    { id: "4", nome: "Pivô Norte", voltagem: 390 },
    
  ]);

  const router = useRouter();

  return (
    <View className="flex-1 justify-center bg-bg gap-4 px-4 py-10 overflow-scroll">

      <View className="flex-row justify-between items-center self-start">
        <Header title="Predefinições - Todos" subtitle="PRX18732MXI" />
      </View>

      <FlashList
        className="flex-1"
        data={predefinicoes}
        // injetando os dados no Card
        renderItem={({ item }) => <PresetCard />}
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
    </View>
  );
}
