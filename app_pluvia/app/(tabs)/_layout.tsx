import { Tabs } from "expo-router";
import { ChartPie, TableProperties, ChartColumnIncreasing, House } from "lucide-react-native"; // Ícones de exemplo

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Esconde o cabeçalho padrão do celular
        tabBarActiveTintColor: "#08654F", // A cor primária do Pluvia quando clicado
        tabBarInactiveTintColor: "#666666", // Preto quando inativo
        tabBarLabelPosition: "below-icon",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontFamily: "Outfit_400Regular",
          fontSize: 12,
          fontWeight: "bold"
        }
      }}
    >
      {/* Rota 1: aponta para o arquivo pivos.tsx */}
      <Tabs.Screen
        name="pivos"
        options={{
          title: "Pivôs",
          tabBarIcon: ({ color }) => <TableProperties size={24} color={color} />,
        }}
      />

      {/* Rota 2 (Para administradores): aponta para o arquivo menu */}
      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          tabBarIcon: ({ color }) => <House size={24} color={color} />,
        }}
      />
      
      {/* Rota 3: aponta para o arquivo analise.tsx */}
      <Tabs.Screen
        name="analise"
        options={{
          title: "Análise",
          tabBarIcon: ({ color }) => <ChartColumnIncreasing size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}