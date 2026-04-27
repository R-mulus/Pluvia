import "../global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
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
// Importe o seu componente de Perfil
import Perfil from "@/app/(tabs)/perfil/perfil";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_700Bold,
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded) return null;

  // return (
  //   <>
  //     <StatusBar style="light" backgroundColor="transparent" translucent={true} />
  //     {/* <StatusBar style="dark" backgroundColor="#F7F7F7" translucent /> */} 
  //     {/* // ! BERNARDO: mudei a StatusBar para colocar os icones do celular em branco pois o contraste não estava legal */}

  //     {/* O Stack diz: "Aqui dentro vão carregar as rotas. Não mostre o cabeçalho padrão." */}
  //     <Stack screenOptions={{ headerShown: false }}>
  //       {/* Aqui nós avisamos que o grupo (tabs) existe */}
  //       <Stack.Screen name="(tabs)" />
  //     </Stack>

  //     {/* O PortalHost garante que os modais e selects fiquem por cima de tudo */}
  //     <PortalHost />
  //   </>
  // );
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" backgroundColor="transparent" translucent={true} />

      <Drawer 
        // 1. A MÁGICA DO CONTEÚDO: Substitui o menu padrão pelo seu componente
        drawerContent={(props) => <Perfil />}
        
        // 2. CONFIGURAÇÕES DE COMPORTAMENTO
        screenOptions={{ 
          headerShown: false,
          
          // OBRIGA A ABRIR PELA DIREITA
          drawerPosition: 'right',
          swipeEnabled: false,

          
          // Animação: 'front' (passa por cima da tela), 'back' (empurra a tela), 'slide' (divide o espaço)
          drawerType: 'front', 
          
          // Estilização da própria "caixa" da gaveta
          drawerStyle: {
            backgroundColor: '#FFFFFF',
            width: '85%', // Define quanto da tela a gaveta vai ocupar (85% é o padrão moderno)
          },

          // Escurece o fundo da tela principal quando a gaveta abre
          overlayColor: 'rgba(0,0,0,0.5)', 
        }}
      >
        <Drawer.Screen name="(tabs)" />
      </Drawer>

      <PortalHost />
    </GestureHandlerRootView>
  );
}
