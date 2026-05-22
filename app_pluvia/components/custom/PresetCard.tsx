import React from 'react';
import { View, Pressable, Alert, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import {
  RotateCw,
  RotateCcw,
  Clock,
  UndoDot,
  Undo,
  RefreshCw,
  Droplet,
  X,
  SquarePen,
  CalendarDays,
  User
} from 'lucide-react-native';

// Importe a interface e o hook que criamos anteriormente
import { Agendamento } from '@/services/api/cronograma.service';
import { useExcluirCronograma } from '@/hooks/api/useCronogramas';

interface PresetCardProps {
  data: Agendamento;
}

export default function PresetCard({ data }: PresetCardProps) {
  const router = useRouter();
  const { mutateAsync: excluir, isPending: isExcluindo } = useExcluirCronograma();

  // Desestruturação dos dados vindos do backend
  const { comando, horario, nome_criador, id, pivo_id } = data;

  const isAntiHorario = comando.direcao === 'ANTI_HORARIO';
  const isIrrigando = comando.irrigacao === true;

  // Formatação segura de Data e Hora
  const dataHoraObj = new Date(horario);
  const dataFormatada = dataHoraObj.toLocaleDateString('pt-BR');
  const horaFormatada = dataHoraObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  // Ação de Deletar com trava de segurança mecânica/visual
  const handleExcluir = () => {
    Alert.alert(
      "Excluir Agendamento",
      "Tem certeza que deseja cancelar e remover este comando do cronograma?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: async () => {
            try {
              await excluir(id);
            } catch (error) {
              Alert.alert("Erro", "Falha ao excluir o agendamento.");
            }
          } 
        }
      ]
    );
  };

  return (
    <View className="flex-row bg-white rounded-[12px] border-[2px] border-[#cacaca] overflow-hidden">

      {/* 1. ÁREA ESQUERDA (Cabeçalho + Grid) */}
      <View className="flex-1">

        {/* --- CABEÇALHO --- */}
        <View className="flex-row bg-secundaria-azul">
          
          {/* Aba do Título -> Agora exibe a Hora */}
          <View className="bg-primaria-azul px-4 py-2 justify-center items-center rounded-br-[16px] z-10 flex-wrap min-w-[80px]">
            <Text className="text-white text-sm font-outfit-bold text-wrap leading-tight">
              {horaFormatada}
            </Text>
          </View>

          {/* Status do Cabeçalho */}
          <View className="flex-1 flex-row items-center justify-start pl-4 pr-4 gap-4">
            <View className="flex-row items-center gap-1.5">
              <RefreshCw size={16} color="white" strokeWidth={2.5} />
              <Text className="text-white text-sm font-outfit-medium">
                {isAntiHorario ? 'Reverso' : 'Horário'}
              </Text>
            </View>
            <View className="flex-row items-center gap-1.5">
              <Droplet size={16} color={isIrrigando ? "#0AA146" : "white"} strokeWidth={2.5} />
              <Text className="text-white text-sm font-outfit-medium">
                {isIrrigando ? 'Irrigando' : 'Seco'}
              </Text>
            </View>
          </View>

        </View>

        {/* --- CORPO / GRID --- */}
        <View className="p-4 flex-row justify-between gap-4">
          
          {/* Coluna 1 (Métricas e Informações) */}
          <View className="gap-3 flex-1">
            <View className="flex-row items-center">
              <Droplet size={20} color="#0D0D0D" strokeWidth={2.5} />
              <Text className="text-sm ml-2 text-texto font-outfit">
                Lâmina: <Text className="font-outfit-bold">{comando.lamina} mm</Text>
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <Clock size={20} color="#0D0D0D" strokeWidth={2.5} />
              <Text className="text-sm ml-2 text-texto font-outfit">
                Duração: <Text className="font-outfit-bold">-- h -- min</Text>
              </Text>
            </View>

            <View className="flex-row items-center mt-1">
              <User size={16} color="#666666" strokeWidth={2.5} />
              <Text 
                className="text-xs ml-1 text-subtexto font-outfit-medium" 
                numberOfLines={1} 
                ellipsizeMode="tail"
              >
                {nome_criador || "Desconhecido"}
              </Text>
            </View>
          </View>

          {/* Coluna 2 (Ângulos e Data) */}
          <View className="gap-3 pr-2 flex-[0.8]">
            <View className="flex-row items-center">
              <UndoDot size={20} color="#0D0D0D" strokeWidth={2.5} />
              <Text className="text-sm ml-2 text-texto font-outfit">
                Início: <Text className="font-outfit-bold">{comando.angulo_inicial}°</Text>
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <Undo size={20} color="#0D0D0D" strokeWidth={2.5} />
              <Text className="text-sm ml-2 text-texto font-outfit">
                Final: <Text className="font-outfit-bold">{comando.angulo_final}°</Text>
              </Text>
            </View>

            <View className="flex-row items-center mt-1">
              <CalendarDays size={16} color="#666666" strokeWidth={2.5} />
              <Text className="text-xs ml-1 text-subtexto font-outfit-medium">
                {dataFormatada}
              </Text>
            </View>
          </View>

        </View>
      </View>

      {/* 2. BARRA LATERAL DIREITA (Ações) */}
      <View className="bg-secundaria-azul w-12">
        <View className="bg-primaria-azul rounded-tl-[8px] items-center justify-center flex-1 py-4 gap-6">
          
          <Pressable 
            className="active:opacity-50 p-2" 
            onPress={handleExcluir}
            disabled={isExcluindo}
          >
            {isExcluindo ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <X size={24} color="white" strokeWidth={2.5} />
            )}
          </Pressable>
          
          <Pressable 
            className="active:opacity-50 p-2"
            // Direciona para a tela de edição passando o ID do agendamento e o ID do pivô
            onPress={() => router.push(`/(tabs)/presets/${pivo_id}/editarCronograma?id=${id}`)}
          >
            <SquarePen size={22} color="white" strokeWidth={2.5} />
          </Pressable>

        </View>
      </View>

    </View>
  );
}