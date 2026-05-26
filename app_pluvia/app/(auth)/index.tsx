/**
 * ✅ [PORTABILIDADE WEB CONCLUÍDA]
 * * MODIFICAÇÕES REALIZADAS PARA ADAPTAÇÃO WEB:
 * 1. LARGURA MÁXIMA: Adicionado 'max-w-[450px] mx-auto' no container do formulário para não esticar infinitamente em telas grandes (mas mantendo o visual transparente exato do mobile).
 * 2. REMOÇÃO DE OUTLINE (FIX TS): Ajuste via Style para remover a borda azul padrão (focus-ring) dos navegadores, utilizando 'as any' para não gerar erro no TypeScript.
 * 3. FEEDBACK DE MOUSE: Inclusão de classes 'hover' e 'cursor-pointer' para elementos clicáveis.
 * 4. IMAGEM DE FUNDO: Forçada a largura e altura 100% ('w-full h-full') na imagem para cobrir monitores widescreen.
 * * * CORREÇÕES APLICADAS (Design Original e Ajustes Manuais):
 * - Restaurado o posicionamento vertical original (mais para o topo) para respeitar a composição da imagem de fundo (removido o justify-center).
 * - Removido o 'rounded-br-lg' da view do ícone de Usuário.
 * - Alterada a cor do texto "Esqueci minha senha" para 'text-bg'.
 * - Restaurados os tamanhos originais (h-10) dos inputs/botões e paddings originais.
 */

import {
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Pressable,
} from "react-native";
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
      {/* // * Imagem de Fundo */}
      <Image
        source={require("../../assets/images/background_p.jpg")}
        contentFit="cover"
        transition={250}
        className="absolute w-full h-full"
        style={StyleSheet.absoluteFillObject}
      />

      {/* // * Container Principal */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        // Restaurado o alinhamento vertical original (mt-10 pt-10) sem o justify-center
        className="flex-1 w-full p-4 gap-6 mt-10 pt-10"
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
        <View className="w-full p-6 gap-8 max-w-[450px] mx-auto">
          {/* Container de campos de input */}
          <View className="gap-3">
            <Text className="text-base font-outfit-medium text-texto text-start md:text-center">
              Faça seu Login
            </Text>

            {/* Campo de Usuário */}
            <View className="flex-row items-center border-[2px] border-[#B8B8B8] bg-white rounded-xl overflow-hidden h-10">
              {/* Removido o rounded-br-lg conforme solicitado */}
              <View className="bg-secundaria-azul w-12 h-full items-center justify-center">
                <User size={24} color="white" strokeWidth={2.5} />
              </View>

              <Input
                placeholder="Usuário"
                className="border-0 h-full px-4 bg-white flex-1"
                style={Platform.OS === "web" ? ({ outline: "none" } as any) : {}}
              />
            </View>

            {/* Campo de Senha */}
            <View className="flex-row items-center border-[2px] border-[#B8B8B8] bg-white rounded-xl overflow-hidden h-10">
              {/* ícone */}
              <View className="bg-secundaria-azul w-12 h-full items-center justify-center">
                <Lock size={24} color="white" strokeWidth={2.5} />
              </View>

              <Input
                placeholder="Senha"
                secureTextEntry
                className="border-0 h-full px-4 bg-white flex-1"
                style={Platform.OS === "web" ? ({ outline: "none" } as any) : {}}
              />
            </View>
          </View>

          {/* // * Botão de "Entrar" e "Esqueci minha senha" */}
          <View className="gap-3">
            <Button
              className="bg-primaria-azul h-10 rounded-tl-none rounded-br-none rounded-bl-[10] rounded-tr-[10] text-bg hover:opacity-90 transition-opacity cursor-pointer"
              onPress={() => router.replace("/(tabs)/pivos/")}
            >
              <Text className="font-outfit text-white">Entrar</Text>
            </Button>

            <Pressable className="active:opacity-50 hover:opacity-70 transition-opacity cursor-pointer">
              {/* Alterada a cor do texto para text-bg conforme solicitado */}
              <Text className="text-bg text-center text-sm underline">
                Esqueci minha senha
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}