import React, { useMemo, useState } from "react";
import { View, Pressable, ActivityIndicator, Alert } from "react-native";
import { Text } from "@/components/ui/text";
import { FlashList } from "@shopify/flash-list";
import { Button } from "@/components/ui/button";
import {
  Wifi,
  RotateCw,
  TriangleAlert,
  Gauge,
  Zap,
  RefreshCw,
  Droplet,
  Clock,
  UndoDot,
  RefreshCcwDot,
  Router,
  CloudSync,
  Files,
  Signal,
  Layers,
  SquarePen,
} from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Separator } from "@/components/ui/separator";

// ! IMPORTS CUSTOM
import Header from "@/components/custom/Header";
import { Screen } from "@/components/custom/Screen";
import { Table, TableColumn } from "@/components/custom/Table";
import RadarComplexo from "@/components/custom/RadarComplexo";

import PresetCard from "@/components/custom/PresetCard";

import { usePivo } from "@/hooks/api/usePivos";
import { useDashboardTelemetria } from "@/hooks/api/useTelemetria";
import { useCronogramasPivo, useControleCronograma } from "@/hooks/api/useCronogramas";

// * MOCK DA TABELA
export const historicoPivoMock = [
  {
    id: "01",
    data: "19/03/2026",
    hora: "00:24",
    duracao: "13 h 30 min",
    voltas: "4 Voltas",
    irrigacao: "Sim",
    direcao: "Reverso",
    inicial: "0°",
    final: "80°",
    percentimetro: "43%",
    operador: "Bernardo Cunha",
  },
  {
    id: "02",
    data: "19/03/2026",
    hora: "13:15",
    duracao: "13 h 30 min",
    voltas: "3 Voltas",
    irrigacao: "Não",
    direcao: "Horário",
    inicial: "95°",
    final: "112°",
    percentimetro: "100%",
    operador: "Mateus Felisberto Xavier Rosa",
  },
  {
    id: "03",
    data: "19/03/2026",
    hora: "14:30",
    duracao: "13 h 30 min",
    voltas: "1 Volta",
    irrigacao: "Sim",
    direcao: "Horário",
    inicial: "120°",
    final: "180°",
    percentimetro: "50%",
    operador: "João Ninguém",
  },
  {
    id: "04",
    data: "20/03/2026",
    hora: "03:00",
    duracao: "13 h 30 min",
    voltas: "Meia Volta",
    irrigacao: "Sim",
    direcao: "Reverso",
    inicial: "10°",
    final: "100°",
    percentimetro: "25%",
    operador: "Zé",
  },
];

const colunasHistorico: TableColumn<(typeof historicoPivoMock)[0]>[] = [
  { key: "id", title: "ID", width: 60 },
  { key: "data", title: "Data", width: 110 },
  { key: "hora", title: "Hora", width: 80 },
  { key: "duracao", title: "Duração", width: 110 },
  { key: "voltas", title: "Voltas", width: 100 },
  { key: "irrigacao", title: "Irrigação", width: 90 },
  { key: "direcao", title: "Direção", width: 100 },
  { key: "inicial", title: "Inicial", width: 80 },
  { key: "final", title: "Final", width: 80 },
  { key: "percentimetro", title: "Percentímetro", width: 120 },
  { key: "operador", title: "Operador", width: 200 },
];

const calcularTempoRestante = (pivo: any, passoAtual: any, anguloAtual: number) => {
  if (!pivo?.vazao || !pivo?.raio || !passoAtual) return "-- h -- min";
  if (passoAtual.status_passo !== 'executando') return "-- h -- min";

  const vazaoM3h = pivo.vazao / 1000; 
  const raioM = pivo.raio; 
  const areaM2 = Math.PI * Math.pow(raioM, 2);
  const volumeM3 = areaM2 * (passoAtual.lamina / 1000);

  if (vazaoM3h <= 0) return "-- h -- min";

  const tempoVoltaCompletaHoras = volumeM3 / vazaoM3h;
  
  const anguloRestante = Math.abs(passoAtual.angulo_final - anguloAtual);
  if (anguloRestante === 0) return "0 h 0 min";

  const tempoRestanteDecimal = tempoVoltaCompletaHoras * (anguloRestante / 360);
  
  const horas = Math.floor(tempoRestanteDecimal);
  const minutos = Math.round((tempoRestanteDecimal - horas) * 60);

  return `${horas} h ${minutos} min`;
};

