import "../global.css";
import { useEffect, useState } from "react";
import { DeviceEventEmitter } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_700Bold,
} from "@expo-google-fonts/outfit";
import { PortalHost } from "@rn-primitives/portal";
import { StatusBar } from "expo-status-bar";
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Importe os dois conteúdos da gaveta
import Perfil from "@/app/(tabs)/perfil";
import Notificacoes from "@/components/custom/Notification"; // Componente que criaremos abaixo

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_700Bold,
  });

  // ! NOVO: Estado que controla qual componente renderizar dentro da gaveta
  const [tipoGaveta, setTipoGaveta] = useState<'perfil' | 'notificacoes'>('perfil');

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  // ! NOVO: Escuta o evento disparado pela TopBar
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('MUDAR_GAVETA', (tipo) => {
      setTipoGaveta(tipo);
    });
    return () => subscription.remove();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" backgroundColor="transparent" translucent={true} />

      <Drawer 
        // A MÁGICA: O conteúdo muda instantaneamente baseado no botão que foi clicado!
        drawerContent={(props) => 
          tipoGaveta === 'perfil' ? <Perfil {...props} /> : <Notificacoes {...props} />
        }
        
        screenOptions={{ 
          headerShown: false,
          drawerPosition: 'right', // Ambas abrem pela direita, mantendo a animação fluida
          swipeEnabled: false,
          drawerType: 'front', 
          drawerStyle: {
            backgroundColor: '#FFFFFF',
            width: '85%',
          },
          overlayColor: 'rgba(0,0,0,0.5)', 
        }}
      >
        <Drawer.Screen name="(tabs)" />
      </Drawer>

      <PortalHost />
    </GestureHandlerRootView>
  );
}