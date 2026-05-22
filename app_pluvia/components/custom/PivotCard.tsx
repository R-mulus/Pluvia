import React from "react";
import { View, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import {
  Droplet, RefreshCw, Wifi, RotateCw, Zap, Gauge, UndoDot, Undo, TriangleAlert,
} from "lucide-react-native";
import Svg, { Circle, Path, Line } from "react-native-svg";

interface PivotCardProps {
  id: string;
  nome: string;
  waterOn: boolean;
  warning?: boolean;
  anguloAtual: number;
  anguloInicio: number;
  anguloFinal: number;
  tensao: number;
  pressao: number;
  lamina: number;
  direcaoAtual: 'HORARIO' | 'ANTI_HORARIO' | 'PARADO' | null;
  ultimaAtualizacao: string;
}

export default function PivotCard({
  id,
  nome,
  waterOn,
  warning,
  anguloAtual,
  anguloInicio,
  anguloFinal,
  tensao,
  pressao,
  lamina,
  direcaoAtual,
  ultimaAtualizacao,
}: PivotCardProps) {
  const router = useRouter();

  const getStatusColor = () => {
    if (waterOn) return "bg-primaria-azul";
    if (waterOn === false) return "bg-[#753E20]";
    return "bg-[#666666]";
  };

  const getWifiStatusColor = () => {
    if (waterOn) return "bg-secundaria-azul";
    if (waterOn === false) return "bg-[#4B2410]";
    return "bg-borda";
  };

  const getRadarColor = () => {
    if (waterOn) return "#00A0A6";
    if (waterOn === false) return "#753E20";
    return "#666666";
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    if (startAngle === endAngle) return "";

    const start = polarToCartesian(x, y, radius, startAngle);
    const end = polarToCartesian(x, y, radius, endAngle);
    
    let diff = endAngle - startAngle;
    
    const isAntiHorario = direcaoAtual === 'ANTI_HORARIO';

    if (isAntiHorario) {
      if (diff > 0) diff -= 360;
    } else {
      if (diff < 0) diff += 360;
    }

    const largeArcFlag = Math.abs(diff) > 180 ? "1" : "0";
    
    const sweepFlag = isAntiHorario ? "0" : "1";

    return [
      "M", x, y, 
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, sweepFlag, end.x, end.y, 
      "Z"
    ].join(" ");
  };

  // Calculamos a ponta da linha baseada no ângulo ATUAL do pivô
  const pontoAtual = polarToCartesian(40, 40, 40, anguloAtual);

  const dataFormatada = new Date(ultimaAtualizacao).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit'
  });

  return (
    <Pressable
      className="bg-white rounded-[12px] border-[#cacaca] border-[2px] overflow-hidden mb-4 gap-3 max-w-full active:opacity-70"
      onPress={() => router.push(`/(tabs)/pivos/${id}`)}
    >
      <View className="flex-row justify-between">
        <View className="px-2 py-1">
          <Text className="text-base font-outfit-medium text-texto">
            {nome}
          </Text>
          <Text className="text-sm text-subtexto">{dataFormatada}</Text>
        </View>

        <View className={`flex-row flex-1 rounded-bl-[12px] ${getStatusColor()}`}>
          <View className="flex-row items-center rounded-bl-[12px] justify-center pl-2 pr-2 mr-auto">
            <View className="flex-row gap-1">
              <Droplet color="white" size={24} strokeWidth={2.5} />
              <RefreshCw color="white" size={24} strokeWidth={2.5} />
            </View>
            <Text className="text-white font-outfit text-lg ml-2">
              {direcaoAtual === 'HORARIO' ? 'Horário' : direcaoAtual === 'ANTI_HORARIO' ? 'Anti-Hor.' : 'Parado'}
            </Text>
          </View>

          <View className={`w-[48px] h-auto justify-center items-center rounded-bl-[12] ${getWifiStatusColor()}`}>
            <Wifi color="white" size={24} strokeWidth={2.5} />
          </View>
        </View>
      </View>

      <View className="flex-row gap-4 items-center justify-between">
        <View className="flex-row pl-3 pb-2 gap-4 items-center justify-start">
          
          <View className="justify-center items-center">
            <Svg width={75} height={75} viewBox="0 0 80 80">
              <Circle cx="40" cy="40" r="40" fill="#D9D9D9" />
              
              {/* O ARCO: Preenchimento dinâmico crescendo do Início até o Atual */}
              <Path 
                d={describeArc(40, 40, 40, anguloInicio, anguloAtual)} 
                fill={getRadarColor()} 
              />
              
              {/* ATUAL: Linha tracejada indicando exatamente onde o pivô está na borda do arco */}
              <Line x1="40" y1="40" x2={pontoAtual.x} y2={pontoAtual.y} stroke="#0D0D0D" strokeWidth="3" strokeDasharray="6 4" />
              
              {/* NORTE (0 Graus) Fixo */}
              <Line x1="40" y1="40" x2="40" y2="0" stroke="#0D0D0D" strokeWidth="3" />
            </Svg>
          </View>

          <View className="flex-row justify-start gap-4 py-3">
            <View className="gap-y-1">
              <View className="flex-row items-center">
                <RotateCw size={24} color="#0D0D0D" strokeWidth={2.5} />
                <Text className="text-xs ml-1 text-texto font-outfit-medium">Posição:</Text>
                <Text className="text-xs ml-1 text-texto font-outfit-bold">{anguloAtual}°</Text>
              </View>
              <View className="flex-row flex-1 items-center justify-between">
                <View className="flex-row items-center">
                  <UndoDot size={24} color="#0D0D0D" strokeWidth={2.5} />
                  <Text className="text-xs ml-1 text-texto font-outfit-medium">Inicio:</Text>
                </View>
                <Text className="text-xs ml-1 text-texto font-outfit-bold">{anguloInicio}°</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Undo size={24} color="#0D0D0D" strokeWidth={2.5} />
                  <Text className="text-xs ml-1 text-texto font-outfit-medium">Final:</Text>
                </View>
                <Text className="text-xs ml-1 text-texto font-outfit-bold">{anguloFinal}°</Text>
              </View>
            </View>

            <View className="gap-y-1">
              <View className="flex-row items-center">
                <Zap size={24} color="#0D0D0D" strokeWidth={2.5} />
                <Text className="text-xs ml-2 text-texto font-outfit-bold">{tensao} V</Text>
              </View>
              <View className="flex-row items-center">
                <Gauge size={24} color="#0D0D0D" strokeWidth={2.5} />
                <Text className="text-xs ml-2 text-texto font-outfit-bold">{pressao} PSI</Text>
              </View>
              <View className="flex-row items-center">
                <Droplet size={24} color="#0D0D0D" strokeWidth={2.5} />
                <Text className="text-xs ml-2 text-texto font-outfit-bold">{lamina} mm</Text>
              </View>
            </View>
          </View>
        </View>

        {warning && (
          <View className="items-center justify-center px-3 self-stretch rounded-tl-[8px] bg-primaria-azul">
            <TriangleAlert size={24} color="white" strokeWidth={2.5} />
          </View>
        )}
      </View>
    </Pressable>
  );
}