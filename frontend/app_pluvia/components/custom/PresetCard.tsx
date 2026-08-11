/**
 * ✅ [PORTABILIDADE WEB/MOBILE CONCLUÍDA - PRESET CARD]
 * * MODIFICAÇÕES REALIZADAS:
 * 1. RESPONSIVIDADE DE TELA PEQUENA (< 400px): Adicionado 'useWindowDimensions'. Quando a tela é <= 400px, o card muda de 'flex-row' para 'flex-col'.
 * 2. BARRA DE AÇÕES NO RODAPÉ: A barra azul lateral automaticamente se transforma em um rodapé horizontal ('flex-row'), distribuindo os botões lado a lado e ajustando as bordas divisórias (de border-t para border-l).
 * 3. INTEGRIDADE MANTIDA: A lógica das setas (Grid Web vs Mobile) e os hovers continuam funcionando perfeitamente em todas as variantes (passo, adicionar, padrao).
 */

import React from "react";
// [WEB/MOBILE] Importado useWindowDimensions para a responsividade fina
import { View, Pressable, Alert, ActivityIndicator, useWindowDimensions } from "react-native";
import { Text } from "@/components/ui/text";
import { useRouter, usePathname } from "expo-router";
import {
  Clock,
  UndoDot,
  Undo,
  RefreshCw,
  Droplet,
  DropletOff,
  X,
  SquarePen,
  Plus,
  Tag,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Trash2,
  CheckCircle2,
  PauseCircle,
  PlayCircle
} from "lucide-react-native";

import { useExcluirPreset } from "@/hooks/api/usePresets";

interface PresetCardProps {
  data: any;
  variant?: "padrao" | "adicionar" | "passo" | "readonly";
  onAdd?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onRemove?: () => void;
  stepNumber?: number;
  isFirst?: boolean;
  isLast?: boolean;
  isGrid?: boolean; 
}

