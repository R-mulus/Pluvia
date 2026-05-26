/**
 * ✅ [PORTABILIDADE WEB CONCLUÍDA]
 * * MODIFICAÇÕES REALIZADAS PARA ADAPTAÇÃO WEB:
 * 1. SAFE AREA WEB: O 'paddingTop' usa 'insets.top' no mobile, mas cai para um valor fixo (16px) na web para não gerar espaçamento fantasma no topo.
 * 2. FEEDBACK DE MOUSE: Adicionado 'cursor-pointer' e 'hover:opacity-70' nos TouchableOpacity para melhorar a interatividade no PC.
 * * * CORREÇÕES GERAIS:
 * - Corrigido um pequeno erro de digitação (typo) na classe de margem da primeira notificação ('mt-1 items-center').
 */

import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Bell, TriangleAlert, Droplet } from "lucide-react-native";
import { Separator } from "@/components/ui/separator";

export default function Notification({ navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    // A View continua simples, pois o RootLayout dita a largura (85% mobile ou 400px web)
    <View className="flex-1 w-full px-5 bg-white">
      
      {/* Cabeçalho */}
      <View
        className="pb-4 flex-row items-center gap-3 self-start"
        // [WEB] Evita que a web empurre o título para baixo sem necessidade
        style={{ paddingTop: Platform.OS === 'web' ? 16 : insets.top + 16 }}
      >
        <Text className="text-lg font-outfit-bold text-[#0D0D0D]">
          Notificações
        </Text>
      </View>

      <Separator className="my-2 bg-[#B5B5B5]" decorative />

      {/* Lista de Notificações */}
      <ScrollView className="flex-1 pt-4 gap-6" showsVerticalScrollIndicator={false}>
        
        {/* Notificação de Sucesso */}
        <TouchableOpacity
          activeOpacity={0.7}
          // [WEB] Adicionados hover e pointer para mouse
          className="flex-row items-start cursor-pointer hover:opacity-70 transition-opacity"
        >
          <View className="mt-1 items-center justify-center self-start">
            <Droplet size={32} color="#00A0A6" />
          </View>
          
          <View className="flex-1 ml-3 gap-1">
            <Text className="font-outfit-bold text-sm text-[#0D0D0D]">
              Pivô 01 Concluído
            </Text>
            <Text className="font-outfit-regular text-xs">
              A lâmina de 3.2mm foi aplicada com sucesso. O equipamento está em repouso.
            </Text>
            <Text className="font-outfit-medium text-[10px] text-subtexto mt-1 self-end">
              06:40
            </Text>
          </View>
        </TouchableOpacity>

      <Separator className="my-4 bg-[#dedede]" decorative />

        {/* Notificação de Alerta */}
        <TouchableOpacity
          activeOpacity={0.7}
          // [WEB] Adicionados hover e pointer para mouse
          className="flex-row items-start cursor-pointer hover:opacity-70 transition-opacity"
        >
          <View className="mt-1 items-center justify-center self-start">
            <TriangleAlert size={32} color="#D32F2F" />
          </View>
          
          <View className="flex-1 ml-3 gap-1">
            <Text className="font-outfit-bold text-sm text-[#0D0D0D]">
              Alerta de Pressão
            </Text>
            <Text className="font-outfit-regular text-xs">
              O Pivô Sul detectou uma pressão acima de 50 PSI na linha principal.
            </Text>
            <Text className="font-outfit-medium text-[10px] text-subtexto mt-1 self-end">
              06:07
            </Text>
          </View>
        </TouchableOpacity>
        
      </ScrollView>
    </View>
  );
}