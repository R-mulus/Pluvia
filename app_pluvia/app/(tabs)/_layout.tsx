import { Tabs } from "expo-router";
import { TableProperties, ChartColumnIncreasing, House } from "lucide-react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Esconde o cabeçalho padrão do celular
        tabBarActiveTintColor: "#08654F", // A cor secundária verde quando clicado
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
          fontFamily: "Outfit_700Bold",
          fontSize: 12,
        }
      }}
    >
      <Tabs.Screen
        name="pivos"
        options={{
          title: "Pivôs",
          tabBarIcon: ({ color }) => <TableProperties size={24} color={color} />,
        }}
      />

      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu",
          tabBarIcon: ({ color }) => <House size={24} color={color} />,
        }}
      />
      
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