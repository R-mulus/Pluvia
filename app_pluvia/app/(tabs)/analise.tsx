// ! CÓDIGO DE EXEMPLO
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useRouter, type Href } from "expo-router";

export default function Analises() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-background gap-6 p-4">
      <Text className="text-2xl font-outfit-bold text-foreground">
        Análises
      </Text>

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
        onPress={() => router.replace("/(tabs)/pivos")}
      >
        <Text>Ir para Pivôs</Text>
      </Button>
    </View>
  );
}
