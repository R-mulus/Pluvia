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
  warning?: boolean;
  // Props adicionadas exclusivamente para o SVG dinâmico
  anguloAtual?: number;
  anguloInicio?: number;
  anguloFinal?: number;
}

export default function PivotCard({
  id,
  nome,
  waterOn,
  warning,
  anguloAtual = 90, // Valores padrão para não quebrar caso a API demore
  anguloInicio = 0,
  anguloFinal = 90,
}: PivotCardProps) {
  const router = useRouter();

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

  // === LÓGICA MATEMÁTICA DO SVG ===
  // Converte os graus (0 a 360) em coordenadas X e Y no plano do SVG
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    // Subtrai 90 para que o Grau 0 seja exatamente no topo (12 horas)
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  // Desenha a fatia de pizza (Área Irrigada)
  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, startAngle);
    const end = polarToCartesian(x, y, radius, endAngle);
    
    // Calcula a diferença para saber se o arco é maior que 180 graus (necessário para o SVG desenhar pelo lado certo)
    let diff = endAngle - startAngle;
    if (diff < 0) diff += 360;
    const largeArcFlag = diff > 180 ? "1" : "0";

    return [
      "M", x, y,
      "L", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y,
      "Z"
    ].join(" ");
  };

  // Calcula a ponta da linha tracejada baseada no ângulo atual
  const pontoAtual = polarToCartesian(40, 40, 40, anguloAtual);

  return (
    <Pressable
      className="bg-white rounded-[12px] border-[#cacaca] border-[2px] overflow-hidden mb-4 gap-3 max-w-full active:opacity-70"
      onPress={() => router.push(`/(tabs)/pivos/[id]`)}
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
        <View
          className={`flex-row flex-1 rounded-bl-[12px] ${statusColorClass}`}
        >
          <View className="flex-row items-center rounded-bl-[12px] justify-center pl-6 pr-2 mr-auto">
            <View className="flex-row gap-1">
              <Droplet color="white" size={24} strokeWidth={2.5} />
              <RefreshCw color="white" size={24} strokeWidth={2.5} />
            </View>
            <Text className="text-white font-outfit text-lg ml-2">Horário</Text>
          </View>

          {/* Parte Azul Escura (Wi-Fi) */}
          <View
            className={`w-[48px] h-auto justify-center items-center rounded-bl-[12] ${wifiStatusColorClass}`}
          >
            <Wifi color="white" size={24} strokeWidth={2.5} />
          </View>
        </View>
      </View>

      {/* CONTEÚDO (Radar + Grid de Dados) */}
      <View className="flex-row gap-4 items-center justify-between">
        <View className="flex-row pl-3 pb-2 gap-4 items-center justify-start">
          
          {/* RADAR DINÂMICO */}
          <View className="justify-center items-center">
            <Svg width={75} height={75} viewBox="0 0 80 80">
              {/* Fundo do Radar */}
              <Circle cx="40" cy="40" r="40" fill="#D9D9D9" />
              
              {/* Área Irrigada Dinâmica */}
              <Path
                d={describeArc(40, 40, 40, anguloInicio, anguloFinal)}
                fill={radarColorHex}
              />
              
              {/* Linha Tracejada (Ângulo Atual) */}
              <Line
                x1="40"
                y1="40"
                x2={pontoAtual.x}
                y2={pontoAtual.y}
                stroke="#0D0D0D"
                strokeWidth="3"
                strokeDasharray="6 4"
              />
              
              {/* Linha Sólida (Grau 0 - Fixo apontando para cima) */}
              <Line
                x1="40"
                y1="40"
                x2="40"
                y2="0"
                stroke="#0D0D0D"
                strokeWidth="3"
              />
            </Svg>
          </View>

          {/* Grid de Informações */}
          <View className="flex-row justify-start gap-4 py-3">
            {/* Coluna 1 */}
            <View className="gap-y-1">
              <View className="flex-row items-center">
                <RotateCw size={24} color="#0D0D0D" strokeWidth={2.5} />
                <Text className="text-xs ml-1 text-texto font-outfit-medium">
                  Posição:
                </Text>
                <Text className="text-xs ml-1 text-texto font-outfit-bold">
                  180°
                </Text>
              </View>

              <View className="flex-row flex-1 items-center justify-between">
                <View className="flex-row items-center">
                  <UndoDot size={24} color="#0D0D0D" strokeWidth={2.5} />
                  <Text className="text-xs ml-1 text-texto font-outfit-medium">
                    Inicio:
                  </Text>
                </View>
                <Text className="text-xs ml-1 text-texto font-outfit-bold">
                  195°
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Undo size={24} color="#0D0D0D" strokeWidth={2.5} />
                  <Text className="text-xs ml-1 text-texto font-outfit-medium">
                    Final:
                  </Text>
                </View>
                <Text className="text-xs ml-1 text-texto font-outfit-bold">
                  195°
                </Text>
              </View>
            </View>

            {/* Coluna 2 */}
            <View className="gap-y-1">
              <View className="flex-row items-center">
                <Zap size={24} color="#0D0D0D" strokeWidth={2.5} />
                <Text className="text-xs ml-2 text-texto font-outfit-bold">
                  384 V
                </Text>
              </View>

              <View className="flex-row items-center">
                <Gauge size={24} color="#0D0D0D" strokeWidth={2.5} />
                <Text className="text-xs ml-2 text-texto font-outfit-bold">
                  24 (mV)
                </Text>
              </View>

              <View className="flex-row items-center">
                <Droplet size={24} color="#0D0D0D" strokeWidth={2.5} />
                <Text className="text-xs ml-2 text-texto font-outfit-bold">
                  3.2 mm
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tag de aviso Dinâmica */}
        {warning ? (
          <View className="items-center justify-center px-3 self-stretch rounded-tl-[8px] bg-primaria-azul">
            <TriangleAlert size={24} color="white" strokeWidth={2.5} />
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}