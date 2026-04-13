// ! CÓDIGO DE EXEMPLO
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2Icon } from 'lucide-react-native';

export default function Login() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-background gap-6 p-4">
      <Text className="text-3xl font-outfit-bold text-primary">Pluvia</Text>
      <Text className="text-muted-foreground text-center">
        (Aqui vai entrar o formulário de login com Zod depois)
      </Text>

      <Alert icon={CheckCircle2Icon}>
        <AlertTitle>Success! Your changes have been saved</AlertTitle>
        <AlertDescription>This is an alert with icon, title and description.</AlertDescription>
      </Alert>

      {/* Botão de Teste para pular o login */}
      <Button 
        className="w-full h-14" 
        onPress={() => router.replace("/(tabs)/pivos")}
      >
        <Text>Entrar (Modo Teste)</Text>
      </Button>
    </View>
  );
}