import * as React from "react";
import { useState } from "react";
import { View, Platform, Pressable, LayoutChangeEvent } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Separator } from "@/components/ui/separator";
import { useRouter, type Href } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { Screen } from "@/components/custom/Screen";
import Header from "@/components/custom/Header";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { TriggerRef } from "@rn-primitives/select";
import Svg, { Rect, Line, Text as SvgText, G } from "react-native-svg";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  Funnel,
  CloudSun,
  CircleX,
  ArrowUpNarrowWide,
  Droplet,
  GaugeCircle,
  Clock,
  Droplets,
  Zap,
  TriangleAlert,
} from "lucide-react-native";
import { BarChart, LineChart } from "react-native-gifted-charts";
import { Table, TableColumn } from "@/components/custom/Table";

// * Dados Mockados para Gráficos, Tabelas e Selects

// * SELECTS
const pivos = [
  { id: 1, label: "Todos", value: "todos" },
  { id: 2, label: "Pivô 1", value: "pivo_1" },
  { id: 3, label: "Pivô 2", value: "pivo_2" },
  { id: 4, label: "Pivô 3", value: "pivo_3" },
];

const tempo_operacao = [
  { id: 1, label: "Dia", value: "dia" },
  { id: 2, label: "Semana", value: "semana" },
  { id: 3, label: "Mês", value: "mes" },
  { id: 4, label: "6 Meses", value: "6_meses" },
];

const fazendas = [
  { id: 1, label: "Fazenda 1", value: "fazenda_1" },
  { id: 2, label: "Fazenda 2", value: "fazenda_2" },
  { id: 3, label: "Fazenda 3", value: "fazenda_3" },
];

// * TABELAS
export const logMock = [
  {
    id: "01",
    data: "2026-03-25 14:32:10",
    pivo: "01",
    status: "Ativo",
    evento: "101",
    origem: "Operador",
    operador: "João Pedro",
    voltas: "1",
    irrigacao: "Sim",
    milimetros: "2.5 mm",
    pressao: "24 PSI(mV)",
    tensao: "384 V",
    direcao: "Horário",
    anguloAtual: "120°",
    percentimetro: "100%",
  },
  {
    id: "02",
    data: "2026-03-25 14:20:23",
    pivo: "01",
    status: "Ativo",
    evento: "101",
    origem: "Operador",
    operador: "João Pedro",
    voltas: "1",
    irrigacao: "Sim",
    milimetros: "2.5 mm",
    pressao: "24 PSI(mV)",
    tensao: "384 V",
    direcao: "Horário",
    anguloAtual: "120°",
    percentimetro: "100%",
  },
  {
    id: "03",
    data: "2026-03-25 14:00:13",
    pivo: "01",
    status: "Ativo",
    evento: "101",
    origem: "Operador",
    operador: "João Pedro",
    voltas: "1",
    irrigacao: "Sim",
    milimetros: "2.5 mm",
    pressao: "24 PSI(mV)",
    tensao: "384 V",
    direcao: "Horário",
    anguloAtual: "120°",
    percentimetro: "100%",
  },
  {
    id: "04",
    data: "2026-03-25 13:45:05",
    pivo: "01",
    status: "Ativo",
    evento: "101",
    origem: "Operador",
    operador: "João Pedro",
    voltas: "1",
    irrigacao: "Sim",
    milimetros: "2.5 mm",
    pressao: "24 PSI(mV)",
    tensao: "384 V",
    direcao: "Horário",
    anguloAtual: "120°",
    percentimetro: "100%",
  },
  {
    id: "05",
    data: "2026-03-25 13:32:41",
    pivo: "01",
    status: "Ativo",
    evento: "101",
    origem: "Operador",
    operador: "João Pedro",
    voltas: "1",
    irrigacao: "Sim",
    milimetros: "2.5 mm",
    pressao: "24 PSI(mV)",
    tensao: "384 V",
    direcao: "Horário",
    anguloAtual: "120°",
    percentimetro: "100%",
  },
];

export const alertasMock = [
  {
    id: "01",
    tipo: "info",
    icone: "gota",
    evento: "Economia por Horário",
    data: "20/03/2026",
    hora: "21:00",
    pivo: '"',
    operador: '"',
  },
  {
    id: "02",
    tipo: "perigo",
    icone: "alerta",
    evento: "Pressão Acima de 50 PSI",
    data: "20/03/2026",
    hora: "00:24",
    pivo: "01",
    operador: "João Pedro",
  },
  {
    id: "03",
    tipo: "sucesso",
    icone: "alerta",
    evento: "Consumo de Energia Elevado",
    data: "19/03/2026",
    hora: "13:15",
    pivo: "01",
    operador: "Matheus X",
  },
  {
    id: "04",
    tipo: "info",
    icone: "alerta",
    evento: "Lâmina em Uso por Muito Tempo",
    data: "19/03/2026",
    hora: "14:30",
    pivo: "02",
    operador: "Bernardo W",
  },
];

