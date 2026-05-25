import React from "react";
import { View, ActivityIndicator, Pressable, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";
import { useRouter, useGlobalSearchParams } from "expo-router";
import Header from "@/components/custom/Header";
import { Plus } from "lucide-react-native";
import PresetCard from "@/components/custom/PresetCard";
import { usePresetsPivo } from "@/hooks/api/usePresets";

export default function Predefinicoes() {
  const router = useRouter();
  const { id } = useGlobalSearchParams(); // O id do pivô passado na navegação

  const { data: presets, isPending } = usePresetsPivo(id as string);

  return (
    <View className="flex-1 bg-bg px-4 py-6">
      <View className="flex-row justify-between items-center w-full mb-6">
        <Header title="Predefinições" subtitle="Sua Biblioteca" />

        <Pressable
          className="bg-primaria-azul w-10 h-10 rounded-[12px] items-center justify-center active:opacity-70"
          onPress={() => router.push({
            pathname: '/(tabs)/operacao/addPreset',
            params: { pivo_id: id }
          })}
        >
          <Plus size={24} color="white" strokeWidth={2.5} />
        </Pressable>
      </View>

      {isPending ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#00A0A6" />
        </View>
      ) : (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, gap: 16 }}>
          {(!presets || presets.length === 0) ? (
            <Text className="text-center text-subtexto mt-10 font-outfit">
              Você ainda não criou nenhuma predefinição para este pivô.
            </Text>
          ) : (
            presets.map(preset => (
              <PresetCard key={preset.id} data={preset} variant="padrao" />
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}