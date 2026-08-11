/**
 * ✅ [PORTABILIDADE WEB CONCLUÍDA - GRID DE PREDEFINIÇÕES]
 * * MODIFICAÇÕES REALIZADAS:
 * 1. GRID RESPONSIVO NATIVO: Adicionado 'useWindowDimensions' para detectar a largura da tela. 
 * Os cards agora são renderizados dentro de uma View com 'flex-row flex-wrap', e cada item recebe um tamanho exato ('width: 100 / getColunas() %').
 * 2. ESPAÇAMENTO LATERAL (GAPS FALSOS): O ScrollView perdeu o 'gap: 16' (que é instável na web). O espaçamento agora é feito por 'px-2' e 'mb-4' em cada View empacotadora, com um '-mx-2' no pai para compensar as bordas.
 * 3. FEEDBACK DE MOUSE: Adicionado 'cursor-pointer hover:opacity-80' no botão de Adicionar (Plus).
 */

import React from "react";
// [WEB] Importado useWindowDimensions
import { View, ActivityIndicator, Pressable, ScrollView, useWindowDimensions, DimensionValue } from "react-native";
import { Text } from "@/components/ui/text";
import { useRouter, useGlobalSearchParams } from "expo-router";
import Header from "@/components/custom/Header";
import { Plus } from "lucide-react-native";
import PresetCard from "@/components/custom/PresetCard";
import { Screen } from "@/components/custom/Screen";
import { usePresetsPivo } from "@/hooks/api/usePresets";

export default function Predefinicoes() {
  const router = useRouter();
  const { id } = useGlobalSearchParams(); // O id do pivô passado na navegação

  const { data: presets, isPending } = usePresetsPivo(id as string);

  // [WEB] Lendo a largura da tela para o Grid
  const { width } = useWindowDimensions();

  // [WEB] Função que decide quantas colunas exibir baseada no tamanho da tela
  const getColunas = () => {
    if (width >= 1650) return 4; 
    if (width >= 1250) return 3; 
    if (width >= 870) return 2; 
    return 1;                   
  };

  return (
    <Screen>
      <View className="flex-1 bg-bg">
        <View className="flex-row justify-between items-center w-full mb-6">
          <Header title="Predefinições" subtitle="Sua Biblioteca" />

          {/* [WEB] Adicionado hover e cursor pointer */}
          <Pressable
            className="bg-primaria-azul w-10 h-10 rounded-[12px] items-center justify-center active:opacity-70 cursor-pointer hover:opacity-80 transition-opacity"
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
          // [WEB FIX] Removido o 'gap: 16' do contentContainerStyle para não quebrar na Web
          <ScrollView className="flex-1 w-full" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            {(!presets || presets.length === 0) ? (
              <Text className="text-center text-subtexto mt-10 font-outfit">
                Você ainda não criou nenhuma predefinição para este pivô.
              </Text>
            ) : (
              // [WEB FIX] View Nativa flex-row com wrap criando a grade!
              <View className={`flex-row flex-wrap w-full ${getColunas() > 1 ? '-mx-2' : ''}`}>
                {presets.map(preset => {

                  return (
                    // [WEB FIX] View envelopadora controlando a largura (Grid) e inserindo o espaçamento via paddings e margins
                    <View 
                      key={preset.id}
                      style={{
                        width: `${100 / getColunas()}%` as DimensionValue,
                      }}
                      className={`${getColunas() > 1 ? 'px-2' : ''} mb-4 pb-[2px]`}
                    >
                      <PresetCard data={preset} variant="padrao" />
                    </View>
                  );
                })}
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </Screen>
  );
}