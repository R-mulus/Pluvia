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
    if (onNotificationPress) onNotificationPress(); // Executa função extra se você passar
    DeviceEventEmitter.emit('MUDAR_GAVETA', 'notificacoes'); // Avisa o layout para trocar o miolo
    navigation.dispatch(DrawerActions.openDrawer()); // Abre a gaveta
  };

  const abrirPerfil = () => {
    DeviceEventEmitter.emit('MUDAR_GAVETA', 'perfil'); 
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View
      className="bg-[#00A0A6] rounded-b-[24px]"
      style={{
        paddingTop: Platform.OS === "android" ? insets.top + 10 : insets.top,
        paddingHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
      }}
    >
      <View className="flex-row items-center justify-between pb-3 h-16 relative">
        
        <View className="z-10 items-start justify-center">
          {showBackButton && (
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} className="p-1">
              <ChevronLeft color="white" size={28} />
            </TouchableOpacity>
          )}
        </View>

        <View className="absolute left-0 right-0 items-center justify-center pointer-events-none pb-5">
          <Image
            source={require("../../assets/images/logo_branca.png")}
            className="w-28 h-8"
            resizeMode="contain"
          />
        </View>

        <View className="z-10 items-end justify-center flex-row gap-4">
          
          {/* BOTÃO DO SINO: Chama a função que troca para notificações */}
          <TouchableOpacity onPress={abrirNotificacoes} activeOpacity={0.7} className="p-1">
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

          {/* BOTÃO DO MENU: Chama a função que troca para o Perfil */}
          <TouchableOpacity 
            activeOpacity={0.7} 
            className="p-1"
            onPress={abrirPerfil}
          >
            <Menu color="white" size={24} />
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}