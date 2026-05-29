import React, { useState, useMemo } from "react";
import { View, ActivityIndicator, Pressable, Alert, ScrollView } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useRouter, useLocalSearchParams } from "expo-router";
import Header from "@/components/custom/Header";
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  Droplet, 
  RotateCw, 
  RotateCcw, 
  Trash2,
  SquarePen,
  CalendarClock
} from "lucide-react-native";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// Hooks
import { useCronogramasPivo, useAtivarCronograma, useExcluirCronograma } from "@/hooks/api/useCronogramas";

export default function Cronogramas() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const { data: cronogramas, isPending } = useCronogramasPivo(id as string);
  const { mutateAsync: ativarCronograma, isPending: isAtivando } = useAtivarCronograma();
  const { mutateAsync: excluirCronograma } = useExcluirCronograma();

  const [excluindoId, setExcluindoId] = useState<string | null>(null);

  // Mágica da Ordenação: Agora ordena pelo horario_inicio raiz do cronograma
  const cronogramasOrdenados = useMemo(() => {
    if (!cronogramas) return [];
    
    return [...cronogramas].sort((a, b) => {
      // Se não tiver horário, joga pro fim da lista
      const tempoA = a.horario_inicio ? new Date(a.horario_inicio).getTime() : Number.MAX_SAFE_INTEGER;
      const tempoB = b.horario_inicio ? new Date(b.horario_inicio).getTime() : Number.MAX_SAFE_INTEGER;
      
      return tempoA - tempoB; 
    });
  }, [cronogramas]);

  const handleAtivar = async (cronogramaId: string) => {
    try {
      await ativarCronograma({ id: cronogramaId, pivo_id: id as string });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível ativar o cronograma.");
    }
  };

  const handleExcluir = (cronogramaId: string) => {
    Alert.alert(
      "Excluir Cronograma",
      "Tem certeza que deseja excluir todo este cronograma e seus passos? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Excluir", 
          style: "destructive", 
          onPress: async () => {
            try {
              setExcluindoId(cronogramaId);
              await excluirCronograma(cronogramaId);
            } catch (error) {
              Alert.alert("Erro", "Falha ao excluir o cronograma.");
            } finally {
              setExcluindoId(null);
            }
          } 
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-bg px-4 py-6">
      <View className="flex-row justify-between items-center w-full mb-6">
        <Header title="Cronogramas" subtitle="Agendamentos" />

        <Button
          className="bg-primaria-azul w-10 h-10 p-0 rounded-[12px] items-center justify-center active:opacity-70"
          onPress={() => router.push({
            pathname: '/(tabs)/operacao/addCronograma',
            params: { pivo_id: id }
          })}
        >
          <Plus size={24} color="white" strokeWidth={2.5} />
        </Button>
      </View>

      {isPending ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#00A0A6" />
        </View>
      ) : (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          
          {cronogramasOrdenados.length === 0 ? (
            <Text className="text-center text-subtexto mt-10 font-outfit">
              Nenhum agendamento programado.
            </Text>
          ) : (
            <Accordion type="single" collapsible className="w-full gap-4">
              {cronogramasOrdenados.map((cronograma) => {
                const dataInicioObj = cronograma.horario_inicio ? new Date(cronograma.horario_inicio) : null;

                return (
                  <AccordionItem 
                    key={cronograma.id} 
                    value={cronograma.id} 
                    className={`border-[2px] rounded-[12px] bg-white overflow-hidden ${cronograma.is_ativo ? 'border-primaria-verde' : 'border-[#cacaca]'}`}
                  >
                    
                    {/* CABEÇALHO DO ACCORDION */}
                    <AccordionTrigger className="px-4 py-4 hover:no-underline">
                      <View className="flex-row items-center justify-between w-full">
                        <View className="flex-1 pr-2 items-start gap-1">
                          <Text className="text-base font-outfit-bold text-texto text-left" numberOfLines={1}>
                            {cronograma.nome}
                          </Text>
                          
                          <View className="flex-row items-center gap-1.5 flex-wrap mt-0.5">
                            <Text className="text-xs text-subtexto font-outfit">
                              {cronograma.passos.length} {cronograma.passos.length === 1 ? 'passo' : 'passos'}
                            </Text>
                            
                            {/* O horário mestre aparece elegantemente aqui */}
                            {dataInicioObj && (
                              <>
                                <View className="w-1 h-1 rounded-full bg-subtexto" />
                                <View className="flex-row items-center gap-1">
                                  <CalendarClock size={12} color="#00A0A6" />
                                  <Text className="text-xs text-primaria-azul font-outfit-medium">
                                    {dataInicioObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} às {dataInicioObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                  </Text>
                                </View>
                              </>
                            )}
                          </View>

                        </View>
                        
                        <Pressable 
                          onPress={() => !cronograma.is_ativo && handleAtivar(cronograma.id)}
                          disabled={isAtivando || cronograma.is_ativo}
                          className={`flex-row items-center gap-2 px-3 py-1.5 rounded-full border-[1.5px] ${cronograma.is_ativo ? 'bg-[#E8F5E9] border-primaria-verde' : 'bg-transparent border-[#cacaca]'}`}
                        >
                          {cronograma.is_ativo ? (
                            <>
                              <CheckCircle2 size={16} color="#0AA146" />
                              <Text className="text-[#0AA146] font-outfit-bold text-xs">Ativo</Text>
                            </>
                          ) : (
                            <>
                              <Circle size={16} color="#666666" />
                              <Text className="text-subtexto font-outfit-medium text-xs">Ativar</Text>
                            </>
                          )}
                        </Pressable>
                      </View>
                    </AccordionTrigger>

                    {/* CONTEÚDO DO ACCORDION (Os Passos Expandidos) */}
                    <AccordionContent className="bg-bg px-4 py-4 gap-3 border-t-[1px] border-[#cacaca]/50">
                      
                      <View className="flex-row justify-between items-center mb-2">
                        <Text className="font-outfit-bold text-primaria-azul">Ordem de Execução</Text>
                        
                        {/* Botões de Ação do Cronograma */}
                        <View className="flex-row gap-2">
                          <Pressable 
                            onPress={() => handleExcluir(cronograma.id)}
                            disabled={excluindoId === cronograma.id}
                            className="bg-incorreto border-[1px] border-incorreto px-2 py-1.5 rounded-pluvia flex-row items-center gap-1 active:opacity-50"
                          >
                            {excluindoId === cronograma.id ? (
                              <ActivityIndicator size="small" color="#D32F2F" />
                            ) : (
                              <>
                                <Trash2 size={14} color="white" />
                                <Text className="text-white text-xs font-outfit-bold">Excluir</Text>
                              </>
                            )}
                          </Pressable>

                          <Pressable 
                            onPress={() => router.push({ pathname: '/(tabs)/operacao/editCronograma', params: { id: cronograma.id, pivo_id: id } })}
                            className="bg-secundaria-azul border-[1px] border-secundaria-azul px-2 py-1.5 rounded-pluvia flex-row items-center gap-1 active:opacity-50"
                          >
                            <SquarePen size={14} color="white" />
                            <Text className="text-white text-xs font-outfit-bold">Editar</Text>
                          </Pressable>
                        </View>
                      </View>

                      {/* Ordenamos os passos pela coluna "ordem" antes de renderizar */}
                      {cronograma.passos
                        .sort((a: any, b: any) => a.ordem - b.ordem)
                        .map((passo: any, index: number) => (
                        <View key={passo.id} className="bg-white border-[1px] border-borda rounded-[12px] p-3 flex-row items-center">
                          
                          <View className="bg-secundaria-azul w-8 h-8 rounded-full items-center justify-center mr-3">
                            <Text className="text-white font-outfit-bold">{index + 1}</Text>
                          </View>
                          
                          <View className="flex-1 gap-1">
                            <Text className="font-outfit-bold text-texto text-sm">{passo.nome}</Text>
                            
                            <View className="flex-row flex-wrap gap-x-3 gap-y-1 mt-1">
                              <View className="flex-row items-center gap-1">
                                <Droplet size={14} color={passo.irrigacao ? "#0AA146" : "#666"} strokeWidth={2.5} />
                                <Text className="text-[12px] text-texto font-outfit-medium">{passo.lamina} mm</Text>
                              </View>
                              <View className="flex-row items-center gap-1">
                                {passo.direcao === 'HORARIO' ? <RotateCw size={14} color="#666" /> : <RotateCcw size={14} color="#666" />}
                                <Text className="text-[12px] text-texto font-outfit-medium">{passo.angulo_inicial}° a {passo.angulo_final}°</Text>
                              </View>
                            </View>

                            {/* Removemos a borda e as tags de relógio do passo individual */}
                          </View>
                        </View>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </ScrollView>
      )}
    </View>
  );
}