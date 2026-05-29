/**
 * ✅ [PORTABILIDADE WEB E MOBILE CONCLUÍDA - GRID BLINDADO]
 * * MODIFICAÇÕES REALIZADAS:
 * 1. GRID NATIVO: O `<Accordion>` não aceita 'flex-row' na Web e engole os itens. A solução foi criar uma `<View className="flex-row flex-wrap">` nativa por fora.
 * 2. CÁLCULO DE COLUNAS: A View que envolve o card agora recebe 'style={{ width: `${100 / getColunas()}%` }}'. Isso obriga o navegador a dar exatamente 25% da tela para cada um (cabendo 4), sem amassar o conteúdo interno!
 * 3. ACORDEÕES INDEPENDENTES: Agora cada card é o seu próprio <Accordion>. Isso é ideal para grids no desktop, pois abrir o cronograma da coluna 1 não fecha o da coluna 4, evitando que a tela "pule".
 * 4. FIX MOBILE (BUG DO ESPICHAMENTO): Removida a classe 'h-full' do <Accordion> e <AccordionItem>. No React Native Mobile, forçar 'h-full' dentro de um ScrollView faz o item crescer infinitamente.
 * 5. BORDAS PROTEGIDAS: O 'pb-[2px]' foi mantido para a borda inferior nunca ser cortada na Web.
 * 6. ESPAÇAMENTO INTERNO: Mantido o layout aprovado (mr-2, mb-3) no conteúdo expandido.
 */

