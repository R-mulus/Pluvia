/**
 * ✅ [PORTABILIDADE WEB CONCLUÍDA - TELA PIVÔ (COM FIX DO BOTÃO DE HISTÓRICO)]
 * * MODIFICAÇÕES REALIZADAS:
 * 1. FIX DE SOBREPOSIÇÃO (Botão Histórico): Removida a classe 'flex-1' do container que envolvia o título "Histórico" e o botão "Ver Tabela Completa". Na Web, o 'flex-1' em um container sem altura fixa faz o elemento colapsar, fazendo a tabela renderizar por cima do botão.
 * 2. FIX DE FUSO HORÁRIO: Função `formatarDataSemFuso` adicionada para blindar o Javascript e impedir que a engine aplique fusos horários duplos ao ler timestamps puros do Supabase.
 */

import React, { useMemo, useState } from "react";
import {
  View,
  Pressable,
  ActivityIndicator,
  Alert,
  Platform,
  useWindowDimensions,
  DimensionValue,
} from "react-native";
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
import {
  useCronogramasPivo,
  useControleCronograma,
} from "@/hooks/api/useCronogramas";
import { useLogsEventos } from "@/hooks/api/useLogs";

// * Mapeamento das colunas ajustadas para Auditoria de Software (Logs)
const colunasHistorico: TableColumn<any>[] = [
  { key: "id", title: "ID", width: 80 },
  { key: "data", title: "Data", width: 110 },
  { key: "hora", title: "Hora", width: 80 },
  { key: "evento", title: "Evento", width: 250 },
  { key: "operador", title: "Operador", width: 200 },
];

