import "../global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, Outfit_400Regular, Outfit_700Bold } from "@expo-google-fonts/outfit";
import { PortalHost } from "@rn-primitives/portal";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({ Outfit_400Regular, Outfit_700Bold });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  if (!fontsLoaded) return null;

  return (
    <>
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