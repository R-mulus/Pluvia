// ! ADICIONAR LÓGICA DE MUDAR INFORMAÇÕES
import React from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import {
  RotateCw,
  Clock,
  UndoDot,
  Undo,
  RefreshCw,
  Droplet,
  X,
  SquarePen
} from 'lucide-react-native';

export default function PresetCard() {
  return (
    // Container Principal em Row (Divide conteúdo principal e barra lateral)
    <View className="flex-row bg-white rounded-[12px] border-[2px] border-[#cacaca] overflow-hidden">

      {/* 1. ÁREA ESQUERDA (Cabeçalho + Grid) - flex-1 empurra a barra para a direita */}
      <View className="flex-1">

        {/* --- CABEÇALHO --- */}
        <View className="flex-row bg-secundaria-azul">
          
          {/* Aba do Título (Com o corte arredondado) */}
          <View className="bg-primaria-azul px-4 py-2 justify-center rounded-br-[16px] z-10 flex-wrap">
            <Text className="text-white text-sm font-outfit-medium text-wrap leading-tight w-[80px]">
              Giro Duplo Carpado
            </Text>
          </View>

          {/* Status do Cabeçalho */}
          <View className="flex-1 flex-row items-center justify-start pl-4 pr-4 gap-2">
            <View className="flex-row items-center gap-1">
              <RefreshCw size={18} color="white" strokeWidth={2.5} />
              <Text className="text-white text-sm">Horário</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Droplet size={18} color="white" strokeWidth={2.5} />
              <Text className="text-white text-sm">Irrigando</Text>
            </View>
          </View>

        </View>

        {/* --- CORPO / GRID --- */}
        <View className="p-4 flex-row justify-between gap-4">
          
          {/* Coluna 1 */}
          <View className="gap-3">
            <View className="flex-row items-center">
              <RotateCw size={24} color="#0D0D0D" strokeWidth={2.5} />
              <Text className="text-sm ml-2 text-texto font-outfit">
                <Text className="font-outfit-bold text-sm">Volta Completa</Text>
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <Clock size={24} color="#0D0D0D" strokeWidth={2.5} />
              <Text className="text-sm ml-2 text-texto font-outfit">
                Duração: <Text className="font-outfit-bold text-sm">3 h 30 min</Text>
              </Text>
            </View>
          </View>

          {/* Coluna 2 */}
          <View className="gap-3 pr-2">
            <View className="flex-row items-center">
              <UndoDot size={24} color="#0D0D0D" strokeWidth={2.5} />
              <Text className="text-sm ml-2 text-texto font-outfit">
                Inicio: <Text className="font-outfit-bold text-sm">195°</Text>
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <Undo size={24} color="#0D0D0D" strokeWidth={2.5} />
              <Text className="text-sm ml-2 text-texto font-outfit">
                Final: <Text className="font-outfit-bold text-sm">195°</Text>
              </Text>
            </View>
          </View>

        </View>
      </View>

      {/* 2. BARRA LATERAL DIREITA (Ações) */}
      <View className="bg-secundaria-azul">
        
        <View className="w-10 bg-primaria-azul rounded-tl-[8px] items-center justify-center gap-8 flex-1">
            {/* Usamos Pressable com active:opacity-50 para dar feedback de clique */}
        <Pressable className="active:opacity-50 p-2">
          <X size={26} color="white" strokeWidth={2.5} />
        </Pressable>
        
        <Pressable className="active:opacity-50 p-2">
          <SquarePen size={24} color="white" strokeWidth={2.5} />
        </Pressable>
        </View>
        
      </View>

    </View>
  );
}