// 1. COMPONENTE DO CABEÇALHO DA LISTA (Tudo acima da tabela)
function TopoDaTela({ pivo, status, cronogramas, onRefresh }: { pivo: any; status: any; cronogramas: any[]; onRefresh: () => Promise<void>; }) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [ultimaAtualizacaoApp, setUltimaAtualizacaoApp] = useState<Date>(new Date());

  const handlePress = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setUltimaAtualizacaoApp(new Date()); 
    setIsRefreshing(false);
  };

  const anguloAtual = status?.angulo_atual || 0;
  const isRodando = status?.status_operacional === "Irrigando" || status?.status_operacional === "Movimentando";
  const isFalha = status?.status_operacional === "Falha";

  const cronogramaAtivo = useMemo(() => cronogramas?.find((c) => c.is_ativo === true), [cronogramas]);
  const passoEmExecucao = useMemo(() => cronogramaAtivo?.passos.find((p: any) => p.status_passo === 'executando'), [cronogramaAtivo]);

  const tempoRestanteFormatado = calcularTempoRestante(pivo, passoEmExecucao, anguloAtual);

  return (
    <Screen>
      {/* // * Cabeçalho */}
      <View className="self-stretch flex-row mb-4">
        <View className="flex-1 flex-row justify-between items-center">
          <View className="flex-row gap-2 items-center">
            <Header title={pivo?.nome_pivo || "Carregando..."} subtitle={pivo?.codigo_serie || "---"} />
            <Wifi size={24} color={isFalha ? "#D32F2F" : "#0D0D0D"} strokeWidth={2.5} />
          </View>

          {/* Última atualização */}
          <View className="flex-row items-center justify-center gap-3">
            <View className="items-end">
              <Text className="text-[10px] text-subtexto font-outfit">
                Última Atualização:
              </Text>
              <Text className="text-xs text-texto font-outfit-bold">
                {ultimaAtualizacaoApp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>

            <Pressable onPress={handlePress} disabled={isRefreshing} className={`active:opacity-50 bg-primaria-azul rounded-[12px] w-[40px] h-[40px] items-center justify-center ${isRefreshing ? "opacity-50" : ""}`}>
              {isRefreshing ? <ActivityIndicator size="small" color="white" /> : <RotateCw size={20} color="white" strokeWidth={2.5} />}
            </Pressable>
          </View>
        </View>
      </View>

      {/* --- TAG DE ALERTA --- */}
      {isFalha && (
        <View className="bg-[#D32F2F] rounded-pluvia flex-row items-center px-4 py-2 mb-6 shadow-sm">
          <TriangleAlert size={20} color="white" strokeWidth={2.5} />
          <Text className="text-white font-outfit-bold ml-2 text-sm">
            Equipamento em Falha / Parada de Emergência
          </Text>
        </View>
      )}

      {/* --- RADAR CENTRAL --- */}
      <View className="items-center justify-center mb-8">
        <RadarComplexo size={260} currentAngle={anguloAtual} />
      </View>

      {/* --- LINHA DE STATUS (Em Funcionamento / Horário / Irrigando) --- */}
      <View className="flex-row items-center justify-between px-2">
        {/* Status */}
        <View className="flex-row items-center gap-2">
          <View className={`w-4 h-4 rounded-full ${isRodando ? "bg-[#0AA146]" : isFalha ? "bg-[#D32F2F]" : "bg-[#666666]"}`} />
          <Text className="font-outfit-medium text-texto text-sm">
            {status?.status_operacional || "Parado"}
          </Text>
        </View>

        {/* Divisor Vertical */}
        <View className="w-px h-6 bg-borda" />

        {/* Informações da direita */}
        <View className="flex-row items-center gap-4">
          <View className="flex-row items-center gap-1.5">
            <RefreshCw size={18} color="#0D0D0D" strokeWidth={2.5} />
            <Text className="font-outfit-medium text-texto text-sm">
              {passoEmExecucao?.direcao === "HORARIO" ? "Horário" : passoEmExecucao?.direcao === "ANTI_HORARIO" ? "Anti-Hor." : "---"}
            </Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <Droplet size={18} color={passoEmExecucao?.irrigacao ? "#00A0A6" : "#0D0D0D"} strokeWidth={2.5} />
            <Text className="font-outfit-medium text-texto text-sm">
              {passoEmExecucao?.irrigacao ? "Irrigando" : "Seco"}
            </Text>
          </View>
        </View>
      </View>

      <Separator className="my-5 bg-[#B5B5B5]" decorative />

      {/* --- GRID DE MÉTRICAS --- */}
      <View className="flex-row flex-wrap self-stretch justify-between gap-y-4">
        <View className="w-[48%] flex-row items-center gap-2">
          <Gauge size={20} color="#0D0D0D" strokeWidth={2.5} />
          <Text className="font-outfit text-texto text-sm">
            Lâmina: <Text className="font-outfit-bold">{passoEmExecucao?.lamina || 0} mm</Text>
          </Text>
        </View>
        <View className="w-[48%] flex-row items-center gap-2">
          <RefreshCcwDot size={20} color="#0D0D0D" strokeWidth={2.5} />
          <Text className="font-outfit text-texto text-sm">
            Posição Atual: <Text className="font-outfit-bold">{anguloAtual}°</Text>
          </Text>
        </View>
        <View className="w-[48%] flex-row items-center gap-2">
          <Zap size={20} color="#0D0D0D" strokeWidth={2.5} />
          <Text className="font-outfit text-texto text-sm">
            Tensão: <Text className="font-outfit-bold">{status?.tensao || 0} V</Text>
          </Text>
        </View>
        <View className="w-[48%] flex-row items-center gap-2">
          <UndoDot size={20} color="#0D0D0D" strokeWidth={2.5} />
          <Text className="font-outfit text-texto text-sm">
            PSI: <Text className="font-outfit-bold">{status?.pressao || 0}</Text>
          </Text>
        </View>
      </View>

      <Separator className="my-5 bg-[#B5B5B5]" decorative />

      {/* --- RESUMO DE VOLTAS E DURAÇÃO --- */}
      <View className="gap-y-3 px-2">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-2">
            <RotateCw size={20} color="#0D0D0D" strokeWidth={2.5} />
            <Text className="font-outfit text-texto text-sm">Voltas:</Text>
          </View>
          <Text className="font-outfit-bold text-texto text-sm">
            -
          </Text>
        </View>

        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-2">
            <Clock size={20} color="#0D0D0D" strokeWidth={2.5} />
            <Text className="font-outfit text-texto text-sm">Tempo Restante Estimado:</Text>
          </View>
          <Text className="font-outfit-bold text-texto text-sm">
            {tempoRestanteFormatado}
          </Text>
        </View>
      </View>

      <Separator className="my-5 bg-[#B5B5B5]" decorative />

      {/* --- GRID DE MÉTRICAS DE SINAL --- */}
      <View className="flex-row flex-wrap justify-between px-2 gap-y-4">
        <View className="w-[48%] flex-row items-center gap-2">
          <Router size={20} color="#0D0D0D" strokeWidth={2.5} />
          <Text className="font-outfit text-texto text-sm">
            Latência{"\n"} de Sinal:
          </Text>
          <Text className="font-outfit-bold">-</Text>
        </View>
        <View className="w-[48%] flex-row items-center gap-2">
          <CloudSync size={20} color="#0D0D0D" strokeWidth={2.5} />
          <Text className="font-outfit text-texto text-sm">
            Uptime{"\n"} do Sistema:{" "}
          </Text>
          <Text className="font-outfit-bold">-</Text>
        </View>
        <View className="w-[48%] flex-row items-center gap-2">
          <Signal size={20} color="#0D0D0D" strokeWidth={2.5} />
          <Text className="font-outfit text-texto text-sm">
            Ping: <Text className="font-outfit-bold">500 ms</Text>
          </Text>
        </View>
        <View className="w-[48%] flex-row items-center gap-2">
          <Files size={20} color="#0D0D0D" strokeWidth={2.5} />
          <Text className="font-outfit text-texto text-sm">
            Versão: <Text className="font-outfit-bold">v1.4.2</Text>
          </Text>
        </View>
      </View>

      <Separator className="my-5 bg-[#B5B5B5]" decorative />

      {/* --- CRONOGRAMA --- */}
      <View className="gap-y-5">
        <View className="flex-row justify-between items-center">
          <Text className="font-outfit-bold text-lg">Cronograma Ativo</Text>
          <View className="flex-row gap-2">
            <Pressable className="active:opacity-50 bg-primaria-azul rounded-[12px] w-[40px] h-[40px] items-center justify-center self-end" onPress={() => router.push({ pathname: "/(tabs)/operacao/cronogramas", params: { id: pivo?.id } })}>
              <Layers size={24} color="white" strokeWidth={2.5} />
            </Pressable>
            <Button className="rounded-pluvia rounded rounded-br-none rounded-tl-none bg-secundaria-azul h-[40] w-auto" disabled={!cronogramaAtivo} onPress={() => cronogramaAtivo && router.push({ pathname: "/(tabs)/operacao/editCronograma", params: { id: cronogramaAtivo.id, pivo_id: pivo?.id, origem: "pivo" } })}>
              <SquarePen size={24} color="white" strokeWidth={2.5} />
              <Text className="font-outfit-bold text-sm">Editar</Text>
            </Button>
          </View>
        </View>

        <View className="m-0">
          {cronogramaAtivo ? (
            <View>
              <View className="mb-4">
                <Text className="font-outfit-bold text-lg">{cronogramaAtivo.nome}</Text>
                {cronogramaAtivo.horario_inicio && (
                  <View className="flex-row items-center mt-1.5 gap-2">
                    <Clock size={16} color="#666666" />
                    <Text className="text-sm font-outfit-medium">Início agendado: {new Date(cronogramaAtivo.horario_inicio).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}</Text>
                  </View>
                )}
              </View>

              {cronogramaAtivo.passos.sort((a: any, b: any) => a.ordem - b.ordem).map((passo: any, index: number) => (
                <React.Fragment key={passo.id}>
                  <PresetCard data={{ ...passo, pivo_id: pivo?.id }} variant="readonly" stepNumber={index + 1} />
                  {index < cronogramaAtivo.passos.length - 1 && <Separator orientation="vertical" decorative className="h-4 w-3 bg-secundaria-azul ml-8" />}
                </React.Fragment>
              ))}
            </View>
          ) : (
            <View className="bg-white border-[1px] border-[#cacaca] border-dashed rounded-[12px] p-6 items-center justify-center">
              <Text className="text-center text-subtexto font-outfit">Nenhum cronograma ativo no momento.</Text>
            </View>
          )}
        </View>
      </View>

      <Separator className="my-5 bg-[#B5B5B5]" decorative />

      {/* // * Tabela */}
      <View className="gap-y-5">
        <Text className="font-outfit-bold">Histórico</Text>
        <Table data={historicoPivoMock} columns={colunasHistorico} />
      </View>
    </Screen>
  );
}

