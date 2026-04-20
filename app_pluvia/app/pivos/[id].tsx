// Exemplo do conteúdo do arquivo app/pivo/[id].tsx
import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { useLocalSearchParams } from "expo-router";

export default function VisualizacaoPivo() {
  // A mágica acontece aqui: ele pega o 'id' que veio na URL
  const { id } = useLocalSearchParams(); 

  // Em um cenário real, você usaria esse 'id' no Supabase:
  // const { data } = useQuery(['pivo', id], () => fetchPivoNoSupabase(id))

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-2xl font-outfit-bold text-center">
        Você abriu o Pivô número: {id}
      </Text>
      {/* Aqui entraria o SVG do Radar passando os dados desse ID específico */}
    </View>
  );
}