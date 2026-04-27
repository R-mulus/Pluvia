import React from "react";
import { View, Pressable } from "react-native";
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
import { useRouter } from "expo-router";
import Header from "@/components/custom/Header";
import { Separator } from "@/components/ui/separator";
import PresetCard from "@/components/custom/PresetCard";
import { Screen } from "@/components/custom/Screen";
import { Table, TableColumn } from "@/components/custom/Table";

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
    operador: "Mateus Felisberto Xavier Rosa", // O componente vai truncar isso perfeitamente!
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
  { key: "operador", title: "Operador", width: 140 },
];

// 1. COMPONENTE DO CABEÇALHO DA LISTA (Tudo acima da tabela)
function TopoDaTela() {

  const router = useRouter()

  return (
    <Screen className="pb-4">
      {/* // * Cabeçalho */}
      <View className="self-stretch flex-row mb-4">
        <View className="flex-1 flex-row justify-between items-center">
          <View className="flex-row gap-2 items-center">
            <Header title="Pivô 01" subtitle="AXCP2134HIM" />
            <Wifi size={24} color="#0D0D0D" strokeWidth={2.5} />
          </View>

          {/* Última atualização */}
          <View className="flex-row items-center justify-center gap-3">
            <View className="items-end">
              <Text className="text-[10px] text-subtexto font-outfit">
                Última Atualização:
              </Text>
              <Text className="text-xs text-texto font-outfit-bold">
                19/03/2026 16:19
              </Text>
            </View>

            <Pressable className="active:opacity-50 bg-primaria-azul rounded-[12px] w-[40px] h-[40px] items-center justify-center">
              <RotateCw size={20} color="white" strokeWidth={2.5} />
            </Pressable>
          </View>
        </View>
      </View>

      {/* --- TAG DE ALERTA --- */}
      <View className="bg-[#D32F2F] rounded-pluvia flex-row items-center px-4 py-2 mb-6 shadow-sm">
        <TriangleAlert size={20} color="white" strokeWidth={2.5} />
        <Text className="text-white font-outfit-bold ml-2 text-sm">
          Pressão Acima de 50 PSI
        </Text>
      </View>

      {/* --- RADAR CENTRAL --- */}
      <View className="items-center justify-center mb-8">
        <RadarComplexo size={260} currentAngle={120} />
      </View>

      {/* --- LINHA DE STATUS (Em Funcionamento / Horário / Irrigando) --- */}
      <View className="flex-row items-center justify-between px-2">
        {/* Status */}
        <View className="flex-row items-center gap-2">
          <View className="w-4 h-4 rounded-full bg-[#0AA146]" />
          <Text className="font-outfit-medium text-texto text-sm">
            Em Funcionamento
          </Text>
        </View>

        {/* Divisor Vertical */}
        <View className="w-px h-6 bg-borda" />

        {/* Informações da direita */}
        <View className="flex-row items-center gap-4">
          <View className="flex-row items-center gap-1.5">
            <RefreshCw size={18} color="#0D0D0D" strokeWidth={2.5} />
            <Text className="font-outfit-medium text-texto text-sm">
              Horário
            </Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <Droplet size={18} color="#0D0D0D" strokeWidth={2.5} />
            <Text className="font-outfit-medium text-texto text-sm">
              Irrigando
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
            Percentímetro: <Text className="font-outfit-bold">100%</Text>
          </Text>
        </View>
        <View className="w-[48%] flex-row items-center gap-2">
          <RefreshCcwDot size={20} color="#0D0D0D" strokeWidth={2.5} />
          <Text className="font-outfit text-texto text-sm">
            Posição Atual: <Text className="font-outfit-bold">195°</Text>
          </Text>
        </View>
        <View className="w-[48%] flex-row items-center gap-2">
          <Zap size={20} color="#0D0D0D" strokeWidth={2.5} />
          <Text className="font-outfit text-texto text-sm">
            Tensão: <Text className="font-outfit-bold">384 V</Text>
          </Text>
        </View>
        <View className="w-[48%] flex-row items-center gap-2">
          <UndoDot size={20} color="#0D0D0D" strokeWidth={2.5} />
          <Text className="font-outfit text-texto text-sm">
            PSI: <Text className="font-outfit-bold">24 (mV)</Text>
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
            3 de 5 Voltas
          </Text>
        </View>

        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-2">
            <Clock size={20} color="#0D0D0D" strokeWidth={2.5} />
            <Text className="font-outfit text-texto text-sm">Duração:</Text>
          </View>
          <Text className="font-outfit-bold text-texto text-sm">
            3 h 30 min
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
            <Pressable className="active:opacity-50 bg-primaria-azul rounded-[12] w-[40] h-[40] items-center justify-center self-end" onPress={() => router.push(`/presets/[id]`)}>
              <Layers size={24} color="white" strokeWidth={2.5} />
            </Pressable>
            <Button className="rounded-pluvia rounded rounded-br-none rounded-tl-none bg-secundaria-azul h-[40] w-auto">
              <SquarePen size={24} color="white" strokeWidth={2.5} />
              <Text className="font-outfit-bold text-sm">Editar</Text>
            </Button>
          </View>
        </View>

        <View className="m-0">
          <PresetCard />
          <Separator
            orientation="vertical"
            decorative
            className="h-4 w-3 bg-secundaria-azul ml-8"
          />
          <PresetCard />
          <Separator
            orientation="vertical"
            decorative
            className="h-4 w-3 bg-secundaria-azul ml-8"
          />
          <PresetCard />
        </View>
      </View>

      <Separator className="my-5 bg-[#B5B5B5]" decorative />

      {/* // * Tabela */}
      <View className="gap-y-5">
        <Text className="font-outfit-bold">Cronograma</Text>

        <Table data={historicoPivoMock} columns={colunasHistorico} />
      </View>
    </Screen>
  );
}

// 2. A TELA PRINCIPAL (Controlada pela FlashList)
export default function VisualizacaoPivo() {
  return (
    <View className="flex-1 bg-bg">
      <FlashList
        // O ListHeaderComponent carrega tudo que construímos acima
        ListHeaderComponent={TopoDaTela}
        // Data vazia por enquanto, futuramente aqui entrarão os cronogramas
        data={[]}
        renderItem={() => null}
        // Espaço no final da rolagem para a lista não colar na base do celular
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* --- BOTÃO INICIAR --- */}
      <Pressable className="bg-primaria-azul rounded-pluvia py-2 items-center justify-center active:opacity-80 shadow-sm mb-6 mx-5">
        <Text className="text-white font-outfit-bold text-2xl">Iniciar</Text>
      </Pressable>
    </View>
  );
}