// * GRÁFICOS

// Tempo de Operação (Gráfico de Barras Vertical)
export const tempoOperacaoMock = [
  { label: "01", value: 4 },
  { label: "02", value: 25 },
  { label: "03", value: 21 },
  { label: "04", value: 9 },
  { label: "05", value: 13 },
  { label: "06", value: 10 },
  { label: "07", value: 6 },
  { label: "08", value: 22 },
  { label: "09", value: 19 },
  { label: "10", value: 8 },
];

// Quantidade de Falhas por Período (Gráfico de Barras Horizontal)
export const falhasPeriodoMock = [
  { label: "Jul", value: 4 },
  { label: "Jun", value: 2 },
  { label: "Mai", value: 8 },
  { label: "Abr", value: 5 },
  { label: "Mar", value: 4 },
  { label: "Feb", value: 15 },
  { label: "Jan", value: 1 },
];

// Consumo de Água por Hora (Gráfico de Barras Vertical)
export const consumoAguaMock = [
  { label: "Seg", value: 110 },
  { label: "Ter", value: 200 },
  { label: "Qua", value: 150 },
  { label: "Qui", value: 80 },
  { label: "Sex", value: 130 },
  { label: "Sab", value: 110 },
  { label: "Dom", value: 130 },
];

// Consumo de Energia (Gráfico de Linhas com 2 Séries)
export const consumoEnergiaMock = [
  { label: "Seg", real: 190, estimado: 0 },
  { label: "Ter", real: 300, estimado: 230 },
  { label: "Qua", real: 240, estimado: 300 },
  { label: "Qui", real: 80, estimado: 260 },
  { label: "Sex", real: 210, estimado: 370 },
  { label: "Sab", real: 215, estimado: 300 },
  { label: "Dom", real: 180, estimado: 240 },
];

// * Mocks dos Gráficos Modificados para que Apareça os Valores
const valoresConsumoAgua = consumoAguaMock.map((item) => {
  return {
    ...item,
    topLabelComponent: () => (
      <View className="items-center w-[24px]">
        {/* // * Valor da barra */}
        {/* // * O top-1 empurra o número PARA DENTRO da barra azul. 
              // * Se quiser que ele fique flutuando fora/acima da barra, 
              // * troque para: "absolute bottom-1 text-texto" */}
        <Text className="absolute bottom-1 text-xs font-outfit-bold text-subtexto z-[999]">
          {item.value}
        </Text>
      </View>
    ),
  };
});

// Consumo Real de Energia (AZUL)
const consumoEnergiaReal = consumoEnergiaMock.map((item) => {
  const isMaiorOuIgual = item.real >= item.estimado;

  const positionClass =
    isMaiorOuIgual || item.real === 0 ? "bottom-[10px]" : "top-[10px]";

  return {
    value: item.real,
    label: item.label,
    customDataPoint: () => (
      <View className="items-center justify-center">
        <Text
          className={`absolute ${positionClass} text-[10px] font-outfit-bold text-primaria-azul w-10 text-center z-10`}
        >
          {item.real}
        </Text>
        <View className="w-2.5 h-2.5 rounded-full bg-white border-[2px] border-primaria-azul" />
      </View>
    ),
  };
});

// Consumo Estimado de Energia (VERDE)
const consumoEnergiaEstimado = consumoEnergiaMock.map((item) => {
  const isMaior = item.estimado > item.real;

  const positionClass =
    isMaior || item.estimado === 0 ? "bottom-[10px]" : "top-[10px]";

  return {
    value: item.estimado,
    customDataPoint: () => (
      <View className="items-center justify-center">
        <Text
          className={`absolute ${positionClass} text-[10px] font-outfit-bold text-primaria-verde w-10 text-center z-10`}
        >
          {item.estimado}
        </Text>
        <View className="w-2.5 h-2.5 rounded-full bg-white border-[2px] border-primaria-verde" />
      </View>
    ),
  };
});

