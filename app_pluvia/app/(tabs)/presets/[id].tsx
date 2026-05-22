import { View, ActivityIndicator } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useRouter, useLocalSearchParams } from "expo-router";
import Header from "@/components/custom/Header";
import { FlashList } from "@shopify/flash-list";
import PresetCard from "@/components/custom/PresetCard";
import { Plus } from "lucide-react-native";

// Hook fictício que você precisará criar no frontend (ex: useCronogramas.ts)
import { useCronogramasPivo } from "@/hooks/api/useCronogramas";

export default function Cronogramas() {
  const router = useRouter();
  // Pegamos o ID do pivô da URL para saber de qual pivô são os agendamentos
  const { id } = useLocalSearchParams();

  const { data: cronogramas, isPending } = useCronogramasPivo(id as string);

  return (
    <View className="flex-1 justify-center bg-bg gap-4 px-4 py-6 overflow-scroll">
      <View className="flex-row justify-between items-center w-full">
        <Header title="Cronograma" subtitle="Agendamentos" />

        {/* Botão de Adicionar Agendamento */}
        <Button
          className="bg-primaria-azul w-10 h-10 p-0 rounded-[12px] items-center justify-center"
          onPress={() => router.push(`/(tabs)/presets/adicionarPreset/${id}`)}
        >
          <Plus size={24} color="white" />
        </Button>
      </View>

      {isPending ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#00A0A6" />
        </View>
      ) : (
        <FlashList
          className="flex-1 gap-3"
          data={cronogramas}
          // Futuramente passaremos os dados do agendamento para o PresetCard
          renderItem={({ item }) => <PresetCard data={item} />}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text className="text-center text-subtexto mt-10 font-outfit">
              Nenhum agendamento programado.
            </Text>
          }
        />
      )}
    </View>
  );
}