// 2. A TELA PRINCIPAL (Controlada pela FlashList)
export default function VisualizacaoPivo() {
  const { id } = useLocalSearchParams();

  const { data: pivoData, isPending: loadingPivo, refetch: refetchPivo } = usePivo(id as string);
  const { data: telemetriaLista, refetch: refetchTelemetria } = useDashboardTelemetria();
  const { data: cronogramasLista, refetch: refetchCronogramas } = useCronogramasPivo(id as string);
  
  const { mutateAsync: controlarCronograma, isPending: isControlando } = useControleCronograma();

  const statusPivo = useMemo(() => telemetriaLista?.find((p) => p.id === id), [telemetriaLista, id]);
  const cronogramaAtivo = useMemo(() => cronogramasLista?.find(c => c.is_ativo === true), [cronogramasLista]);

  const handleRefresh = async () => {
    await Promise.all([refetchPivo(), refetchTelemetria(), refetchCronogramas()]);
  };

  const statusGeral = cronogramaAtivo?.status_final || 'aguardando';
  
  let textoBotao = "Iniciar Cronograma";
  let acaoBotao: 'iniciar' | 'pausar' | 'continuar' = 'iniciar';
  let corBotao = "bg-primaria-azul"; 

  if (statusGeral === 'executando') {
    textoBotao = "Pausar Operação";
    acaoBotao = 'pausar';
    corBotao = "bg-[#D32F2F]"; 
  } else if (statusGeral === 'interrompido') {
    textoBotao = "Continuar Operação";
    acaoBotao = 'continuar';
    corBotao = "bg-primaria-verde"; 
  }

  const handleControle = async () => {
    if (!cronogramaAtivo) return Alert.alert("Aviso", "Nenhum cronograma ativo para controlar.");
    try {
      await controlarCronograma({ id: cronogramaAtivo.id, acao: acaoBotao });
    } catch (e) {
      Alert.alert("Erro", "Falha ao enviar comando para o Pivô.");
    }
  };

  if (loadingPivo) return <View className="flex-1 bg-bg items-center justify-center"><ActivityIndicator size="large" color="#00A0A6" /></View>;

  return (
    <View className="flex-1 bg-bg">
      <FlashList
        ListHeaderComponent={<TopoDaTela pivo={pivoData?.dados} status={statusPivo} cronogramas={cronogramasLista ?? []} onRefresh={handleRefresh} />}
        data={[]}
        renderItem={() => null}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* --- BOTÃO INICIAR --- */}
      <View className="px-5 pb-6 bg-bg">
        <Pressable 
          disabled={!cronogramaAtivo || isControlando}
          onPress={handleControle}
          className={`${!cronogramaAtivo ? 'bg-[#cacaca]' : corBotao} rounded-pluvia py-2 items-center justify-center active:opacity-80 shadow-sm mb-6 mx-5`}
        >
          {isControlando ? <ActivityIndicator color="white" /> : (
            <Text className="text-white font-outfit-bold text-2xl">{!cronogramaAtivo ? "Sem Cronograma" : textoBotao}</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}