export default function Analises() {
  // * --- Código para o Funcionamento do Gráfico Horizontal em SVG ---
  const [containerWidth, setContainerWidth] = useState(0);

  // --- ESCALA DINÂMICA (A MÁGICA DOS VALORES MAIORES QUE 8) ---
  const maxDataValue = Math.max(...falhasPeriodoMock.map((item) => item.value));

  // Encontra o teto múltiplo de 4 mais próximo, garantindo um mínimo de 8
  const maxValue = Math.max(8, Math.ceil(maxDataValue / 4) * 4);
  const step = maxValue / 4;

  // Agora os passos são gerados matematicamente (ex: 0, 4, 8, 12, 16)
  const gridSteps = [0, step, step * 2, step * 3, maxValue];

  // --- LAYOUT DO GRÁFICO ---
  const chartHeight = 240;
  const leftAxisWidth = 40 + 8; // 8 é o padding esquerdo
  const rightPadding = 40;
  const topPadding = 20;
  const bottomPadding = 30;

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const drawingWidth = Math.max(
    0,
    containerWidth - leftAxisWidth - rightPadding,
  );
  const rowHeight =
    (chartHeight - topPadding - bottomPadding) / falhasPeriodoMock.length;
  const barHeight = 16;

  // * --- Código para o Funcionamento do Gráfico Horizontal em SVG ---

  const ref = React.useRef<TriggerRef>(null);

  // * useStates que controlam os componentes de Select
  const [analiseOpen, setAnaliseOpen] = useState(false);
  const [alertasOpen, setAlertasOpen] = useState(false);
  const [geralOpen, setGeralOpen] = useState(false);
  const [tempoOpen, setTempoOpen] = useState(false);
  const [falhasOpen, setFalhasOpen] = useState(false);
  const [aguaOpen, setAguaOpen] = useState(false);
  const [energiaOpen, setEnergiaOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: Platform.select({
      ios: insets.bottom,
      android: insets.bottom + 24,
    }),
    left: 12,
    right: 12,
  };

  const router = useRouter();

  const colunasLog: TableColumn<(typeof logMock)[0]>[] = [
    { key: "id", title: "ID", width: 60 },
    { key: "data", title: "Data", width: 180 },
    { key: "pivo", title: "Pivô", width: 70 },
    { key: "status", title: "Status", width: 90 },
    { key: "evento", title: "Evento", width: 80 },
    { key: "origem", title: "Origem", width: 100 },
    { key: "operador", title: "Operador", width: 120 },
    { key: "voltas", title: "Voltas", width: 80 },
    { key: "irrigacao", title: "Irrigação", width: 100 },
    { key: "milimetros", title: "Milímetros", width: 110 },
    { key: "pressao", title: "Pressão", width: 110 },
    { key: "tensao", title: "Tensão", width: 90 },
    { key: "direcao", title: "Direção", width: 100 },
    { key: "anguloAtual", title: "Ângulo Atual", width: 120 },
    { key: "percentimetro", title: "Percentímetro", width: 130 },
  ];

  const colunasAlertas: TableColumn<(typeof alertasMock)[0]>[] = [
    { key: "id", title: "ID", width: 60 },
    {
      key: "tag",
      title: <TriangleAlert size={18} color="white" />,
      width: 60,
      renderCell: (item) => {
        // Define a Cor de Fundo
        let bgColor = "bg-[#00A0A6]"; // Padrão 'info'
        if (item.tipo === "perigo") bgColor = "bg-[#D32F2F]";
        if (item.tipo === "sucesso") bgColor = "bg-[#0AA146]";

        // Define o Ícone Dinamicamente
        const Icone = item.icone === "gota" ? Droplet : TriangleAlert;

        return (
          <View
            className={`${bgColor} w-full py-3 items-center justify-center rounded-r-xl`}
          >
            <Icone size={20} color="white" />
          </View>
        );
      },
    },
    { key: "evento", title: "Evento", width: 260 },
    { key: "data", title: "Data", width: 110 },
    { key: "hora", title: "Hora", width: 80 },
    { key: "pivo", title: "Pivô", width: 70 },
    { key: "operador", title: "Operador", width: 140 },
  ];

  // ** O conteúdo é guardado dentro desta variável para injetar no cabeçalho da lista
  const ConteudoDaTela = (
    <View className="gap-6">
      {/* // * Cabeçalho */}
      <View className="gap-1">
        <View className="flex-row w-full justify-between items-center">
          <Header title="Análise" subtitle="AHCX21214BMM" />
          <View className="flex-row gap-2 items-center">
            <Select onOpenChange={setAnaliseOpen}>
              <SelectTrigger
                ref={ref}
                className={`border-[1px] border-[#b8b8b8] bg-white w-[120px] ${analiseOpen ? "rounded-t-[12px] rounded-b-none border-b-0" : "rounded-[12px] border-b-[1px]"}`}
              >
                <SelectValue placeholder="Fazendas" />
              </SelectTrigger>
              <SelectContent
                insets={contentInsets}
                className={`border-[#b8b8b8] bg-white w-[120px] ${analiseOpen ? "rounded-b-[12px] rounded-t-none" : "rounded-xl"}`}
              >
                <SelectGroup>
                  {fazendas.map((fazenda) => (
                    <SelectItem
                      key={fazenda.value}
                      label={fazenda.label}
                      value={fazenda.value}
                      className={
                        Number(fazenda.id) % 2 !== 0
                          ? "bg-[#E1E1E1]"
                          : "bg-transparent"
                      }
                    >
                      {fazenda.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Pressable className="active:opacity-50 bg-primaria-azul rounded-[12px] w-[40px] h-[40px] items-center justify-center">
              <Download size={24} color="white" strokeWidth={2.5} />
            </Pressable>
          </View>
        </View>

        <Pressable className="active:opacity-50 bg-primaria-azul rounded-[12px] w-[40px] h-[40px] items-center justify-center self-end">
          <Funnel size={24} color="white" strokeWidth={2.5} />
        </Pressable>
      </View>

      {/* // * Alertas */}
      <View className="flex-row w-full justify-between items-center">
        <Text className="font-outfit-bold">Alertas</Text>
        <View className="flex-row gap-2 items-center">
          <Select onOpenChange={setAlertasOpen}>
            <SelectTrigger
              ref={ref}
              className={`border-[1px] border-[#b8b8b8] bg-white w-[100px] ${alertasOpen ? "rounded-t-[12px] rounded-b-none border-b-0" : "rounded-[12px] border-b-[1px]"}`}
            >
              <SelectValue placeholder="Pivô" />
            </SelectTrigger>
            <SelectContent
              insets={contentInsets}
              className={`border-[#b8b8b8] bg-white w-[100px] ${alertasOpen ? "rounded-b-[12px] rounded-t-none" : "rounded-xl"}`}
            >
              <SelectGroup>
                {pivos.map((pivo) => (
                  <SelectItem
                    key={pivo.value}
                    label={pivo.label}
                    value={pivo.value}
                    className={
                      Number(pivo.id) % 2 !== 0
                        ? "bg-[#E1E1E1]"
                        : "bg-transparent"
                    }
                  >
                    {pivo.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </View>
      </View>

      <Table data={alertasMock} columns={colunasAlertas} />

      {/* // * Visão Geral */}
      <View className="self-stretch gap-5">
        <View className="flex-row w-full justify-between items-center">
          <Text className="font-outfit-bold">Visão Geral</Text>
          <View className="flex-row gap-2 items-center">
            <Select onOpenChange={setGeralOpen}>
              <SelectTrigger
                ref={ref}
                className={`border-[1px] border-[#b8b8b8] bg-white w-[100px] ${geralOpen ? "rounded-t-[12px] rounded-b-none border-b-0" : "rounded-[12px] border-b-[1px]"}`}
              >
                <SelectValue placeholder="Pivô" />
              </SelectTrigger>
              <SelectContent
                insets={contentInsets}
                className={`border-[#b8b8b8] bg-white w-[100px] ${geralOpen ? "rounded-b-[12px] rounded-t-none" : "rounded-xl"}`}
              >
                <SelectGroup>
                  {pivos.map((pivo) => (
                    <SelectItem
                      key={pivo.value}
                      label={pivo.label}
                      value={pivo.value}
                      className={
                        Number(pivo.id) % 2 !== 0
                          ? "bg-[#E1E1E1]"
                          : "bg-transparent"
                      }
                    >
                      {pivo.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Pressable className="active:opacity-50 bg-primaria-azul rounded-[12px] w-[40px] h-[40px] items-center justify-center">
              <Download size={24} color="white" strokeWidth={2.5} />
            </Pressable>
          </View>
        </View>

        <View className="flex-row justify-center items-center gap-4">
          <CloudSun size={67} color="black" />
          <View>
            <View className="flex-row items-end justify-start gap-2">
              <Text className="font-outfit-medium text-3xl">28º</Text>
              <Text className="font-outfit-bold text-base mb-1">
                Pred. Nublado
              </Text>
            </View>
            <Text className="text-sm">12% de chance de Precipitação</Text>
          </View>
        </View>
      </View>

      <Separator className="my-2 bg-[#B5B5B5]" decorative />

      {/* // * Grid de Métricas */}
      <View className="flex-row flex-wrap justify-between gap-y-4">
        <View className="gap-4 w-[50%] ">
          <View className="flex-row items-center gap-2">
            <GaugeCircle size={20} color="#0D0D0D" strokeWidth={2.5} />
            <Text className="font-outfit text-texto text-sm">
              Pivôs Ativos: <Text className="font-outfit-bold">4</Text>
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <CircleX size={20} color="#0D0D0D" strokeWidth={2.5} />
            <Text className="font-outfit text-texto text-sm">
              Falhas Totais: <Text className="font-outfit-bold">12</Text>
            </Text>
          </View>
        </View>
        <View className="gap-4 w-[50%]">
          <View className="flex-row items-center gap-2">
            <ArrowUpNarrowWide size={20} color="#0D0D0D" strokeWidth={2.5} />
            <Text className="font-outfit text-texto text-sm">
              Eficiência Média: <Text className="font-outfit-bold">89%</Text>
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Droplet size={20} color="#0D0D0D" strokeWidth={2.5} />
            <Text className="font-outfit text-texto text-sm">
              Consumo p/Ciclo: <Text className="font-outfit-bold">48 L</Text>
            </Text>
          </View>
        </View>
      </View>

      <Separator className="my-2 bg-[#B5B5B5]" decorative />

      {/* // * Lista de Métricas */}
      <View className="self-stretch justify-between gap-y-3">
        <View className="flex-row items-center justify-between gap-2">
          <View className="flex-row items-center gap-2">
            <Droplets size={20} color="#0D0D0D" strokeWidth={2.5} />
            <Text className="font-outfit text-texto text-sm">
              Área Total Irrigada:
            </Text>
          </View>
          <Text className="font-outfit-bold">342 Ha</Text>
        </View>
        <View className="flex-row justify-between items-center gap-2">
          <View className="flex-row items-center gap-2">
            <Droplet size={20} color="#0D0D0D" strokeWidth={2.5} />
            <Text className="font-outfit text-texto text-sm">
              Consumo Total de Água:
            </Text>
          </View>
          <Text className="font-outfit-bold">120.582 L</Text>
        </View>
        <View className="flex-row justify-between items-center gap-2">
          <View className="flex-row items-center gap-2">
            <Zap size={20} color="#0D0D0D" strokeWidth={2.5} />
            <Text className="font-outfit text-texto text-sm">
              Consumo Total de Energia:
            </Text>
          </View>
          <Text className="font-outfit-bold">584 KWh</Text>
        </View>
        <View className="flex-row justify-between items-center gap-2">
          <View className="flex-row items-center gap-2">
            <Clock size={20} color="#0D0D0D" strokeWidth={2.5} />
            <Text className="font-outfit text-texto text-sm">
              Tempo Médio de Operação:
            </Text>
          </View>
          <Text className="font-outfit-bold">18 h 25 min</Text>
        </View>
      </View>

      <Separator className="my-2 bg-[#B5B5B5]" decorative />

      {/* // * Tempo de Operação (Gráfico) */}
      <View className="self-stretch gap-5">
        <View className="flex-row w-full justify-between items-center">
          <Text className="font-outfit-bold">Tempo de Operação</Text>
          <View className="flex-row gap-2 items-center">
            <Select onOpenChange={setTempoOpen}>
              <SelectTrigger
                ref={ref}
                className={`border-[1px] border-[#b8b8b8] bg-white w-[120px] ${tempoOpen ? "rounded-t-[12px] rounded-b-none border-b-0" : "rounded-[12px] border-b-[1px]"}`}
              >
                <SelectValue placeholder="Tempo" />
              </SelectTrigger>
              <SelectContent
                insets={contentInsets}
                className={`border-[#b8b8b8] bg-white w-[120px] ${tempoOpen ? "rounded-b-[12px] rounded-t-none" : "rounded-xl"}`}
              >
                <SelectGroup>
                  {tempo_operacao.map((tempo) => (
                    <SelectItem
                      key={tempo.value}
                      label={tempo.label}
                      value={tempo.value}
                      className={
                        Number(tempo.id) % 2 !== 0
                          ? "bg-[#E1E1E1]"
                          : "bg-transparent"
                      }
                    >
                      {tempo.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Pressable className="active:opacity-50 bg-primaria-azul rounded-[12px] w-[40px] h-[40px] items-center justify-center">
              <Download size={24} color="white" strokeWidth={2.5} />
            </Pressable>
          </View>
        </View>

        {/* // * Gráfico de Barras de Tempo de Operação */}
        <View className="bg-white border-[2px] border-[#cacaca] rounded-[12px] pt-4 pl-2 pb-3">
          {/* Título do Eixo Y posicionado no topo esquerdo */}
          <Text className="text-xs font-outfit-bold text-texto mb-2">
            Horas
          </Text>

          <View className="items-center justify-center">
            <BarChart
              data={tempoOperacaoMock}
              // Estilização das Barras
              frontColor="#00A0A6" // O Teal/Azul Primário do Pluvia
              barWidth={24}
              spacing={12}
              barBorderTopLeftRadius={4} // Arredonda o topo
              barBorderTopRightRadius={4} // Arredonda o topo
              endSpacing={4}
              // Configuração dos Eixos
              hideYAxisText={false}
              yAxisExtraHeight={18}
              yAxisThickness={0} // Remove a linha vertical preta do eixo Y
              xAxisThickness={1} // Mantém a linha horizontal base
              stepHeight={30}
              xAxisColor="#0D0D0D"
              // Configuração da Grade (Linhas Horizontais Cinzas)
              hideRules={false}
              rulesType="solid"
              rulesColor="#CACACA"
              // Configuração Matemática (De 5 em 5 até 25 para espaçamento igual)
              showValuesAsTopLabel
              topLabelTextStyle={{ fontSize: 12, fontFamily: "Outfit_700Bold" }}
              maxValue={25}
              stepValue={5}
              noOfSections={5}
              // Estilização dos Textos dos Eixos
              yAxisTextStyle={{
                fontFamily: "Outfit_400Regular",
                color: "#0D0D0D",
                fontSize: 12,
              }}
              xAxisLabelTextStyle={{
                fontFamily: "Outfit_400Regular",
                color: "#0D0D0D",
                fontSize: 12,
              }}
              // Comportamento
              disableScroll={false}
              isAnimated={true} // Adiciona aquela animação fluida quando a tela abre
              showScrollIndicator={false}
              animationDuration={400}
            />
          </View>

          {/* Título do Eixo X posicionado no centro inferior */}
          <Text className="text-xs font-outfit-bold text-center mt-2">
            Pivôs
          </Text>
        </View>
      </View>

      <Separator className="my-2 bg-[#B5B5B5]" decorative />

      {/* // * Quantidade de Falhas por Período */}
      <View className="self-stretch gap-5">
        <View className="flex-row w-full justify-between items-center">
          <Text className="font-outfit-bold text-wrap w-[140px]">
            Quantidade de Falhas por Período
          </Text>
          <View className="flex-row gap-2 items-center">
            <Select onOpenChange={setFalhasOpen}>
              <SelectTrigger
                ref={ref}
                className={`border-[1px] border-[#b8b8b8] bg-white w-[100px] ${falhasOpen ? "rounded-t-[12px] rounded-b-none border-b-0" : "rounded-[12px] border-b-[1px]"}`}
              >
                <SelectValue placeholder="Pivô" />
              </SelectTrigger>
              <SelectContent
                insets={contentInsets}
                className={`border-[#b8b8b8] bg-white w-[100px] ${falhasOpen ? "rounded-b-[12px] rounded-t-none" : "rounded-xl"}`}
              >
                <SelectGroup>
                  {pivos.map((pivo) => (
                    <SelectItem
                      key={pivo.value}
                      label={pivo.label}
                      value={pivo.value}
                      className={
                        Number(pivo.id) % 2 !== 0
                          ? "bg-[#E1E1E1]"
                          : "bg-transparent"
                      }
                    >
                      {pivo.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Pressable className="active:opacity-50 bg-primaria-azul rounded-[12px] w-[40px] h-[40px] items-center justify-center">
              <Download size={24} color="white" strokeWidth={2.5} />
            </Pressable>
          </View>
        </View>

        {/* // * Gráfico de Barras de Falhas por Período (SVG) */}
        <View
          onLayout={handleLayout}
          className="bg-white border-[2px] border-[#cacaca] rounded-[12px] w-full overflow-hidden"
        >
          {containerWidth > 0 && (
            <Svg width={containerWidth} height={chartHeight}>
              {/* LINHAS DE GRADE E TEXTOS DO EIXO X */}
              {gridSteps.map((currentStep) => {
                const xPos =
                  leftAxisWidth + (currentStep / maxValue) * drawingWidth;
                return (
                  <G key={`grid-${currentStep}`}>
                    <Line
                      x1={xPos}
                      y1={topPadding}
                      x2={xPos}
                      y2={chartHeight - bottomPadding}
                      stroke="#DBDEE4"
                      strokeWidth="1"
                    />
                    <SvgText
                      x={xPos}
                      y={chartHeight - bottomPadding + 20}
                      fill="#0D0D0D"
                      fontSize="12"
                      fontFamily="Outfit_400Regular"
                      textAnchor="middle"
                    >
                      {currentStep}
                    </SvgText>
                  </G>
                );
              })}

              {/* BARRAS, MESES E VALORES */}
              {falhasPeriodoMock.map((item, index) => {
                const barWidth = (item.value / maxValue) * drawingWidth;
                const rowCenterY =
                  topPadding + index * rowHeight + rowHeight / 2;
                const barY = rowCenterY - barHeight / 2;

                return (
                  <G key={`bar-${item.label}`}>
                    {/* Texto do Mês (Esquerda) */}
                    <SvgText
                      x={leftAxisWidth - 10}
                      y={rowCenterY + 4}
                      fill="#0D0D0D"
                      fontSize="12"
                      fontFamily="Outfit_400Regular"
                      textAnchor="end"
                    >
                      {item.label}
                    </SvgText>

                    {/* Retângulos da Barra (Curva na direita, reta na esquerda) */}
                    <Rect
                      x={leftAxisWidth}
                      y={barY}
                      width={barWidth}
                      height={barHeight}
                      rx={4}
                      fill="#00A0A6"
                    />
                    <Rect
                      x={leftAxisWidth}
                      y={barY}
                      width={Math.min(4, barWidth)}
                      height={barHeight}
                      fill="#00A0A6"
                    />

                    {/* 3. O VALOR NUMÉRICO À DIREITA DA BARRA */}
                    <SvgText
                      // Soma a largura do eixo + a largura da barra + 8px de margem
                      x={leftAxisWidth + barWidth + 4}
                      y={rowCenterY + 4}
                      fill="#0D0D0D"
                      fontSize="12"
                      // Usando Bold para o número ter peso visual
                      fontFamily="Outfit_700Bold"
                      color="#666666"
                      textAnchor="start"
                    >
                      {item.value}
                    </SvgText>
                  </G>
                );
              })}

              {/* LINHA BASE DO EIXO Y */}
              <Line
                x1={leftAxisWidth}
                y1={topPadding}
                x2={leftAxisWidth}
                y2={chartHeight - bottomPadding + 4}
                stroke="#0D0D0D"
                strokeWidth="0.5"
              />
            </Svg>
          )}
        </View>
      </View>

      <Separator className="my-2 bg-[#B5B5B5]" decorative />

      {/* // * Consumo de Água por Hora */}
      <View className="self-stretch gap-5">
        <View className="flex-row w-full justify-between items-center">
          <Text className="font-outfit-bold text-wrap w-[140px]">
            Consumo de Água por Hora
          </Text>
          <View className="flex-row gap-2 items-center">
            <Select onOpenChange={setAguaOpen}>
              <SelectTrigger
                ref={ref}
                className={`border-[1px] border-[#b8b8b8] bg-white w-[100px] ${aguaOpen ? "rounded-t-[12px] rounded-b-none border-b-0" : "rounded-[12px] border-b-[1px]"}`}
              >
                <SelectValue placeholder="Pivô" />
              </SelectTrigger>
              <SelectContent
                insets={contentInsets}
                className={`border-[#b8b8b8] bg-white w-[100px] ${aguaOpen ? "rounded-b-[12px] rounded-t-none" : "rounded-xl"}`}
              >
                <SelectGroup>
                  {pivos.map((pivo) => (
                    <SelectItem
                      key={pivo.value}
                      label={pivo.label}
                      value={pivo.value}
                      className={
                        Number(pivo.id) % 2 !== 0
                          ? "bg-[#E1E1E1]"
                          : "bg-transparent"
                      }
                    >
                      {pivo.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Pressable className="active:opacity-50 bg-primaria-azul rounded-[12px] w-[40px] h-[40px] items-center justify-center">
              <Download size={24} color="white" strokeWidth={2.5} />
            </Pressable>
          </View>
        </View>

        {/* // * Gráfico de Barras de Consumo de Água por Hora */}
        <View className="border-[2px] border-[#cacaca] rounded-[12px] pt-4 pl-2 pb-3">
          {/* Título do Eixo Y posicionado no topo esquerdo */}
          <Text className="text-xs font-outfit-bold text-texto mb-2 pl-1">
            L/h
          </Text>

          <View className="items-center justify-center">
            <BarChart
              data={valoresConsumoAgua}
              // Estilização das Barras
              frontColor="#00A0A6" // O Teal/Azul Primário do Pluvia
              barWidth={28}
              spacing={12}
              barBorderTopLeftRadius={4} // Arredonda o topo
              barBorderTopRightRadius={4} // Arredonda o topo
              endSpacing={4}
              // Configuração dos Eixos
              hideYAxisText={false}
              yAxisExtraHeight={16}
              yAxisThickness={0} // Remove a linha vertical preta do eixo Y
              xAxisThickness={1} // Mantém a linha horizontal base
              stepHeight={50}
              xAxisColor="#0D0D0D"
              // Configuração da Grade (Linhas Horizontais Cinzas)
              hideRules={false}
              rulesType="solid"
              rulesColor="#CACACA"
              // Configuração Matemática (De 5 em 5 até 25 para espaçamento igual)
              showValuesAsTopLabel
              topLabelTextStyle={{ fontSize: 12, fontFamily: "Outfit_700Bold" }}
              maxValue={200}
              stepValue={50}
              noOfSections={5}
              // Estilização dos Textos dos Eixos
              yAxisTextStyle={{
                fontFamily: "Outfit_400Regular",
                color: "#0D0D0D",
                fontSize: 12,
              }}
              xAxisLabelTextStyle={{
                fontFamily: "Outfit_400Regular",
                color: "#0D0D0D",
                fontSize: 12,
              }}
              // Comportamento
              disableScroll={false}
              isAnimated={true} // Adiciona aquela animação fluida quando a tela abre
              showScrollIndicator={false}
              animationDuration={400}
            />
          </View>

          {/* Título do Eixo X posicionado no centro inferior */}
          {/* <Text className="text-xs font-outfit-bold text-center mt-2">
            Pivôs
          </Text> */}
        </View>
      </View>

      <Separator className="my-2 bg-[#B5B5B5]" decorative />

      {/* // * Consumo de Energia */}
      <View className="self-stretch gap-5">
        <View className="flex-row w-full justify-between items-center">
          <Text className="font-outfit-bold text-wrap">Consumo de Energia</Text>
          <View className="flex-row gap-2 items-center">
            <Select onOpenChange={setEnergiaOpen}>
              <SelectTrigger
                ref={ref}
                className={`border-[1px] border-[#b8b8b8] bg-white w-[100px] ${energiaOpen ? "rounded-t-[12px] rounded-b-none border-b-0" : "rounded-[12px] border-b-[1px]"}`}
              >
                <SelectValue placeholder="Pivô" />
              </SelectTrigger>
              <SelectContent
                insets={contentInsets}
                className={`border-[#b8b8b8] bg-white w-[100px] ${energiaOpen ? "rounded-b-[12px] rounded-t-none" : "rounded-xl"}`}
              >
                <SelectGroup>
                  {pivos.map((pivo) => (
                    <SelectItem
                      key={pivo.value}
                      label={pivo.label}
                      value={pivo.value}
                      className={
                        Number(pivo.id) % 2 !== 0
                          ? "bg-[#E1E1E1]"
                          : "bg-transparent"
                      }
                    >
                      {pivo.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Pressable className="active:opacity-50 bg-primaria-azul rounded-[12px] w-[40px] h-[40px] items-center justify-center">
              <Download size={24} color="white" strokeWidth={2.5} />
            </Pressable>
          </View>
        </View>

        {/* // * Gráfico de Linhas de Consumo de Energia */}
        <View className="bg-white border-[2px] border-[#cacaca] rounded-[12px] pt-4 pl-2 pb-3">
          {/* HEADER: Título do Eixo e Legenda Customizada */}
          <View className="flex-row justify-between items-center mb-6 pl-1">
            <Text className="text-xs font-outfit-bold text-texto">KWh</Text>

            {/* Container da Legenda */}
            <View className="flex-row items-center gap-4 pr-2">
              {/* Item: Real */}
              <View className="flex-row items-center gap-1.5">
                <View className="w-6 h-4 rounded-full bg-primaria-azul" />
                <Text className="text-xs">Real</Text>
              </View>

              {/* Item: Estimado */}
              <View className="flex-row items-center gap-1.5">
                <View className="w-6 h-4 rounded-full bg-primaria-verde" />
                <Text className="text-xs">Estimado</Text>
              </View>
            </View>
          </View>

          {/* GRÁFICO DE LINHAS */}
          <View className="items-center justify-center">
            <LineChart
              // Passamos os dois arrays de dados gerados acima
              data={consumoEnergiaReal}
              data2={consumoEnergiaEstimado}
              // Cores e espessuras das linhas de conexão
              color1="#00A0A6"
              color2="#0AA146"
              thickness1={2}
              thickness2={2}
              // Espaçamentos e Limites
              initialSpacing={16}
              yAxisExtraHeight={16}
              xAxisLabelsVerticalShift={8}
              // Configuração Matemática da Escala
              maxValue={400}
              stepValue={100}
              noOfSections={4}
              stepHeight={45}
              // Eixos e Grades
              hideYAxisText={false}
              yAxisThickness={0}
              xAxisThickness={1}
              xAxisColor="#0D0D0D"
              hideRules={false}
              rulesType="solid"
              rulesColor="#CACACA"
              // Estilização dos Textos dos Eixos
              yAxisTextStyle={{
                fontFamily: "Outfit_400Regular",
                color: "#0D0D0D",
                fontSize: 12,
              }}
              xAxisLabelTextStyle={{
                fontFamily: "Outfit_400Regular",
                color: "#0D0D0D",
                fontSize: 12,
              }}
              // Animação inicial
              isAnimated={true}
              animationDuration={400}
            />
          </View>
        </View>
      </View>

      <Separator className="my-2 bg-[#B5B5B5]" decorative />

      {/* // * Log */}
      <View className="self-stretch gap-5">
        <View className="flex-row w-full justify-between items-center">
          <Text className="font-outfit-bold text-wrap">Log</Text>
          <View className="flex-row gap-2 items-center">
            <Select onOpenChange={setLogOpen}>
              <SelectTrigger
                ref={ref}
                className={`border-[1px] border-[#b8b8b8] bg-white w-[100px] ${logOpen ? "rounded-t-[12px] rounded-b-none border-b-0" : "rounded-[12px] border-b-[1px]"}`}
              >
                <SelectValue placeholder="Pivô" />
              </SelectTrigger>
              <SelectContent
                insets={contentInsets}
                className={`border-[#b8b8b8] bg-white w-[100px] ${logOpen ? "rounded-b-[12px] rounded-t-none" : "rounded-xl"}`}
              >
                <SelectGroup>
                  {pivos.map((pivo) => (
                    <SelectItem
                      key={pivo.value}
                      label={pivo.label}
                      value={pivo.value}
                      className={
                        Number(pivo.id) % 2 !== 0
                          ? "bg-[#E1E1E1]"
                          : "bg-transparent"
                      }
                    >
                      {pivo.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Pressable className="active:opacity-50 bg-primaria-azul rounded-[12px] w-[40px] h-[40px] items-center justify-center">
              <Download size={24} color="white" strokeWidth={2.5} />
            </Pressable>
          </View>
        </View>

        <Table data={logMock} columns={colunasLog} />
      </View>
    </View>
  );

  return (
    <Screen className="flex-1 px-0">
      <FlashList
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={ConteudoDaTela}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}
