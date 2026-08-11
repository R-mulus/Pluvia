/**
 * ✅ [PORTABILIDADE WEB CONCLUÍDA]
 * * MODIFICAÇÕES REALIZADAS PARA ADAPTAÇÃO WEB:
 * 1. LARGURA DA GAVETA (DRAWER): Adicionada condicional no 'drawerStyle.width'. 
 * - No Mobile: Mantém os '85%' para respeitar o design original.
 * - Na Web: Fixado em '400px'. Isso impede que a gaveta fique gigante em monitores de PC, mantendo o aspecto de painel lateral direito elegante.
 * 2. IMPORTAÇÃO: Adicionado 'Platform' do 'react-native' para fazer a verificação de ambiente.
 */

import "../global.css";
import { useEffect, useState } from "react";
import { DeviceEventEmitter, Platform } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_700Bold,
} from "@expo-google-fonts/outfit";
import { PortalHost } from "@rn-primitives/portal";
import { StatusBar } from "expo-status-bar";
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import Perfil from "@/app/(tabs)/perfil";
import Notificacoes from "@/components/custom/Notification";

import { setupGlobalAlert } from "@/utils/alertPolyfill";

SplashScreen.preventAutoHideAsync();

// ! solucionando o problema dos alerts não funcionarem na web 
setupGlobalAlert();

// ! O cliente do Tanstack Query é criado fora do componente para não ser recriado a cada renderização
const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_700Bold,
  });

  const [tipoGaveta, setTipoGaveta] = useState<"perfil" | "notificacoes">(
    "perfil",
  );

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      "MUDAR_GAVETA",
      (tipo) => {
        setTipoGaveta(tipo);
      },
    );
    return () => subscription.remove();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar
            style="light"
            backgroundColor="transparent"
            translucent={true}
          />

          <Drawer
            drawerContent={(props) =>
              tipoGaveta === "perfil" ? (
                <Perfil {...props} />
              ) : (
                <Notificacoes {...props} />
              )
            }
            screenOptions={{
              headerShown: false,
              drawerPosition: "right",
              swipeEnabled: false,
              drawerType: "front",
              drawerStyle: {
                backgroundColor: "#FFFFFF",
                width: Platform.OS === "web" ? 400 : "85%",
              },
              overlayColor: "rgba(0,0,0,0.5)",
            }}
          >
            <Drawer.Screen name="(tabs)" />
          </Drawer>

          <PortalHost />
        </GestureHandlerRootView>
      </AuthProvider>
    </QueryClientProvider>
  );
}