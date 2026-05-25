import { View, ActivityIndicator } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useRouter, useLocalSearchParams } from "expo-router";
import Header from "@/components/custom/Header";
import { FlashList } from "@shopify/flash-list";
import PresetCard from "@/components/custom/PresetCard";
import { Plus } from "lucide-react-native";

// Hook que refatoramos para buscar os agrupadores (cronogramas)
import { useCronogramasPivo } from "@/hooks/api/useCronogramas";

export default function Cronogramas() {
  const router = useRouter();
  // Pegamos o ID do pivô da URL
  const { id } = useLocalSearchParams();

  const { data: cronogramas, isPending } = useCronogramasPivo(id as string);

  return (
    <View className="flex-1 justify-center bg-bg px-4 py-6">
      
      {/* CABEÇALHO */}
      <View className="flex-row justify-between items-center w-full mb-6">
        <Header title="Cronograma" subtitle="Agendamentos" />

        {/* Botão de Adicionar Agendamento */}
        <Button
          className="bg-primaria-azul w-10 h-10 p-0 rounded-[12px] items-center justify-center active:opacity-70"
          onPress={() => router.push({
            pathname: '/(tabs)/presets/addCronograma',
            params: { pivo_id: id } // Passamos o ID do pivô de forma segura para a tela de criar
          })}
        >
          <Plus size={24} color="white" strokeWidth={2.5} />
        </Button>
      </View>

      {/* LISTA */}
      {isPending ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#00A0A6" />
        </View>
      ) : (
        <View className="flex-1">
          <FlashList
            data={cronogramas ?? []} // Proteção contra undefined
            renderItem={({ item }) => <PresetCard data={item} />}
            ItemSeparatorComponent={() => <View style={{ height: 16 }} />} // Espaçamento entre os cards
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }} // Espaço extra no final da lista
            ListEmptyComponent={
              <Text className="text-center text-subtexto mt-10 font-outfit">
                Nenhum agendamento programado.
              </Text>
            }
          />
        </View>
      )}
    </View>
  );
}