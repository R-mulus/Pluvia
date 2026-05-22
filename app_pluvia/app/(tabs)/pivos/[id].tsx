import React, { useMemo } from "react";
import { View, Pressable, ActivityIndicator } from "react-native";
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
import RadarComplexo from "@/components/custom/RadarComplexo";
import { useRouter, useLocalSearchParams } from "expo-router";
import Header from "@/components/custom/Header";
import { Separator } from "@/components/ui/separator";
import PresetCard from "@/components/custom/PresetCard";
import { Screen } from "@/components/custom/Screen";
import { Table, TableColumn } from "@/components/custom/Table";

// Importando Hooks da API
import { usePivo } from "@/hooks/api/usePivos";
import { useDashboardTelemetria } from "@/hooks/api/useTelemetria";
import { useCronogramasPivo } from "@/hooks/api/useCronogramas";

// * MOCK DA TABELA (Sem Voltas e Percentímetro)
export const historicoPivoMock = [
  {
    id: "01",
    data: "19/03/2026",
    hora: "00:24",
    duracao: "13 h 30 min",
    percentimetro: "100%",
    irrigacao: "Sim",
    direcao: "Reverso",
    inicial: "0°",
    final: "80°",
    operador: "Bernardo Cunha",
  },
  {
    id: "02",
    data: "19/03/2026",
    hora: "13:15",
    duracao: "02 h 15 min",
    percentimetro: "45%",
    irrigacao: "Não",
    direcao: "Horário",
    inicial: "95°",
    final: "112°",
    operador: "Mateus Felisberto Xavier Rosa",
  },
  {
    id: "03",
    data: "19/03/2026",
    hora: "14:30",
    duracao: "08 h 00 min",
    percentimetro: "32%",
    irrigacao: "Sim",
    direcao: "Horário",
    inicial: "120°",
    final: "180°",
    operador: "João Ninguém",
  },
  {
    id: "04",
    data: "20/03/2026",
    hora: "03:00",
    duracao: "10 h 45 min",
    percentimetro: "67%",
    irrigacao: "Sim",
    direcao: "Reverso",
    inicial: "10°",
    final: "100°",
    operador: "Zé",
  },
];

const colunasHistorico: TableColumn<(typeof historicoPivoMock)[0]>[] = [
  { key: "id", title: "ID", width: 60 },
  { key: "data", title: "Data", width: 110 },
  { key: "hora", title: "Hora", width: 80 },
  { key: "duracao", title: "Duração", width: 110 },
  { key: "percentimetro", title: "Percentímetro", width: 110 },
  { key: "irrigacao", title: "Irrigação", width: 90 },
  { key: "direcao", title: "Direção", width: 100 },
  { key: "inicial", title: "Inicial", width: 80 },
  { key: "final", title: "Final", width: 80 },
  { key: "operador", title: "Operador", width: 200 },
];

