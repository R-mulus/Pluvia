import React from "react";
import { View, Image, TouchableOpacity, Text, Platform, DeviceEventEmitter } from "react-native";
import { useRouter, useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChevronLeft, Bell, Menu } from "lucide-react-native";

import { useAlertas } from "@/hooks/api/useLogs";

type TopBarProps = {
  showBackButton?: boolean;
  notificationCount?: number;
  onNotificationPress?: () => void;
};

export default function TopBar({
  showBackButton = true,
  notificationCount,
  onNotificationPress,
}: TopBarProps) {
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // 👉 Busca os 20 últimos eventos para checar se há falhas críticas recentes
  const { data: alertasReais } = useAlertas("todos", 20);
  
  // LÓGICA CORRIGIDA: Filtramos apenas os eventos que são realmente 'erro'
  const falhasCriticas = alertasReais?.filter((a: any) => a.tipo_evento === 'erro' || a.codigo?.includes('ERRO') || a.codigo?.includes('FALHA')).length || 0;
  
  // Prioriza exibir a contagem de falhas do sistema. Se não houver, usa o notificationCount manual (se existir)
  const numeroExibido = falhasCriticas > 0 ? falhasCriticas : (notificationCount || 0);

  const abrirNotificacoes = () => {
    if (onNotificationPress) onNotificationPress(); 
    DeviceEventEmitter.emit('MUDAR_GAVETA', 'notificacoes'); 
    navigation.dispatch(DrawerActions.openDrawer()); 
  };

  const abrirPerfil = () => {
    DeviceEventEmitter.emit('MUDAR_GAVETA', 'perfil'); 
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/(tabs)/menu"); 
    }
  };

  return (
    <View
      className="bg-[#00A0A6] rounded-b-[24px]"
      style={{
        paddingTop: Platform.OS !== "web" ? (Platform.OS === "android" ? insets.top + 10 : insets.top) : 0,
        paddingHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
      }}
    >
      <View className="flex-row items-center justify-between h-16 relative w-full">
        <View className="z-10 items-start justify-center">
          {showBackButton && (
            <TouchableOpacity onPress={handleBack} activeOpacity={0.7} className="p-1 cursor-pointer hover:opacity-80 transition-opacity">
              <ChevronLeft color="white" size={28} />
            </TouchableOpacity>
          )}
        </View>

        <View className="absolute inset-0 items-center justify-center pointer-events-none">
          <Image
            source={require("../../assets/images/logo_branca.png")}
            style={{ width: 112, height: 32 }}
            resizeMode="contain"
          />
        </View>

        <View className="z-10 items-end justify-center flex-row gap-4">
          <TouchableOpacity onPress={abrirNotificacoes} activeOpacity={0.7} className="p-1 cursor-pointer hover:opacity-80 transition-opacity">
            <View>
              <Bell color="white" size={24} />
              
              {/* O NÚMERO DINÂMICO E VERDADEIRO DE ERROS AQUI */}
              {numeroExibido > 0 && (
                <View className="absolute -top-1.5 -right-1.5 bg-[#E52207] rounded-full w-5 h-5 items-center justify-center">
                  <Text className="text-white font-bold" style={{ fontSize: 10 }}>
                    {numeroExibido > 99 ? "99+" : numeroExibido}
                  </Text>
                </View>
              )}

            </View>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} className="p-1 cursor-pointer hover:opacity-80 transition-opacity" onPress={abrirPerfil}>
            <Menu color="white" size={24} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}