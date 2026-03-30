import "../global.css";
import { useEffect } from "react";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, Outfit_400Regular, Outfit_700Bold } from "@expo-google-fonts/outfit";
import { PortalHost } from "@rn-primitives/portal";

// Impede que a tela de splash suma automaticamente
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    Outfit_400Regular,
    Outfit_700Bold,
  });

  useEffect(() => {
    if (error) throw error;
    
    if (fontsLoaded) {
      // Assim que a fonte carregar, escondemos a tela de splash
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  // Se as fontes não carregaram, não renderiza nada do app ainda
  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <Slot />
      {/* <Stack /> */}
      <PortalHost />
    </>
  );
}