import React, { useState, useMemo } from "react";
import { View, ActivityIndicator, Pressable, Alert, ScrollView, useWindowDimensions, DimensionValue } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useRouter, useLocalSearchParams } from "expo-router";
import Header from "@/components/custom/Header";
import { Screen } from "@/components/custom/Screen";
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

  // [WEB] Lendo a largura da tela
  const { width } = useWindowDimensions();

  // [WEB] Função que decide quantas colunas exibir baseada no tamanho da tela
  const getColunas = () => {
    if (width >= 1650) return 4; 
    if (width >= 1250) return 3; 
    if (width >= 870) return 2; 
    return 1;                   
  };

  // Mágica da Ordenação: Agora ordena pelo horario_inicio raiz do cronograma
  const cronogramasOrdenados = useMemo(() => {
    if (!cronogramas) return [];
    
    return [...cronogramas].sort((a, b) => {
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
    <Screen>
      <View className="flex-1 bg-bg">
        <View className="flex-row justify-between items-center w-full mb-6">
          <Header title="Cronogramas" subtitle="Agendamentos" />

          {/* [WEB] cursor-pointer e hover adicionados ao botão */}
          <Button
            className="bg-primaria-azul w-10 h-10 p-0 rounded-[12px] items-center justify-center active:opacity-70 cursor-pointer hover:opacity-80 transition-opacity"
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
          <ScrollView className="flex-1 w-full" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            
            {cronogramasOrdenados.length === 0 ? (
              <Text className="text-center text-subtexto mt-10 font-outfit">
                Nenhum agendamento programado.
              </Text>
            ) : (
              // [WEB FIX] View Nativa flex-row com wrap criando a grade! O -mx-2 compensa o padding lateral dos filhos.
              <View className={`flex-row flex-wrap w-full ${getColunas() > 1 ? '-mx-2' : ''}`}>
                
                {cronogramasOrdenados.map((cronograma) => {
                  const dataInicioObj = cronograma.horario_inicio ? new Date(cronograma.horario_inicio) : null;
                  
                  // Calcula a largura exata da coluna (ex: 4 colunas = 25%)
                  const larguraColuna = `${100 / getColunas()}%`;

                  return (
                    // [WEB FIX] Container da célula. Ele pega a porcentagem exata da tela e usa px-2 para dar o espaço entre os cards.
                    <View 
                        key={cronograma.id}
                        style={{
                          width: `${100 / getColunas()}%` as DimensionValue,
                        }}
                        className={`${getColunas() > 1 ? 'px-2' : ''} mb-4 pb-[2px]`}
                    >
                      {/* [FIX MOBILE] Removido o h-full para o card parar de esticar infinitamente no celular */}
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem 
                          value={cronograma.id} 
                          className={`border-[2px] rounded-[12px] bg-white overflow-hidden ${cronograma.is_ativo ? 'border-primaria-verde' : 'border-[#cacaca]'}`}
                        >
                          
                          {/* CABEÇALHO DO ACCORDION */}
                          <AccordionTrigger className="px-4 py-4 hover:no-underline cursor-pointer hover:bg-slate-50 transition-colors">
                            <View className="flex-row items-center justify-between w-full">
                              <View className="flex-1 pr-2 items-start">
                                <Text className="text-base font-outfit-bold text-texto text-left mb-1" numberOfLines={1}>
                                  {cronograma.nome}
                                </Text>
                                
                                <View className="flex-row items-center flex-wrap mt-0.5">
                                  <Text className="text-xs text-subtexto font-outfit mr-1.5">
                                    {cronograma.passos.length} {cronograma.passos.length === 1 ? 'passo' : 'passos'}
                                  </Text>
                                  
                                  {/* O horário mestre aparece elegantemente aqui */}
                                  {dataInicioObj && (
                                    <>
                                      <View className="w-1 h-1 rounded-full bg-subtexto mr-1.5" />
                                      <View className="flex-row items-center">
                                        <CalendarClock size={12} color="#00A0A6" className="mr-1" />
                                        <Text className="text-xs text-primaria-azul font-outfit-medium">
                                          {dataInicioObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} às {dataInicioObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                        </Text>
                                      </View>
                                    </>
                                  )}
                                </View>

                              </View>
                              
                              {/* [WEB] cursor-pointer e hover */}
                              <Pressable 
                                onPress={() => !cronograma.is_ativo && handleAtivar(cronograma.id)}
                                disabled={isAtivando || cronograma.is_ativo}
                                className={`flex-row items-center px-3 py-1.5 rounded-full border-[1.5px] cursor-pointer hover:opacity-80 transition-opacity ${cronograma.is_ativo ? 'bg-[#E8F5E9] border-primaria-verde' : 'bg-transparent border-[#cacaca]'}`}
                              >
                                {cronograma.is_ativo ? (
                                  <>
                                    <CheckCircle2 size={16} color="#0AA146" className="mr-1" />
                                    <Text className="text-[#0AA146] font-outfit-bold text-xs">Ativo</Text>
                                  </>
                                ) : (
                                  <>
                                    <Circle size={16} color="#666666" className="mr-1" />
                                    <Text className="text-subtexto font-outfit-medium text-xs">Ativar</Text>
                                  </>
                                )}
                              </Pressable>
                            </View>
                          </AccordionTrigger>

                          {/* CONTEÚDO DO ACCORDION (Os Passos Expandidos) */}
                          <AccordionContent className="bg-bg border-t-[1px] border-[#cacaca]/50">
                            {/* [WEB FIX] O bloco interno é preservado do seu código aprovado, garantindo o espaçamento correto no PC */}
                            <View className="px-4 py-4 w-full">
                              
                              <View className="flex-row justify-between items-center mb-4">
                                <Text className="font-outfit-bold text-primaria-azul">Ordem de Execução</Text>
                                
                                {/* Botões de Ação do Cronograma */}
                                <View className="flex-row">
                                  <Pressable 
                                    onPress={() => handleExcluir(cronograma.id)}
                                    disabled={excluindoId === cronograma.id}
                                    className="mr-2 bg-incorreto border-[1px] border-incorreto px-2 py-1.5 rounded-pluvia flex-row items-center active:opacity-50 cursor-pointer hover:opacity-80 transition-opacity"
                                  >
                                    {excluindoId === cronograma.id ? (
                                      <ActivityIndicator size="small" color="#D32F2F" />
                                    ) : (
                                      <>
                                        <Trash2 size={14} color="white" className="mr-1" />
                                        <Text className="text-white text-xs font-outfit-bold">Excluir</Text>
                                      </>
                                    )}
                                  </Pressable>

                                  <Pressable 
                                    onPress={() => router.push({ pathname: '/(tabs)/operacao/editCronograma', params: { id: cronograma.id, pivo_id: id } })}
                                    className="bg-secundaria-azul border-[1px] border-secundaria-azul px-2 py-1.5 rounded-pluvia flex-row items-center active:opacity-50 cursor-pointer hover:opacity-80 transition-opacity"
                                  >
                                    <SquarePen size={14} color="white" className="mr-1" />
                                    <Text className="text-white text-xs font-outfit-bold">Editar</Text>
                                  </Pressable>
                                </View>
                              </View>

                              {/* Ordenamos os passos pela coluna "ordem" antes de renderizar */}
                              {cronograma.passos
                                .sort((a: any, b: any) => a.ordem - b.ordem)
                                .map((passo: any, index: number, array: any[]) => (
                                <View key={passo.id} className={`bg-white border-[1px] border-borda rounded-[12px] p-3 flex-row items-center ${index !== array.length - 1 ? 'mb-3' : ''}`}>
                                  
                                  <View className="bg-secundaria-azul w-8 h-8 rounded-full items-center justify-center mr-3">
                                    <Text className="text-white font-outfit-bold">{index + 1}</Text>
                                  </View>
                                  
                                  <View className="flex-1">
                                    <Text className="font-outfit-bold text-texto text-sm mb-1">{passo.nome}</Text>
                                    
                                    <View className="flex-row flex-wrap mt-1">
                                      <View className="flex-row items-center mr-3 mb-1">
                                        <Droplet size={14} color={passo.irrigacao ? "#0AA146" : "#666"} strokeWidth={2.5} className="mr-1" />
                                        <Text className="text-[12px] text-texto font-outfit-medium">{passo.lamina} mm</Text>
                                      </View>
                                      <View className="flex-row items-center mb-1">
                                        {passo.direcao === 'HORARIO' ? <RotateCw size={14} color="#666" className="mr-1" /> : <RotateCcw size={14} color="#666" className="mr-1" />}
                                        <Text className="text-[12px] text-texto font-outfit-medium">{passo.angulo_inicial}° a {passo.angulo_final}°</Text>
                                      </View>
                                    </View>

                                  </View>
                                </View>
                              ))}
                            </View>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
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