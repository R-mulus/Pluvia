// ! CÓDIGO DE EXEMPLO
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useRouter, type Href } from "expo-router";

export default function CadastrarPivo() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-background gap-6 p-4">
      <Text className="text-3xl font-outfit-bold text-primary">Pluvia</Text>
      <Text className="text-muted-foreground text-center">
        Cadastrar Pivô
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
        onPress={() => router.replace("/menu/fazenda")}
      >
        <Text>Ir para Cadastrar Fazenda</Text>
      </Button>
      <Button
        className="w-full"
        onPress={() => router.replace("/menu/usuario")}
      >
        <Text>Ir para Cadastrar Usuário</Text>
      </Button>
    </View>
  );
}