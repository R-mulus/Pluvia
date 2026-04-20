import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import {
  Droplet,
  RefreshCw,
  Wifi,
  RotateCw,
  Zap,
  Gauge,
  UndoDot,
  Undo,
  TriangleAlert,
} from "lucide-react-native";
import Svg, { Circle, Path, Line } from "react-native-svg";

interface PivotCardProps {
  id?: string;
  nome?: string;
  waterOn?: boolean;
}

export default function PivotCard({ id, nome, waterOn }: PivotCardProps) {
  const router = useRouter();

  // Função para definir a cor baseada na prop waterOn
  const getStatusColor = () => {
    if (waterOn === true) return "bg-primaria-azul";
    if (waterOn === false) return "bg-[#753E20]"; // Marrom do Figma
    return "bg-[#666666]"; // Cinza padrão (undefined)
  };

  const getWifiStatusColor = () => {
    if (waterOn === true) return "bg-secundaria-azul";
    if (waterOn === false) return "bg-[#4B2410]";
    return "bg-borda";
  };

  // Função para pintar o SVG (Retorna apenas o HEX, sem o "bg-")
  const getRadarColor = () => {
    if (waterOn === true) return "#00A0A6"; // O HEX da sua primaria-azul
    if (waterOn === false) return "#753E20"; // Marrom
    return "#666666"; // Cinza
  };

  const statusColorClass = getStatusColor();
  const wifiStatusColorClass = getWifiStatusColor();
  const radarColorHex = getRadarColor();

  return (
    <Pressable
      className="bg-white rounded-[20px] border-[#cacaca] border-[2px] overflow-hidden mb-4 gap-3 max-w-full active:opacity-70"
      onPress={() => router.push(`/pivo/${id}`)}
    >
      {/* LINHA DO CABEÇALHO */}
      <View className="flex-row justify-between">
        
        {/* Título e Data */}
        <View className="px-4 py-1">
          <Text className="text-base font-outfit-medium text-texto">
            {nome || "Pivô 1"} {/* Usando a prop nome dinamicamente */}
          </Text>
          <Text className="text-sm text-subtexto">21/03/2026 02:23</Text>
        </View>

        {/* Container da parte de status (Sincronizado com a cor da tag) */}
        <View className={`flex-row flex-1 rounded-bl-[12px] ${statusColorClass}`}>
          <View className="flex-row items-center rounded-bl-[12px] justify-center pl-6 pr-2 mr-auto">
            <View className="flex-row gap-1">
              <Droplet color="white" size={24} strokeWidth={2.5} />
              <RefreshCw color="white" size={24} strokeWidth={2.5} />
            </View>
            <Text className="text-white font-outfit text-lg ml-2">Horário</Text>
          </View>

          {/* Parte Azul Escura (Wi-Fi) */}
          <View className={`w-[48px] h-auto justify-center items-center rounded-bl-[12] ${wifiStatusColorClass}`}>
            <Wifi color="white" size={24} strokeWidth={2.5} />
          </View>
        </View>
      </View>

      {/* CONTEÚDO (Radar + Grid de Dados) */}
      <View className="flex-row gap-4 items-center justify-between">
        <View className="flex-row pl-3 pb-2 gap-4 items-center justify-start">
          
          {/* Radar Fixo */}
          <View className="justify-center items-center">
            <Svg width={75} height={75} viewBox="0 0 80 80">
              <Circle cx="40" cy="40" r="40" fill="#D9D9D9" />
              <Path d="M40,40 L40,0 A40,40 0 0,1 80,40 Z" fill={radarColorHex} />
              <Line x1="40" y1="40" x2="80" y2="40" stroke="#0D0D0D" strokeWidth="3" strokeDasharray="6 4" />
              <Line x1="40" y1="40" x2="40" y2="0" stroke="#0D0D0D" strokeWidth="3" />
            </Svg>
          </View>

          {/* Grid de Informações */}
          <View className="flex-row justify-start gap-4 py-3">
            {/* Coluna 1 */}
            <View className="gap-y-1">
              <View className="flex-row items-center">
                <RotateCw size={24} color="#0D0D0D" strokeWidth={2.5} />
                <Text className="text-xs ml-1 text-texto font-outfit-medium">Posição:</Text>
                <Text className="text-xs ml-1 text-texto font-outfit-bold">180°</Text>
              </View>

              <View className="flex-row flex-1 items-center justify-between">
                <View className="flex-row items-center">
                  <UndoDot size={24} color="#0D0D0D" strokeWidth={2.5} />
                  <Text className="text-xs ml-1 text-texto font-outfit-medium">Inicio:</Text>
                </View>
                <Text className="text-xs ml-1 text-texto font-outfit-bold">195°</Text>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Undo size={24} color="#0D0D0D" strokeWidth={2.5} />
                  <Text className="text-xs ml-1 text-texto font-outfit-medium">Final:</Text>
                </View>
                <Text className="text-xs ml-1 text-texto font-outfit-bold">195°</Text>
              </View>
            </View>

            {/* Coluna 2 */}
            <View className="gap-y-1">
              <View className="flex-row items-center">
                <Zap size={24} color="#0D0D0D" strokeWidth={2.5} />
                <Text className="text-xs ml-2 text-texto font-outfit-bold">384 V</Text>
              </View>

              <View className="flex-row items-center">
                <Gauge size={24} color="#0D0D0D" strokeWidth={2.5} />
                <Text className="text-xs ml-2 text-texto font-outfit-bold">24 (mV)</Text>
              </View>

              <View className="flex-row items-center">
                <Droplet size={24} color="#0D0D0D" strokeWidth={2.5} />
                <Text className="text-xs ml-2 text-texto font-outfit-bold">3.2 mm</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tag de aviso Dinâmica */}
        <View className="items-center justify-center px-3 self-stretch rounded-tl-[8px] bg-primaria-azul">
          <TriangleAlert size={24} color="white" strokeWidth={2.5} />
        </View>
      </View>
    </Pressable>
  );
}