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

  return (
    <>
      <StatusBar style="dark" backgroundColor="#F7F7F7" translucent />
      {/* O Stack diz: "Aqui dentro vão carregar as rotas. Não mostre o cabeçalho padrão." */}
      <Stack screenOptions={{ headerShown: false }}>
        {/* Aqui nós avisamos que o grupo (tabs) existe */}
        <Stack.Screen name="(tabs)" />
      </Stack>

      {/* O PortalHost garante que os modais e selects fiquem por cima de tudo */}
      <PortalHost />
    </>
  );
}