const calcularTempoRestante = (
  pivo: any,
  passoAtual: any,
  anguloAtual: number,
) => {
  if (!pivo?.vazao || !pivo?.raio || !passoAtual) return "-- h -- min";
  if (passoAtual.status_passo !== "executando") return "-- h -- min";

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

// 👉 Função blindada para ler timestamp sem fuso horário da base de dados
const formatarDataSemFuso = (dataString: string) => {
  if (!dataString) return { data: "--/--/----", hora: "--:--", completa: "" };
  
  // Remove o Z ou o offset para evitar que a engine web/mobile trate como UTC e aplique o fuso local
  const dataLimpa = dataString.split('+')[0].replace('Z', '');
  const [dataPart, horaPart] = dataLimpa.split('T');
  
  if (!dataPart || !horaPart) return { data: dataString, hora: "", completa: dataString };
  
  const [ano, mes, dia] = dataPart.split('-');
  const [hora, minuto] = horaPart.split(':');
  
  return {
    data: `${dia}/${mes}/${ano}`,
    hora: `${hora}:${minuto}`,
    completa: `${dia}/${mes}/${ano} às ${hora}:${minuto}`
  };
};

// 1. COMPONENTE DO CABEÇALHO DA LISTA (Tudo acima da tabela)
function TopoDaTela({
  pivo,
  status,
  cronogramas,
  logs,
  onRefresh,
}: {
  pivo: any;
  status: any;
  cronogramas: any[];
  logs: any[];
  onRefresh: () => Promise<void>;
}) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [ultimaAtualizacaoApp, setUltimaAtualizacaoApp] = useState<Date>(
    new Date(),
  );

  // [WEB FIX] Leitura de tela para o Grid dos Passos
  const { width } = useWindowDimensions();
  const getColunas = () => {
    if (width >= 1650) return 4; 
    if (width >= 1250) return 3; 
    if (width >= 870) return 2; 
    return 1;                   
  };
  const numColunas = getColunas();
  const isGridAtivo = numColunas > 1;

  const handlePress = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setUltimaAtualizacaoApp(new Date());
    setIsRefreshing(false);
  };

  const isRodando =
    status?.status_operacional === "Irrigando" ||
    status?.status_operacional === "Movimentando";
  const isFalha = status?.status_operacional === "Falha";

  const cronogramaAtivo = useMemo(
    () => cronogramas?.find((c) => c.is_ativo === true),
    [cronogramas],
  );
  const passoEmExecucao = useMemo(
    () =>
      cronogramaAtivo?.passos.find((p: any) => p.status_passo === "executando"),
    [cronogramaAtivo],
  );

  const anguloAtual =
    passoEmExecucao?.angulo_final || status?.angulo_atual || 0;
  const tempoRestanteFormatado = calcularTempoRestante(
    pivo,
    passoEmExecucao,
    anguloAtual,
  );

  const logsFormatados = useMemo(() => {
    if (!logs) return [];
    return logs.map((log: any) => {
      // Usa nossa função utilitária para garantir que os logs não sofram saltos de fuso
      const { data, hora } = formatarDataSemFuso(log.timestamp);

      let eventoTexto = log.tipo_evento;
      if (log.tipo_evento === "comando") eventoTexto = "Comando Manual";
      else if (log.tipo_evento === "pausa_manual") eventoTexto = "Pausa Manual";
      else if (log.tipo_evento === "pausa_automatica")
        eventoTexto = "Parada Automática";
      else if (log.tipo_evento === "erro" || log.tipo_evento === "alerta")
        eventoTexto = "Anomalia no Sistema";
      else if (log.tipo_evento === "conclusao")
        eventoTexto = "Operação Concluída";
      else if (log.tipo_evento === "sensor") eventoTexto = "Leitura de Sensor";

      if (log.codigo) {
        const codigoAmigavel = log.codigo.replace(/_/g, " ");
        eventoTexto = `${eventoTexto} (${codigoAmigavel})`;
      }

      const nomeOperador = Array.isArray(log.usuarios)
        ? log.usuarios[0]?.nome
        : log.usuarios?.nome;

      return {
        id: log.id.substring(0, 5).toUpperCase(),
        data: data,
        hora: hora,
        evento: eventoTexto,
        operador: nomeOperador || "Sistema Autônomo",
      };
    });
  }, [logs]);

  // Limita a tabela para apenas 10 itens na visualização do painel principal
  const logsPreview = useMemo(
    () => logsFormatados.slice(0, 10),
    [logsFormatados],
  );

  return (
    <Screen>
      {/* // * Cabeçalho */}
      <View className="self-stretch flex-row mb-4">
        <View className="flex-1 flex-row justify-between items-center">
          <View className="flex-row gap-2 items-center">
            <Header
              title={pivo?.nome_pivo || "Carregando..."}
              subtitle={pivo?.codigo_serie || "---"}
            />
            <Wifi
              size={24}
              color={isFalha ? "#D32F2F" : "#0D0D0D"}
              strokeWidth={2.5}
            />
          </View>

          {/* Última atualização */}
          <View className="flex-row items-center justify-center gap-3">
            <View className="items-end">
              <Text className="text-[10px] text-subtexto font-outfit">
                Última Atualização:
              </Text>
              <Text className="text-xs text-texto font-outfit-bold">
                {ultimaAtualizacaoApp.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>

            <Pressable
              onPress={handlePress}
              disabled={isRefreshing}
              className={`active:opacity-50 bg-primaria-azul rounded-[12px] w-[40px] h-[40px] items-center justify-center ${isRefreshing ? "opacity-50" : ""} cursor-pointer hover:opacity-80 transition-opacity`}
            >
              {isRefreshing ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <RotateCw size={20} color="white" strokeWidth={2.5} />
              )}
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

      {/* --- LINHA DE STATUS --- */}
      <View
        className={`flex-row items-center px-2 ${Platform.OS === "web" ? "justify-center gap-x-8" : "justify-between"}`}
      >
        <View className="flex-row items-center gap-2">
          <View
            className={`w-4 h-4 rounded-full ${isRodando ? "bg-[#0AA146]" : isFalha ? "bg-[#D32F2F]" : "bg-[#666666]"}`}
          />
          <Text className="font-outfit-medium text-texto text-sm">
            {status?.status_operacional || "Parado"}
          </Text>
        </View>
        <View className="w-px h-6 bg-borda" />
        <View className="flex-row items-center gap-4">
          <View className="flex-row items-center gap-1.5">
            <RefreshCw size={18} color="#0D0D0D" strokeWidth={2.5} />
            <Text className="font-outfit-medium text-texto text-sm">
              {passoEmExecucao?.direcao === "HORARIO"
                ? "Horário"
                : passoEmExecucao?.direcao === "ANTI_HORARIO"
                  ? "Anti-Hor."
                  : "---"}
            </Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <Droplet
              size={18}
              color={passoEmExecucao?.irrigacao ? "#00A0A6" : "#0D0D0D"}
              strokeWidth={2.5}
            />
            <Text className="font-outfit-medium text-texto text-sm">
              {passoEmExecucao?.irrigacao ? "Irrigando" : "Seco"}
            </Text>
          </View>
        </View>
      </View>

      <Separator className="my-5 bg-[#B5B5B5]" decorative />

      {/* --- GRID DE MÉTRICAS --- */}
      <View
        className={`flex-row flex-wrap gap-y-4 justify-between md:self-center md:w-full md:max-w-[520px]`}
      >
        <View className={`w-[48%] md:w-[45%] flex-row items-center gap-2`}>
          <Gauge size={20} color="#0D0D0D" strokeWidth={2.5} />
          <Text className="font-outfit text-texto text-sm">
            Lâmina:{" "}
            <Text className="font-outfit-bold">
              {passoEmExecucao?.lamina || 0} mm
            </Text>
          </Text>
        </View>
        <View className={`w-[48%] md:w-[45%] flex-row items-center gap-2`}>
          <RefreshCcwDot size={20} color="#0D0D0D" strokeWidth={2.5} />
          <Text className="font-outfit text-texto text-sm">
            Posição Atual:{" "}
            <Text className="font-outfit-bold">{anguloAtual}°</Text>
          </Text>
        </View>
        <View className={`w-[48%] md:w-[45%] flex-row items-center gap-2`}>
          <Zap size={20} color="#0D0D0D" strokeWidth={2.5} />
          <Text className="font-outfit text-texto text-sm">
            Tensão:{" "}
            <Text className="font-outfit-bold">{status?.tensao || 0} V</Text>
          </Text>
        </View>
        <View className={`w-[48%] md:w-[45%] flex-row items-center gap-2`}>
          <UndoDot size={20} color="#0D0D0D" strokeWidth={2.5} />
          <Text className="font-outfit text-texto text-sm">
            PSI:{" "}
            <Text className="font-outfit-bold">{status?.pressao || 0}</Text>
          </Text>
        </View>
      </View>

      <Separator className="my-5 bg-[#B5B5B5]" decorative />

      {/* --- RESUMO DE VOLTAS E DURAÇÃO --- */}
      <View
        className={`px-2 gap-3 md:self-center md:w-full md:max-w-[520px] md:flex-row md:justify-between`}
      >
        <View
          className={`flex-row items-center justify-between md:justify-start md:gap-4 md:w-[48%]`}
        >
          <View className="flex-row items-center gap-2">
            <RotateCw size={20} color="#0D0D0D" strokeWidth={2.5} />
            <Text className="font-outfit text-texto text-sm">Voltas:</Text>
          </View>
          <Text className="font-outfit-bold text-texto text-sm whitespace-nowrap">
            -
          </Text>
        </View>
        <View className={`flex-row justify-between items-center md:w-[48%]`}>
          <View className="flex-row items-center gap-2">
            <Clock size={20} color="#0D0D0D" strokeWidth={2.5} />
            <Text className="font-outfit text-texto text-sm">
              Tempo Restante Estimado:
            </Text>
          </View>
          <Text className="font-outfit-bold text-texto text-sm whitespace-nowrap">
            {tempoRestanteFormatado}
          </Text>
        </View>
      </View>

      <Separator className="my-5 bg-[#B5B5B5]" decorative />

      {/* --- GRID DE MÉTRICAS DE SINAL --- */}
      <View
        className={`flex-row flex-wrap px-2 gap-y-4 justify-between md:self-center md:w-full md:max-w-[520px]`}
      >
        <View className={`w-[48%] md:w-[45%] flex-row items-center gap-2`}>
          <Router size={20} color="#0D0D0D" strokeWidth={2.5} />
          <Text className="font-outfit text-texto text-sm">
            Latência{"\n"} de Sinal:
          </Text>
          <Text className="font-outfit-bold">-</Text>
        </View>
        <View className={`w-[48%] md:w-[45%] flex-row items-center gap-2`}>
          <CloudSync size={20} color="#0D0D0D" strokeWidth={2.5} />
          <Text className="font-outfit text-texto text-sm">
            Uptime{"\n"} do Sistema:
          </Text>
          <Text className="font-outfit-bold">-</Text>
        </View>
        <View className={`w-[48%] md:w-[45%] flex-row items-center gap-2`}>
          <Signal size={20} color="#0D0D0D" strokeWidth={2.5} />
          <Text className="font-outfit text-texto text-sm">
            Ping: <Text className="font-outfit-bold">500 ms</Text>
          </Text>
        </View>
        <View className={`w-[48%] md:w-[45%] flex-row items-center gap-2`}>
          <Files size={20} color="#0D0D0D" strokeWidth={2.5} />
          <Text className="font-outfit text-texto text-sm">
            Versão: <Text className="font-outfit-bold">v1.4.2</Text>
          </Text>
        </View>
      </View>

      <Separator className="my-5 bg-[#B5B5B5]" decorative />

      {/* ======================================================= */}
      {/* --- CRONOGRAMA ATIVO --- */}
      {/* ======================================================= */}
      <View className="gap-y-5">
        <View className="flex-row justify-between items-center">
          <Text className="font-outfit-bold text-lg">Cronograma Ativo</Text>
          <View className="flex-row gap-2">
            <Pressable
              className="active:opacity-50 bg-primaria-azul rounded-[12px] w-[40px] h-[40px] items-center justify-center self-end cursor-pointer hover:opacity-80 transition-opacity"
              onPress={() =>
                router.push({
                  pathname: "/(tabs)/operacao/cronogramas",
                  params: { id: pivo?.id },
                })
              }
            >
              <Layers size={24} color="white" strokeWidth={2.5} />
            </Pressable>
            <Button
              className="rounded-pluvia rounded rounded-br-none rounded-tl-none bg-secundaria-azul h-[40px] w-auto cursor-pointer hover:opacity-80 transition-opacity"
              disabled={!cronogramaAtivo}
              onPress={() =>
                cronogramaAtivo &&
                router.push({
                  pathname: "/(tabs)/operacao/editCronograma",
                  params: {
                    id: cronogramaAtivo.id,
                    pivo_id: pivo?.id,
                    origem: "pivo",
                  },
                })
              }
            >
              <SquarePen size={24} color="white" strokeWidth={2.5} />
              <Text className="font-outfit-bold text-sm">Editar</Text>
            </Button>
          </View>
        </View>

        <View className="m-0">
          {cronogramaAtivo ? (
            <View>
              <View className="mb-4">
                <Text className="font-outfit-bold text-lg">
                  {cronogramaAtivo.nome}
                </Text>
                {cronogramaAtivo.horario_inicio && (
                  <View className="flex-row items-center mt-1.5 gap-2">
                    <Clock size={16} color="#666666" />
                    <Text className="text-sm font-outfit-medium">
                      Início agendado:{" "}
                      {formatarDataSemFuso(cronogramaAtivo.horario_inicio).completa}
                    </Text>
                  </View>
                )}
              </View>

              {/* Container da Grade de Passos Ativos */}
              <View className={`w-full ${isGridAtivo ? 'flex-row flex-wrap -mx-2' : ''}`}>
                {cronogramaAtivo.passos
                  .sort((a: any, b: any) => a.ordem - b.ordem)
                  .map((passo: any, index: number) => {
                    const isLast = index === cronogramaAtivo.passos.length - 1;

                    return (
                      <View 
                        key={passo.id}
                        style={{
                          width: (isGridAtivo
                            ? `${100 / numColunas}%`
                            : '100%') as DimensionValue,
                        }}
                        className={`${isGridAtivo ? 'px-2 mb-4' : ''}`}
                      >
                        <View className="relative w-full z-10">
                          <PresetCard
                            data={{ ...passo, pivo_id: pivo?.id }}
                            variant="readonly"
                            stepNumber={index + 1}
                          />
                          
                          {/* Linha Horizontal Conectora */}
                          {isGridAtivo && !isLast && (
                            <View className="absolute top-1/2 -right-4 -translate-y-1/2 w-4 h-[6px] bg-secundaria-azul z-0 rounded-r-md" />
                          )}
                        </View>

                        {/* Linha Vertical Conectora */}
                        {!isGridAtivo && !isLast && (
                          <Separator
                            orientation="vertical"
                            decorative
                            className="h-4 w-3 bg-secundaria-azul ml-8"
                          />
                        )}
                      </View>
                    );
                  })}
              </View>
            </View>
          ) : (
            <View className="bg-white border-[1px] border-[#cacaca] border-dashed rounded-[12px] p-6 items-center justify-center">
              <Text className="text-center text-subtexto font-outfit">
                Nenhum cronograma ativo no momento.
              </Text>
            </View>
          )}
        </View>
      </View>

      <Separator className="my-5 bg-[#B5B5B5]" decorative />

      {/* // * Tabela - Limite de 10 */}
      <View className="gap-y-5">
        <View className="w-full flex-col mb-2">
          <Text className="font-outfit-bold self-start mb-3 text-lg">
            Histórico
          </Text>
          <Button
            className="rounded-md w-full bg-secundaria-azul h-[40px] px-3 active:opacity-70 cursor-pointer hover:opacity-80 transition-opacity"
            onPress={() =>
              router.push({
                pathname: "/(tabs)/pivos/logsPivo", 
                params: { pivo_id: pivo?.id },
              })
            }
          >
            <Text className="text-white font-outfit-medium">
              Ver Tabela Completa
            </Text>
          </Button>
        </View>
        <Table data={logsPreview} columns={colunasHistorico} />
      </View>
    </Screen>
  );
}