export default function PresetCard({
  data,
  variant = "padrao",
  onAdd,
  onMoveUp,
  onMoveDown,
  onRemove,
  stepNumber,
  isFirst,
  isLast,
  isGrid = false 
}: PresetCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { mutateAsync: excluir, isPending: isExcluindo } = useExcluirPreset();

  // Lê a largura da tela para saber se a barra desce
  const { width } = useWindowDimensions();
  const isSmallScreen = width <= 400;

  const isAntiHorario = data.direcao === "ANTI_HORARIO";
  const isIrrigando = data.irrigacao === true;
  
  const statusPasso = data.status_passo || 'aguardando';
  const isExecutando = statusPasso === 'executando';

  const hasHorario = !!data.horario;
  let horaFormatada = "";
  if (hasHorario) {
    const dataHoraObj = new Date(data.horario);
    horaFormatada = dataHoraObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  }

  const handleExcluir = () => {
    Alert.alert(
      "Excluir Predefinição",
      "Tem certeza que deseja excluir esta predefinição da biblioteca?",
      [{ text: "Cancelar", style: "cancel" }, { text: "Excluir", style: "destructive", onPress: async () => await excluir(data.preset_origem_id || data.id) }]
    );
  };

  const irParaEdicao = () => {
    router.push({
      pathname: "/(tabs)/operacao/editPreset",
      params: { id: data.preset_origem_id || data.id, pivo_id: data.pivo_id, fb_nome: data.nome, fb_lamina: data.lamina?.toString(), fb_angulo_inicial: data.angulo_inicial?.toString(), fb_angulo_final: data.angulo_final?.toString(), fb_irrigacao: data.irrigacao ? "true" : "false", fb_direcao: data.direcao, origem: pathname.includes("pivos") ? "pivo" : "lista" },
    });
  };

  const headerBgClass = isExecutando && variant === "readonly" ? "bg-primaria-azul" : "bg-secundaria-azul";

  return (
    // Se a tela for <= 400, o card vira flex-col (empilhando a barra lateral embaixo)
    <View className={`${isSmallScreen ? 'flex-col' : 'flex-row'} bg-white rounded-[12px] border-[2px] ${isExecutando && variant === "readonly" ? 'border-primaria-azul' : 'border-[#cacaca]'} overflow-hidden`}>
      <View className="flex-1">
        
        {/* --- CABEÇALHO --- */}
        <View className={`flex-row ${headerBgClass} h-9 items-center transition-colors`}>
          {variant === "passo" || variant === "readonly" ? (
            <View className={`${isExecutando ? 'bg-white' : 'bg-primaria-azul'} px-4 h-full justify-center items-center rounded-br-[16px] z-10 min-w-[80px]`}>
              <Text className={`${isExecutando ? 'text-primaria-azul' : 'text-white'} text-sm font-outfit-bold`}>Passo {stepNumber}</Text>
            </View>
          ) : hasHorario ? (
            <View className="bg-primaria-azul px-4 h-full justify-center items-center rounded-br-[16px] z-10 min-w-[80px]">
              <Text className="text-white text-sm font-outfit-bold">{horaFormatada}</Text>
            </View>
          ) : null}

          <View className="flex-1 flex-row items-center justify-start pl-4">
            <View className="flex-row items-center mr-4">
              <RefreshCw size={16} color="white" strokeWidth={2.5} className="mr-1.5" />
              <Text className="text-white text-sm font-outfit-medium">{isAntiHorario ? "Reverso" : "Horário"}</Text>
            </View>
            <View className="flex-row items-center">
              {isIrrigando ? <Droplet size={16} color="white" strokeWidth={2.5} className="mr-1.5" /> : <DropletOff size={16} color="white" strokeWidth={2.5} className="mr-1.5" />}
              <Text className="text-white text-sm font-outfit-medium">{isIrrigando ? "Irrigando" : "Seco"}</Text>
            </View>
          </View>
        </View>

        {/* --- CORPO / GRID --- */}
        <View className={`p-4 flex-col ${variant === 'readonly' ? 'pl-4' : ''}`}>
          <View className="flex-row items-center mb-4">
            <Tag size={20} color={isExecutando && variant === "readonly" ? "#00A0A6" : "black"} strokeWidth={2.5} />
            <Text className={`text-base ml-2 font-outfit-bold flex-1 ${isExecutando && variant === "readonly" ? 'text-primaria-azul' : ''}`} numberOfLines={1} ellipsizeMode="tail">
              {data.nome}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <View className="flex-1 pr-2">
              <View className="flex-row items-center mb-3">
                {isIrrigando ? <Droplet size={20} color="#0D0D0D" strokeWidth={2.5} /> : <DropletOff size={20} color="#0D0D0D" strokeWidth={2.5} />}
                <Text className="text-sm ml-2 text-texto font-outfit flex-1">
                  {isIrrigando ? "Lâmina:" : "Percent.:"}{" "}
                  <Text className="font-outfit-bold">{data.lamina ?? 0} {isIrrigando ? "mm" : "%"}</Text>
                </Text>
              </View>
              
              {variant === "readonly" ? (
                <View className="flex-row items-center">
                  {statusPasso === 'concluido' ? <CheckCircle2 size={20} color="#0AA146" /> : 
                   statusPasso === 'executando' ? <ActivityIndicator size="small" color="#00A0A6" /> : 
                   statusPasso === 'interrompido' ? <PauseCircle size={20} color="#D32F2F" /> :
                   <Clock size={20} color="#666666" />}
                  
                  <Text className={`text-sm ml-2 font-outfit-bold flex-1 ${
                    statusPasso === 'concluido' ? 'text-primaria-verde' : 
                    statusPasso === 'executando' ? 'text-primaria-azul' : 
                    statusPasso === 'interrompido' ? 'text-incorreto' : 'text-subtexto'
                  }`}>
                    {statusPasso === 'concluido' ? 'Concluído' : 
                     statusPasso === 'executando' ? 'Em Execução' : 
                     statusPasso === 'interrompido' ? 'Pausado' : 'Aguardando'}
                  </Text>
                </View>
              ) : (
                <View className="flex-row items-center">
                  <Clock size={20} color="#0D0D0D" strokeWidth={2.5} />
                  <Text className="text-sm ml-2 text-texto font-outfit flex-1">
                    Duração: <Text className="font-outfit-bold">--h --min</Text>
                  </Text>
                </View>
              )}
            </View>

            <View className="flex-1 pl-3">
              <View className="flex-row items-center mb-3">
                <UndoDot size={20} color="#0D0D0D" strokeWidth={2.5} />
                <Text className="text-sm ml-2 text-texto font-outfit flex-1">
                  Início: <Text className="font-outfit-bold">{data.angulo_inicial ?? 0}°</Text>
                </Text>
              </View>
              <View className="flex-row items-center">
                <Undo size={20} color="#0D0D0D" strokeWidth={2.5} />
                <Text className="text-sm ml-2 text-texto font-outfit flex-1">
                  Final: <Text className="font-outfit-bold">{data.angulo_final ?? 0}°</Text>
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* --- BARRA DE AÇÕES DINÂMICA (Lateral ou Rodapé) --- */}
      {variant === "readonly" ? null : variant === "passo" ? (
        <View className={`${isSmallScreen ? 'w-full flex-row h-12' : 'w-12 flex-col'} bg-secundaria-azul`}>
          <View className={`bg-bg items-center justify-between flex-1 ${isSmallScreen ? 'flex-row px-6 border-t-[1px]' : 'py-2 border-l-[1px] rounded-tl-[8px]'} border-[#cacaca]`}>
            <Pressable onPress={onMoveUp} className={`p-2 rounded-full cursor-pointer hover:opacity-80 transition-opacity ${isFirst ? 'opacity-30' : 'active:opacity-50 bg-[#e0e0e0]'}`}>
              {isGrid ? <ArrowLeft size={20} color="#0D0D0D" strokeWidth={3} /> : <ArrowUp size={20} color="#0D0D0D" strokeWidth={3} />}
            </Pressable>
            
            <Pressable onPress={onRemove} className="p-2 active:opacity-50 cursor-pointer hover:opacity-80 transition-opacity">
              <X size={22} color="#FF6B6B" strokeWidth={2.5} />
            </Pressable>
            
            <Pressable onPress={onMoveDown} className={`p-2 rounded-full cursor-pointer hover:opacity-80 transition-opacity ${isLast ? 'opacity-30' : 'active:opacity-50 bg-[#e0e0e0]'}`}>
              {isGrid ? <ArrowRight size={20} color="#0D0D0D" strokeWidth={3} /> : <ArrowDown size={20} color="#0D0D0D" strokeWidth={3} />}
            </Pressable>
          </View>
        </View>
      ) : variant === "adicionar" ? (
        <View className={`${isSmallScreen ? 'w-full flex-row h-[50px]' : 'w-14 flex-col'} bg-secundaria-azul`}>
          <View className={`bg-primaria-azul flex-1 overflow-hidden ${isSmallScreen ? 'flex-row' : 'rounded-tl-[8px] flex-col'}`}>
            <Pressable onPress={onAdd} className="bg-primaria-verde flex-[1.5] items-center justify-center active:opacity-70 cursor-pointer hover:opacity-90 transition-opacity">
              <Plus size={26} color="white" strokeWidth={3} />
            </Pressable>
            <Pressable onPress={irParaEdicao} className={`flex-1 items-center justify-center active:opacity-70 ${isSmallScreen ? 'border-l-[1px]' : 'border-t-[1px]'} border-white/20 cursor-pointer hover:opacity-80 transition-opacity`}>
              <SquarePen size={20} color="white" />
            </Pressable>
            <Pressable onPress={handleExcluir} disabled={isExcluindo} className={`flex-1 items-center justify-center active:opacity-70 bg-incorreto/20 ${isSmallScreen ? 'border-l-[1px]' : 'border-t-[1px]'} border-white/20 cursor-pointer hover:opacity-80 transition-opacity`}>
              {isExcluindo ? <ActivityIndicator size="small" color="#FF6B6B" /> : <Trash2 size={20} color="white" />}
            </Pressable>
          </View>
        </View>
      ) : (
        <View className={`${isSmallScreen ? 'w-full flex-row h-[50px]' : 'w-12 flex-col'} bg-secundaria-azul`}>
          <View className={`bg-primaria-azul items-center justify-around flex-1 ${isSmallScreen ? 'flex-row px-4' : 'rounded-tl-[8px] py-4'}`}>
            <Pressable className="active:opacity-50 p-2 cursor-pointer hover:opacity-80 transition-opacity" onPress={handleExcluir} disabled={isExcluindo}>
              {isExcluindo ? <ActivityIndicator size="small" color="white" /> : <X size={24} color="white" strokeWidth={2.5} />}
            </Pressable>
            <Pressable className="active:opacity-50 p-2 cursor-pointer hover:opacity-80 transition-opacity" onPress={irParaEdicao}>
              <SquarePen size={22} color="white" strokeWidth={2.5} />
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}