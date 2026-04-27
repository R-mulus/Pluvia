// ! BERNARDO: ainda tem que ser finalizado essa página para fazer o menu hamburguer e a lógica de quando vai aparecer o menu hamburguer e quando será a seta pra voltar


import React from 'react';
import { View, Image, TouchableOpacity, Text, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Bell } from 'lucide-react-native';

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
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-primaria-azul rounded-b-[24px]"
      style={{
        // ! BERNARDO: O Safe Area é aplicado aqui como padding superior para a cor "vazar" até o topo
        paddingTop: Platform.OS === 'android' ? insets.top + 10 : insets.top,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
      }}
    >
      <View className="flex-row items-center justify-between px-5 pb-4 h-16">
        {/* Voltar */}
        <View className="w-12 items-start justify-center">
          {showBackButton && (
            <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} className="p-1 -ml-1">
              <ChevronLeft color="white" size={28} />
            </TouchableOpacity>
          )}
        </View>

        {/* Logo */}
        <View className="flex-1 items-center justify-center">
          <Image
            source={require('@/assets/images/logo_branca.png')} 
            className="w-28 h-8"
            style={{ width: 112, height: 32 }} // isso aqui é só pra não bugar no navegador
            resizeMode="contain"
          />
        </View>

        {/* Notificações */} 
        {/* // ! BERNARDO: ainda não está desenvolvido a tela de notificações  */}
        <View className="w-12 items-end justify-center">
          <TouchableOpacity onPress={onNotificationPress} activeOpacity={0.7} className="p-1 -mr-1">
            <View>
              <Bell color="white" size={24} />
              {notificationCount > 0 && (
                <View className="absolute -top-1.5 -right-1.5 bg-[#E52207] rounded-full w-5 h-5 items-center justify-center">
                  <Text className="text-white font-bold" style={{ fontSize: 10 }}>
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}