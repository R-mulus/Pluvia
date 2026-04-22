import { View, KeyboardAvoidingView, Platform, StyleSheet } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Input } from "@/components/ui/input";
import { User, Lock } from "lucide-react-native";

export default function Login() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      {/* // * Imagem de Fundo Absoluta */}
      <Image
        source={require("../../assets/images/background_p.jpg")}
        contentFit="cover"
        transition={250}
        className="absolute"
        style={StyleSheet.absoluteFillObject} // Força o Android a esticar a imagem
      />

      {/* // * Conteúdo da Tela */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 p-4 gap-6 mt-10 pt-10"
      >

        {/* // * Logo */}
        <View className="items-center">
          <Image
            source={require("../../assets/images/logo.png")}
            contentFit="contain"
            style={{ width: 150, height: 60 }}
          />
        </View>

        {/* // * Container de Login */}
        <View className="w-full p-6 gap-8">
          {/* Container de campos de input */}
          <View className="gap-3">
            <Text className="text-base font-outfit-medium text-texto text-start">
              Faça seu Login
            </Text>
            {/* Campo de Usuário */}
            <View className="flex-row items-center border-[2px] border-[#B8B8B8] bg-white rounded-xl overflow-hidden h-10">
              {/* Ícone */}
              <View className="bg-secundaria-azul w-12 h-full items-center justify-center rounded-br-lg">
                <User size={24} color="white" strokeWidth={2.5}/>
              </View>
              <Input
                placeholder="Usuário"
                className="border-0 h-full px-4 bg-white"
              />
            </View>

            {/* Campo de Senha */}
            <View className="flex-row items-center border-[2px] border-[#B8B8B8] bg-white rounded-xl overflow-hidden h-10">
              {/* ícone */}
              <View className="bg-secundaria-azul w-12 h-full items-center justify-center">
                <Lock size={24} color="white" strokeWidth={2.5}/>
              </View>
              <Input
                placeholder="Senha"
                secureTextEntry
                className="border-0 h-full px-4 bg-white"
              />
            </View>
          </View>

          {/* // * Botão de "Entrar" e "Esqueci minha senha" */}
          <View className="gap-3">
            <Button
              className="bg-primaria-azul h-10 rounded-tl-none rounded-br-none rounded-bl-[10] rounded-tr-[10] text-bg"
              onPress={() => router.replace("/(tabs)/pivos")}
            >
              <Text className="font-outfit">Entrar</Text>
            </Button>

            <Text className="text-subtexto text-center text-sm">
              Esqueci minha senha
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}
