/**
 * ✅ [PORTABILIDADE WEB CONCLUÍDA]
 * * MODIFICAÇÕES REALIZADAS PARA ADAPTAÇÃO WEB:
 * 1. FEEDBACK DE MOUSE: Inclusão de 'cursor-pointer' e 'hover:opacity-80' nos botões clicáveis.
 * 2. LARGURA TOTAL: Removida a limitação de largura máxima para que os ícones fiquem nos cantos extremos da tela na Web, conforme design original.
 * * * CORREÇÕES APLICADAS (Revisão de Layout Web):
 * - SAFE AREA CORRETA: Isolado o 'insets.top' apenas para mobile. Na web, o paddingTop é 0, evitando espaço fantasma.
 * - POSICIONAMENTO DA LOGO: Utilizado 'inset-0' absoluto sem padding (pb-3) para centralização matemática perfeita.
 * - ESTILIZAÇÃO DE IMAGEM: Altura e largura passadas diretamente via 'style' no componente Image para maior estabilidade de renderização no DOM do navegador.
 */

import React from "react";
import { View, Image, TouchableOpacity, Text, Platform, DeviceEventEmitter } from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, Bell, Menu } from "lucide-react-native";

type TopBarProps = {
  showBackButton?: boolean;
  notificationCount?: number;
  onNotificationPress?: () => void;
};

export default function TopBar({
  showBackButton = true,
  notificationCount = 0,
  onNotificationPress,
}: TopBarProps) {
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // === LÓGICA DAS GAVETAS ===
  const abrirNotificacoes = () => {
    if (onNotificationPress) onNotificationPress(); 
    DeviceEventEmitter.emit('MUDAR_GAVETA', 'notificacoes'); 
    navigation.dispatch(DrawerActions.openDrawer()); 
  };

  const abrirPerfil = () => {
    DeviceEventEmitter.emit('MUDAR_GAVETA', 'perfil'); 
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View
      className="bg-[#00A0A6] rounded-b-[24px]"
      style={{
        paddingTop: Platform.OS !== "web" 
            ? Platform.OS === "android" 
                ? insets.top + 10 
                : insets.top 
            : 0,
        paddingHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
      }}
    >
      {/* Removido o max-w-[1200px] e mx-auto. Agora o w-full garante que ocupe 100% da tela */}
      <View className="flex-row items-center justify-between h-16 relative w-full">
        
        {/* Esquerda: Botão Voltar */}
        <View className="z-10 items-start justify-center">
          {showBackButton && (
            <TouchableOpacity 
                onPress={() => router.back()} 
                activeOpacity={0.7} 
                className="p-1 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <ChevronLeft color="white" size={28} />
            </TouchableOpacity>
          )}
        </View>

        {/* Centro: Logo */}
        <View className="absolute inset-0 items-center justify-center pointer-events-none">
          <Image
            source={require("../../assets/images/logo_branca.png")}
            style={{
              width: 112,
              height: 32,
            }}
            resizeMode="contain"
          />
        </View>

        {/* Direita: Menu e Notificações */}
        <View className="z-10 items-end justify-center flex-row gap-4">
          
          <TouchableOpacity 
            onPress={abrirNotificacoes} 
            activeOpacity={0.7} 
            className="p-1 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <View>
              <Bell color="white" size={24} />
              {notificationCount > 0 && (
                <View className="absolute -top-1.5 -right-1.5 bg-[#E52207] rounded-full w-5 h-5 items-center justify-center">
                  <Text className="text-white font-bold" style={{ fontSize: 10 }}>
                    {notificationCount > 99 ? "99+" : notificationCount}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            activeOpacity={0.7} 
            className="p-1 cursor-pointer hover:opacity-80 transition-opacity"
            onPress={abrirPerfil}
          >
            <Menu color="white" size={24} />
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}