// * --------------- TELA PRINCIPAL ---------------
export default function VisualizacaoPivo() {
  const { id } = useLocalSearchParams();

  const {
    data: pivoData,
    isPending: loadingPivo,
    refetch: refetchPivo,
  } = usePivo(id as string);
  const { data: telemetriaLista, refetch: refetchTelemetria } =
    useDashboardTelemetria();
  const { data: cronogramasLista, refetch: refetchCronogramas } =
    useCronogramasPivo(id as string);
  const { data: logsLista, refetch: refetchLogs } = useLogsEventos(
    id as string,
  );

  const { mutateAsync: controlarCronograma, isPending: isControlando } =
    useControleCronograma();

  const statusPivo = useMemo(
    () => telemetriaLista?.find((p) => p.id === id),
    [telemetriaLista, id],
  );
  const cronogramaAtivo = useMemo(
    () => cronogramasLista?.find((c) => c.is_ativo === true),
    [cronogramasLista],
  );

  const handleRefresh = async () => {
    await Promise.all([
      refetchPivo(),
      refetchTelemetria(),
      refetchCronogramas(),
      refetchLogs(),
    ]);
  };

  const statusGeral = cronogramaAtivo?.status_final || "aguardando";

  let textoBotao = "Iniciar Cronograma";
  let acaoBotao: "iniciar" | "pausar" | "continuar" = "iniciar";
  let corBotao = "bg-primaria-azul";

  if (statusGeral === "executando") {
    textoBotao = "Pausar Operação";
    acaoBotao = "pausar";
    corBotao = "bg-[#D32F2F]";
  } else if (statusGeral === "interrompido") {
    textoBotao = "Continuar Operação";
    acaoBotao = "continuar";
    corBotao = "bg-primaria-verde";
  }

  const handleControle = async () => {
    if (!cronogramaAtivo)
      return Alert.alert("Aviso", "Nenhum cronograma ativo para controlar.");
    try {
      await controlarCronograma({ id: cronogramaAtivo.id, acao: acaoBotao });
    } catch (e) {
      Alert.alert("Erro", "Falha ao enviar comando para o Pivô.");
    }
  };

  if (loadingPivo)
    return (
      <View className="flex-1 bg-bg items-center justify-center">
        <ActivityIndicator size="large" color="#00A0A6" />
      </View>
    );

  return (
    <View className="flex-1">
      <FlashList
        ListHeaderComponent={
          <TopoDaTela
            pivo={pivoData?.dados}
            status={statusPivo}
            cronogramas={cronogramasLista ?? []}
            logs={logsLista ?? []}
            onRefresh={handleRefresh}
          />
        }
        data={[]}
        renderItem={() => null}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* // * BOTÃO INICIAR */}
      <View className="px-3 py-1">
        <Pressable
          disabled={!cronogramaAtivo || isControlando}
          onPress={handleControle}
          className={`${!cronogramaAtivo ? "bg-[#cacaca]" : corBotao} rounded-pluvia py-2 items-center justify-center active:opacity-80 shadow-sm mb-6 mx-5 cursor-pointer hover:opacity-90 transition-opacity`}
        >
          {isControlando ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-outfit-bold text-xl">
              {!cronogramaAtivo ? "Sem Cronograma" : textoBotao}
            </Text>
          )}
        </Pressable>

        {/* <Pressable
          disabled={!cronogramaAtivo || isControlando}
          onPress={async () => {
            if (cronogramaAtivo)
              try {
                await controlarCronograma({
                  id: cronogramaAtivo.id,
                  acao: "iniciar",
                });
                Alert.alert(
                  "Partida Imediata",
                  "A maquete vai ligar em instantes.",
                );
              } catch (e) {
                Alert.alert("Erro", "Falha ao forçar a partida.");
              }
          }}
          className={`${!cronogramaAtivo ? "bg-[#cacaca]" : "bg-[#F59E0B]"} rounded-pluvia py-2 items-center justify-center active:opacity-80 shadow-sm mb-4 mx-5 cursor-pointer hover:opacity-90 transition-opacity`}
        >
          {isControlando ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-outfit-bold text-xl">
              Rodar Agora (se Deus permitir)
            </Text>
          )}
        </Pressable> */}
      </View>
    </View>
  );
}