// 1. COMPONENTE DO CABEÇALHO DA LISTA
function TopoDaTela({ pivo, status, cronogramas, onRefresh }: { pivo: any; status: any; cronogramas: any[]; onRefresh: () => Promise<void> }) {
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handlePress = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setIsRefreshing(false);
  };

  const router = useRouter();

  const anguloAtual = status?.angulo_atual || 0;
  const dataFormatada = status?.ultima_atualizacao
    ? new Date(status.ultima_atualizacao).toLocaleString("pt-BR")
    : "Aguardando rede...";

  const isRodando =
    status?.status_operacional === "Irrigando" ||
    status?.status_operacional === "Movimentando";
  const isFalha = status?.status_operacional === "Falha";

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

          <View className="flex-row items-center justify-center gap-3">
            <View className="items-end">
              <Text className="text-[10px] text-subtexto font-outfit">
                Última Atualização:
              </Text>
              <Text className="text-xs text-texto font-outfit-bold">
                {dataFormatada}
              </Text>
            </View>
            <Pressable
              onPress={handlePress}
              disabled={isRefreshing}
              className={`active:opacity-50 bg-primaria-azul rounded-[12px] w-[40px] h-[40px] items-center justify-center ${isRefreshing ? "opacity-50" : ""}`}
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

      {/* --- TAG DE ALERTA DINÂMICA --- */}
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
      <View className="flex-row items-center justify-between px-2">
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
              {status?.direcao_atual === "HORARIO"
                ? "Horário"
                : status?.direcao_atual === "ANTI_HORARIO"
                  ? "Anti-Hor."
                  : "---"}
            </Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <Droplet
              size={18}
              color={status?.water_on ? "#00A0A6" : "#0D0D0D"}
              strokeWidth={2.5}
            />
            <Text className="font-outfit-medium text-texto text-sm">
              {status?.water_on ? "Irrigando" : "Seco"}
            </Text>
          </View>
        </View>
      </View>

      <Separator className="my-5 bg-[#B5B5B5]" decorative />

      {/* --- GRID DE MÉTRICAS (Sem Percentímetro, com Lâmina) --- */}
      <View className="flex-row flex-wrap self-stretch justify-between gap-y-4">
        <View className="w-[48%] flex-row items-center gap-2">
          <Gauge size={20} color="#0D0D0D" strokeWidth={2.5} />
          <Text className="font-outfit text-texto text-sm">
            Lâmina:{" "}
            <Text className="font-outfit-bold">{status?.lamina || 0} mm</Text>
          </Text>
        </View>
        <View className="w-[48%] flex-row items-center gap-2">
          <RefreshCcwDot size={20} color="#0D0D0D" strokeWidth={2.5} />
          <Text className="font-outfit text-texto text-sm">
            Posição Atual:{" "}
            <Text className="font-outfit-bold">{anguloAtual}°</Text>
          </Text>
        </View>
        <View className="w-[48%] flex-row items-center gap-2">
          <Zap size={20} color="#0D0D0D" strokeWidth={2.5} />
          <Text className="font-outfit text-texto text-sm">
            Tensão:{" "}
            <Text className="font-outfit-bold">{status?.tensao || 0} V</Text>
          </Text>
        </View>
        <View className="w-[48%] flex-row items-center gap-2">
          <UndoDot size={20} color="#0D0D0D" strokeWidth={2.5} />
          <Text className="font-outfit text-texto text-sm">
            PSI:{" "}
            <Text className="font-outfit-bold">{status?.pressao || 0}</Text>
          </Text>
        </View>
      </View>

      <Separator className="my-5 bg-[#B5B5B5]" decorative />

      {/* --- RESUMO DE DURAÇÃO (Sem Voltas) --- */}
      <View className="px-2">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-2">
            <Clock size={20} color="#0D0D0D" strokeWidth={2.5} />
            <Text className="font-outfit text-texto text-sm">
              Tempo Restante Estimado:
            </Text>
          </View>
          {/* Valor provisório até implementarmos o cálculo de duração no backend */}
          <Text className="font-outfit-bold text-texto text-sm">
            -- h -- min
          </Text>
        </View>
      </View>

      <Separator className="my-5 bg-[#B5B5B5]" decorative />

      {/* --- GRID DE MÉTRICAS DE SINAL (Mocks mantidos provisoriamente) --- */}
      <View className="flex-row flex-wrap justify-between px-2 gap-y-4">
        <View className="w-[48%] flex-row items-center gap-2">
          <Router size={20} color="#0D0D0D" strokeWidth={2.5} />
          <Text className="font-outfit text-texto text-sm">
            Latência{"\n"} de Sinal:
          </Text>
          <Text className="font-outfit-bold">-60 dBm</Text>
        </View>
        <View className="w-[48%] flex-row items-center gap-2">
          <CloudSync size={20} color="#0D0D0D" strokeWidth={2.5} />
          <Text className="font-outfit text-texto text-sm">
            Uptime{"\n"} do Sistema:{" "}
          </Text>
          <Text className="font-outfit-bold">98%</Text>
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
          <Text className="font-outfit-bold">Cronograma</Text>
          <View className="flex-row gap-2">
            <Pressable
              className="active:opacity-50 bg-primaria-azul rounded-[12px] w-[40px] h-[40px] items-center justify-center self-end"
              onPress={() => router.push(`/presets/${pivo?.id}`)}
            >
              <Layers size={24} color="white" strokeWidth={2.5} />
            </Pressable>
            <Button className="rounded-pluvia rounded rounded-br-none rounded-tl-none bg-secundaria-azul h-[40px] w-auto">
              <SquarePen size={24} color="white" strokeWidth={2.5} />
              <Text className="font-outfit-bold text-sm">Editar</Text>
            </Button>
          </View>
        </View>

        {/* LÓGICA DINÂMICA: Renderiza no máximo os próximos 3 agendamentos, ou exibe mensagem de vazio */}
        <View className="m-0">
          {cronogramas && cronogramas.length > 0 ? (
            cronogramas.slice(0, 3).map((agendamento, index) => (
              <React.Fragment key={agendamento.id}>
                <PresetCard data={agendamento} />
                
                {/* O Separador azul só aparece ENTRE os cards, nunca depois do último */}
                {index < Math.min(cronogramas.length, 3) - 1 && (
                  <Separator orientation="vertical" decorative className="h-4 w-3 bg-secundaria-azul ml-8" />
                )}
              </React.Fragment>
            ))
          ) : (
            <Text className="text-center text-subtexto mt-2 mb-4 font-outfit">
              Nenhum agendamento programado para este pivô.
            </Text>
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

// 2. A TELA PRINCIPAL
export default function VisualizacaoPivo() {
  const { id } = useLocalSearchParams();

  const { data: pivoData, isPending: loadingPivo, refetch: refetchPivo } = usePivo(id as string);
  const { data: telemetriaLista, refetch: refetchTelemetria } = useDashboardTelemetria();
  
  // 1. Buscamos os cronogramas deste pivô
  const { data: cronogramasLista, refetch: refetchCronogramas } = useCronogramasPivo(id as string);

  const statusPivo = useMemo(() => {
    return telemetriaLista?.find((p) => p.id === id);
  }, [telemetriaLista, id]);

  // 2. Atualizamos o refresh para recarregar também a fila de agendamentos
  const handleRefresh = async () => {
    await Promise.all([refetchPivo(), refetchTelemetria(), refetchCronogramas()]);
  };

  if (loadingPivo) {
    return (
      <View className="flex-1 bg-bg items-center justify-center">
        <ActivityIndicator size="large" color="#00A0A6" />
        <Text className="mt-4 font-outfit">Conectando ao Pivô...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-bg">
      <FlashList
        // 3. Passamos a lista de cronogramas como Prop para o TopoDaTela
        ListHeaderComponent={<TopoDaTela pivo={pivoData?.dados} status={statusPivo} cronogramas={cronogramasLista ?? []} onRefresh={handleRefresh} />}
        data={[]}
        renderItem={() => null}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* --- BOTÃO INICIAR --- */}
      <Pressable className="bg-primaria-azul rounded-pluvia py-2 items-center justify-center active:opacity-80 shadow-sm mb-6 mx-5">
        <Text className="text-white font-outfit-bold text-2xl">
          {statusPivo?.status_operacional === "Parado" ? "Iniciar" : "Parar"}
        </Text>
      </Pressable>
    </View>
  );
}
