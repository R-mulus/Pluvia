/**
 * ✅ [PORTABILIDADE WEB E MOBILE CONCLUÍDA]
 * * MODIFICAÇÕES REALIZADAS PARA ADAPTAÇÃO WEB/APP:
 * 1. VISÃO GERAL CENTRALIZADA: 
 * - O "Grid de Métricas" teve o flex ajustado para 'justify-center' com 'gap-x-12'.
 * - A "Lista de Métricas" recebeu 'self-center w-full max-w-[400px]' para ficar perfeitamente no meio da tela no desktop.
 * 2. REORDENAÇÃO DE GRÁFICOS: O gráfico "Quantidade de Falhas" (SVG) foi movido para cima dos outros três.
 * 3. RESPONSIVIDADE TOTAL (SVG MATH):
 * - Todos os gráficos agora são gerados via Svg. A largura de cada coluna/ponto é calculada matematicamente ('drawingWidth / length').
 * - Isso faz com que TODOS os gráficos se adaptem automaticamente a qualquer tela (Mobile ou PC), ocupando toda a extensão disponível sem quebrar.
 * - Corrigido o bug do "ScrollView" que espichava o gráfico no Expo Go (Mobile). Agora as Views possuem "w-full overflow-hidden" garantindo o tamanho perfeito.
 * 4. FIX DOS NÚMEROS: Os valores do "Consumo de Água" foram corrigidos para o eixo Y certo ('yPos - 6') garantindo que fiquem acima das barras de água.
 */

import * as React from "react";
import { useState } from "react";
import { View, Platform, Pressable, LayoutChangeEvent } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Separator } from "@/components/ui/separator";
import { useRouter, type Href } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { TriggerRef } from "@rn-primitives/select";
// Importado Path e Circle para o Gráfico de Linhas
import Svg, { Rect, Line, Text as SvgText, G, Path, Circle } from "react-native-svg";
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

// ! COMPONENTES CUSTOM
import { Table, TableColumn } from "@/components/custom/Table";
import Header from "@/components/custom/Header";
import { Screen } from "@/components/custom/Screen";

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

export default function Analises() {
  const [containerWidth, setContainerWidth] = useState(0);

  // --- LÓGICA DE ESCALA E COORDENADAS PARA TODOS OS GRÁFICOS SVG ---
  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  // Constantes de Layout Global para as caixas
  const chartHeight = 240;
  const leftAxisWidth = 48; // Eixo Y
  const rightPadding = 20;  // Espaço extra na direita para respirar
  const topPadding = 30;    // Espaço extra em cima pros valores
  const bottomPadding = 30;
  
  const chartInnerHeight = chartHeight - topPadding - bottomPadding;
  const drawingWidth = Math.max(0, containerWidth - leftAxisWidth - rightPadding);

  // 1. Cálculos de Falhas (Horizontal)
  const maxFalhasData = Math.max(...falhasPeriodoMock.map((item) => item.value));
  const maxFalhasValue = Math.max(8, Math.ceil(maxFalhasData / 4) * 4);
  const stepFalhas = maxFalhasValue / 4;
  const falhasGridSteps = [0, stepFalhas, stepFalhas * 2, stepFalhas * 3, maxFalhasValue];
  const falhasRowHeight = chartInnerHeight / falhasPeriodoMock.length;
  const barHeight = 16;

  // 2. Cálculos de Tempo (Barras Verticais)
  const tempoMax = 25;
  const tempoSteps = [0, 5, 10, 15, 20, 25];

  // 3. Cálculos de Água (Barras Verticais)
  const aguaMax = 200;
  const aguaSteps = [0, 50, 100, 150, 200];

  // 4. Cálculos de Energia (Linhas)
  const energiaMax = 400;
  const energiaSteps = [0, 100, 200, 300, 400];

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
    <View className="gap-6 w-full pb-4">
      {/* // * Cabeçalho */}
      <View className="gap-1">
        <View className="flex-row w-full justify-between items-center">
          <Header title="Análise" subtitle="AHCX21214BMM" />
          <View className="flex-row gap-2 items-center">
            <Select onOpenChange={setAnaliseOpen}>
              <SelectTrigger
                ref={ref}
                className={`border-[1px] border-[#b8b8b8] bg-white w-[120px] cursor-pointer hover:opacity-90 ${analiseOpen ? "rounded-t-[12px] rounded-b-none border-b-0" : "rounded-[12px] border-b-[1px]"}`}
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
            <Pressable className="active:opacity-50 hover:opacity-80 cursor-pointer transition-opacity bg-primaria-azul rounded-[12px] w-[40px] h-[40px] items-center justify-center">
              <Download size={24} color="white" strokeWidth={2.5} />
            </Pressable>
          </View>
        </View>

        <Pressable className="active:opacity-50 hover:opacity-80 cursor-pointer transition-opacity bg-primaria-azul rounded-[12px] w-[40px] h-[40px] items-center justify-center self-end">
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
              className={`border-[1px] border-[#b8b8b8] bg-white w-[100px] cursor-pointer hover:opacity-90 ${alertasOpen ? "rounded-t-[12px] rounded-b-none border-b-0" : "rounded-[12px] border-b-[1px]"}`}
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

      <Table data={alertasMock} columns={colunasAlertas} alerta/>

      {/* // * Visão Geral */}
      <View className="self-stretch gap-5">
        <View className="flex-row w-full justify-between items-center">
          <Text className="font-outfit-bold">Visão Geral</Text>
          <View className="flex-row gap-2 items-center">
            <Select onOpenChange={setGeralOpen}>
              <SelectTrigger
                ref={ref}
                className={`border-[1px] border-[#b8b8b8] bg-white w-[100px] cursor-pointer hover:opacity-90 ${geralOpen ? "rounded-t-[12px] rounded-b-none border-b-0" : "rounded-[12px] border-b-[1px]"}`}
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
            <Pressable className="active:opacity-50 hover:opacity-80 cursor-pointer transition-opacity bg-primaria-azul rounded-[12px] w-[40px] h-[40px] items-center justify-center">
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
      <View className="flex-row flex-wrap justify-center gap-x-12 gap-y-4 w-full">
        <View className="gap-4">
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
        <View className="gap-4">
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
      <View className="self-center w-full max-w-[400px] justify-between gap-y-3">
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

      {/* ========================================================================= */}
      {/* // * Gráfico 1: Quantidade de Falhas por Período (Barras Horizontais SVG) */}
      {/* ========================================================================= */}
      <View className="self-stretch gap-5">
        <View className="flex-row w-full justify-between items-center">
          <Text className="font-outfit-bold text-wrap w-[140px]">
            Quantidade de Falhas por Período
          </Text>
          <View className="flex-row gap-2 items-center">
            <Select onOpenChange={setFalhasOpen}>
              <SelectTrigger
                ref={ref}
                className={`border-[1px] border-[#b8b8b8] bg-white w-[100px] cursor-pointer hover:opacity-90 ${falhasOpen ? "rounded-t-[12px] rounded-b-none border-b-0" : "rounded-[12px] border-b-[1px]"}`}
              >
                <SelectValue placeholder="Pivô" />
              </SelectTrigger>
              <SelectContent
                insets={contentInsets}
                className={`border-[#b8b8b8] bg-white w-[100px] ${falhasOpen ? "rounded-b-[12px] rounded-t-none" : "rounded-xl"}`}
              >
                <SelectGroup>
                  {pivos.map((pivo) => (
                    <SelectItem key={pivo.value} label={pivo.label} value={pivo.value} className={Number(pivo.id) % 2 !== 0 ? "bg-[#E1E1E1]" : "bg-transparent"}>
                      {pivo.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Pressable className="active:opacity-50 hover:opacity-80 cursor-pointer transition-opacity bg-primaria-azul rounded-[12px] w-[40px] h-[40px] items-center justify-center">
              <Download size={24} color="white" strokeWidth={2.5} />
            </Pressable>
          </View>
        </View>

        <View
          onLayout={handleLayout}
          className="bg-white border-[2px] border-[#cacaca] rounded-[12px] w-full overflow-hidden"
        >
          {(containerWidth > 0 || Platform.OS === 'web') && (
            <Svg width={containerWidth || "100%"} height={chartHeight}>
              {/* LINHAS DE GRADE E TEXTOS DO EIXO X */}
              {falhasGridSteps.map((currentStep) => {
                const xPos = leftAxisWidth + (currentStep / maxFalhasValue) * drawingWidth;
                return (
                  <G key={`grid-${currentStep}`}>
                    <Line x1={xPos} y1={topPadding} x2={xPos} y2={chartHeight - bottomPadding} stroke="#DBDEE4" strokeWidth="1" />
                    <SvgText x={xPos} y={chartHeight - bottomPadding + 20} fill="#0D0D0D" fontSize="12" fontFamily="Outfit_400Regular" textAnchor="middle">
                      {currentStep}
                    </SvgText>
                  </G>
                );
              })}

              {/* BARRAS, MESES E VALORES */}
              {falhasPeriodoMock.map((item, index) => {
                const barWidth = (item.value / maxFalhasValue) * drawingWidth;
                const rowCenterY = topPadding + index * falhasRowHeight + falhasRowHeight / 2;
                const barY = rowCenterY - barHeight / 2;

                return (
                  <G key={`bar-${item.label}`}>
                    <SvgText x={leftAxisWidth - 10} y={rowCenterY + 4} fill="#0D0D0D" fontSize="12" fontFamily="Outfit_400Regular" textAnchor="end">
                      {item.label}
                    </SvgText>

                    <Rect x={leftAxisWidth} y={barY} width={barWidth} height={barHeight} rx={4} fill="#00A0A6" />
                    <Rect x={leftAxisWidth} y={barY} width={Math.min(4, barWidth)} height={barHeight} fill="#00A0A6" />

                    <SvgText x={leftAxisWidth + barWidth + 4} y={rowCenterY + 4} fill="#0D0D0D" fontSize="12" fontFamily="Outfit_700Bold" color="#666666" textAnchor="start">
                      {item.value}
                    </SvgText>
                  </G>
                );
              })}

              {/* LINHA BASE DO EIXO Y */}
              <Line x1={leftAxisWidth} y1={topPadding} x2={leftAxisWidth} y2={chartHeight - bottomPadding + 4} stroke="#0D0D0D" strokeWidth="0.5" />
            </Svg>
          )}
        </View>
      </View>

      <Separator className="my-2 bg-[#B5B5B5]" decorative />

      {/* ========================================================================= */}
      {/* // * Gráfico 2: Tempo de Operação (Barras Verticais SVG) */}
      {/* ========================================================================= */}
      <View className="self-stretch gap-5">
        <View className="flex-row w-full justify-between items-center">
          <Text className="font-outfit-bold">Tempo de Operação</Text>
          <View className="flex-row gap-2 items-center">
            <Select onOpenChange={setTempoOpen}>
              <SelectTrigger
                ref={ref}
                className={`border-[1px] border-[#b8b8b8] bg-white w-[120px] cursor-pointer hover:opacity-90 ${tempoOpen ? "rounded-t-[12px] rounded-b-none border-b-0" : "rounded-[12px] border-b-[1px]"}`}
              >
                <SelectValue placeholder="Tempo" />
              </SelectTrigger>
              <SelectContent
                insets={contentInsets}
                className={`border-[#b8b8b8] bg-white w-[120px] ${tempoOpen ? "rounded-b-[12px] rounded-t-none" : "rounded-xl"}`}
              >
                <SelectGroup>
                  {tempo_operacao.map((tempo) => (
                    <SelectItem key={tempo.value} label={tempo.label} value={tempo.value} className={Number(tempo.id) % 2 !== 0 ? "bg-[#E1E1E1]" : "bg-transparent"}>
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

        <View className="bg-white border-[2px] border-[#cacaca] rounded-[12px] pt-4 pl-2 pb-3 w-full overflow-hidden">
          <Text className="text-xs font-outfit-bold text-texto mb-2">Horas</Text>

          {(containerWidth > 0 || Platform.OS === 'web') && (
            <Svg width={containerWidth || "100%"} height={chartHeight}>
              {/* LINHAS HORIZONTAIS DE GRADE */}
              {tempoSteps.map((currentStep) => {
                const yPos = topPadding + chartInnerHeight - (currentStep / tempoMax) * chartInnerHeight;
                return (
                  <G key={`grid-h-${currentStep}`}>
                    {/* Linha que vai até o final (drawingWidth) */}
                    <Line x1={leftAxisWidth} y1={yPos} x2={leftAxisWidth + drawingWidth} y2={yPos} stroke="#CACACA" strokeWidth="1" />
                    <SvgText x={leftAxisWidth - 10} y={yPos + 4} fill="#0D0D0D" fontSize="12" fontFamily="Outfit_400Regular" textAnchor="end">
                      {currentStep}
                    </SvgText>
                  </G>
                );
              })}

              {/* BARRAS VERTICAIS DINÂMICAS */}
              {tempoOperacaoMock.map((item, index) => {
                const stepX = drawingWidth / tempoOperacaoMock.length;
                const barWidth = Math.min(24, stepX * 0.8);
                const xCenter = leftAxisWidth + index * stepX + stepX / 2;
                const xPos = xCenter - barWidth / 2;
                const barH = (item.value / tempoMax) * chartInnerHeight;
                const yPos = topPadding + chartInnerHeight - barH;

                return (
                  <G key={`bar-v-${item.label}`}>
                    <Rect x={xPos} y={yPos} width={barWidth} height={barH} rx={4} fill="#00A0A6" />
                    <Rect x={xPos} y={yPos + 4} width={barWidth} height={Math.max(0, barH - 4)} fill="#00A0A6" />

                    <SvgText x={xCenter} y={yPos - 6} fill="#666666" fontSize="12" fontFamily="Outfit_700Bold" textAnchor="middle">
                      {item.value}
                    </SvgText>

                    <SvgText x={xCenter} y={chartHeight - bottomPadding + 20} fill="#0D0D0D" fontSize="12" fontFamily="Outfit_400Regular" textAnchor="middle">
                      {item.label}
                    </SvgText>
                  </G>
                );
              })}

              {/* LINHA BASE DO EIXO X */}
              <Line x1={leftAxisWidth} y1={topPadding + chartInnerHeight} x2={leftAxisWidth + drawingWidth} y2={topPadding + chartInnerHeight} stroke="#0D0D0D" strokeWidth="1" />
            </Svg>
          )}

          <Text className="text-xs font-outfit-bold text-center mt-2">Pivôs</Text>
        </View>
      </View>

      <Separator className="my-2 bg-[#B5B5B5]" decorative />

      {/* ========================================================================= */}
      {/* // * Gráfico 3: Consumo de Água por Hora (Barras Verticais SVG) */}
      {/* ========================================================================= */}
      <View className="self-stretch gap-5">
        <View className="flex-row w-full justify-between items-center">
          <Text className="font-outfit-bold text-wrap w-[140px]">
            Consumo de Água por Hora
          </Text>
          <View className="flex-row gap-2 items-center">
            <Select onOpenChange={setAguaOpen}>
              <SelectTrigger
                ref={ref}
                className={`border-[1px] border-[#b8b8b8] bg-white w-[100px] cursor-pointer hover:opacity-90 ${aguaOpen ? "rounded-t-[12px] rounded-b-none border-b-0" : "rounded-[12px] border-b-[1px]"}`}
              >
                <SelectValue placeholder="Pivô" />
              </SelectTrigger>
              <SelectContent
                insets={contentInsets}
                className={`border-[#b8b8b8] bg-white w-[100px] ${aguaOpen ? "rounded-b-[12px] rounded-t-none" : "rounded-xl"}`}
              >
                <SelectGroup>
                  {pivos.map((pivo) => (
                    <SelectItem key={pivo.value} label={pivo.label} value={pivo.value} className={Number(pivo.id) % 2 !== 0 ? "bg-[#E1E1E1]" : "bg-transparent"}>
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

        <View className="bg-white border-[2px] border-[#cacaca] rounded-[12px] pt-4 pl-2 pb-3 w-full overflow-hidden">
          <Text className="text-xs font-outfit-bold text-texto mb-2 pl-1">L/h</Text>

          {(containerWidth > 0 || Platform.OS === 'web') && (
            <Svg width={containerWidth || "100%"} height={chartHeight}>
              {/* LINHAS HORIZONTAIS DE GRADE */}
              {aguaSteps.map((currentStep) => {
                const yPos = topPadding + chartInnerHeight - (currentStep / aguaMax) * chartInnerHeight;
                return (
                  <G key={`grid-h-agua-${currentStep}`}>
                    <Line x1={leftAxisWidth} y1={yPos} x2={leftAxisWidth + drawingWidth} y2={yPos} stroke="#CACACA" strokeWidth="1" />
                    <SvgText x={leftAxisWidth - 10} y={yPos + 4} fill="#0D0D0D" fontSize="12" fontFamily="Outfit_400Regular" textAnchor="end">
                      {currentStep}
                    </SvgText>
                  </G>
                );
              })}

              {/* BARRAS VERTICAIS DINÂMICAS */}
              {consumoAguaMock.map((item, index) => {
                const stepX = drawingWidth / consumoAguaMock.length;
                const barWidth = Math.min(28, stepX * 0.8);
                const xCenter = leftAxisWidth + index * stepX + stepX / 2;
                const xPos = xCenter - barWidth / 2;
                const barH = (item.value / aguaMax) * chartInnerHeight;
                const yPos = topPadding + chartInnerHeight - barH;

                return (
                  <G key={`bar-v-agua-${item.label}`}>
                    <Rect x={xPos} y={yPos} width={barWidth} height={barH} rx={4} fill="#00A0A6" />
                    <Rect x={xPos} y={yPos + 4} width={barWidth} height={Math.max(0, barH - 4)} fill="#00A0A6" />

                    {/* [FIX] Texto alinhado corretamente (yPos - 6) no topo da barra! */}
                    <SvgText x={xCenter} y={yPos - 6} fill="#666666" fontSize="12" fontFamily="Outfit_700Bold" textAnchor="middle">
                      {item.value}
                    </SvgText>

                    <SvgText x={xCenter} y={chartHeight - bottomPadding + 20} fill="#0D0D0D" fontSize="12" fontFamily="Outfit_400Regular" textAnchor="middle">
                      {item.label}
                    </SvgText>
                  </G>
                );
              })}

              {/* LINHA BASE DO EIXO X */}
              <Line x1={leftAxisWidth} y1={topPadding + chartInnerHeight} x2={leftAxisWidth + drawingWidth} y2={topPadding + chartInnerHeight} stroke="#0D0D0D" strokeWidth="1" />
            </Svg>
          )}
        </View>
      </View>

      <Separator className="my-2 bg-[#B5B5B5]" decorative />

      {/* ========================================================================= */}
      {/* // * Gráfico 4: Consumo de Energia (Linhas SVG) */}
      {/* ========================================================================= */}
      <View className="self-stretch gap-5">
        <View className="flex-row w-full justify-between items-center">
          <Text className="font-outfit-bold text-wrap">Consumo de Energia</Text>
          <View className="flex-row gap-2 items-center">
            <Select onOpenChange={setEnergiaOpen}>
              <SelectTrigger
                ref={ref}
                className={`border-[1px] border-[#b8b8b8] bg-white w-[100px] cursor-pointer hover:opacity-90 ${energiaOpen ? "rounded-t-[12px] rounded-b-none border-b-0" : "rounded-[12px] border-b-[1px]"}`}
              >
                <SelectValue placeholder="Pivô" />
              </SelectTrigger>
              <SelectContent
                insets={contentInsets}
                className={`border-[#b8b8b8] bg-white w-[100px] ${energiaOpen ? "rounded-b-[12px] rounded-t-none" : "rounded-xl"}`}
              >
                <SelectGroup>
                  {pivos.map((pivo) => (
                    <SelectItem key={pivo.value} label={pivo.label} value={pivo.value} className={Number(pivo.id) % 2 !== 0 ? "bg-[#E1E1E1]" : "bg-transparent"}>
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

        <View className="bg-white border-[2px] border-[#cacaca] rounded-[12px] pt-4 pl-2 pb-3 w-full overflow-hidden">
          {/* HEADER: Título do Eixo e Legenda Customizada */}
          <View className="flex-row justify-between items-center mb-6 pl-1">
            <Text className="text-xs font-outfit-bold text-texto">KWh</Text>
            <View className="flex-row items-center gap-4 pr-2">
              <View className="flex-row items-center gap-1.5">
                <View className="w-6 h-4 rounded-full bg-primaria-azul" />
                <Text className="text-xs">Real</Text>
              </View>
              <View className="flex-row items-center gap-1.5">
                <View className="w-6 h-4 rounded-full bg-primaria-verde" />
                <Text className="text-xs">Estimado</Text>
              </View>
            </View>
          </View>

          {/* GRÁFICO DE LINHAS EM SVG DINÂMICO */}
          {(containerWidth > 0 || Platform.OS === 'web') && (
            <Svg width={containerWidth || "100%"} height={chartHeight}>
              {/* LINHAS HORIZONTAIS DE GRADE */}
              {energiaSteps.map((currentStep) => {
                const yPos = topPadding + chartInnerHeight - (currentStep / energiaMax) * chartInnerHeight;
                return (
                  <G key={`grid-h-ene-${currentStep}`}>
                    <Line x1={leftAxisWidth} y1={yPos} x2={leftAxisWidth + drawingWidth} y2={yPos} stroke="#CACACA" strokeWidth="1" />
                    <SvgText x={leftAxisWidth - 10} y={yPos + 4} fill="#0D0D0D" fontSize="12" fontFamily="Outfit_400Regular" textAnchor="end">
                      {currentStep}
                    </SvgText>
                  </G>
                );
              })}

              {/* PATHS (LINHAS DOS GRÁFICOS) */}
              <Path
                d={`M ${consumoEnergiaMock.map((item, i) => {
                  const stepX = drawingWidth / consumoEnergiaMock.length;
                  const x = leftAxisWidth + i * stepX + stepX / 2;
                  const y = topPadding + chartInnerHeight - (item.real / energiaMax) * chartInnerHeight;
                  return `${x} ${y}`;
                }).join(" L ")}`}
                fill="none"
                stroke="#00A0A6"
                strokeWidth="2"
              />

              <Path
                d={`M ${consumoEnergiaMock.map((item, i) => {
                  const stepX = drawingWidth / consumoEnergiaMock.length;
                  const x = leftAxisWidth + i * stepX + stepX / 2;
                  const y = topPadding + chartInnerHeight - (item.estimado / energiaMax) * chartInnerHeight;
                  return `${x} ${y}`;
                }).join(" L ")}`}
                fill="none"
                stroke="#0AA146"
                strokeWidth="2"
              />

              {/* PONTOS (BOLINHAS) E TEXTOS */}
              {consumoEnergiaMock.map((item, index) => {
                const stepX = drawingWidth / consumoEnergiaMock.length;
                const xPos = leftAxisWidth + index * stepX + stepX / 2;
                
                const yReal = topPadding + chartInnerHeight - (item.real / energiaMax) * chartInnerHeight;
                const yEstimado = topPadding + chartInnerHeight - (item.estimado / energiaMax) * chartInnerHeight;
                
                // Lógica de posição (cima ou baixo) para os números não se encavalarem
                const isRealMaior = item.real >= item.estimado;
                const txtYReal = isRealMaior || item.real === 0 ? yReal - 10 : yReal + 16;
                const txtYEstimado = !isRealMaior || item.estimado === 0 ? yEstimado - 10 : yEstimado + 16;

                return (
                  <G key={`points-ene-${item.label}`}>
                    {/* Linha base do X (Label dos dias) */}
                    <SvgText x={xPos} y={chartHeight - bottomPadding + 20} fill="#0D0D0D" fontSize="12" fontFamily="Outfit_400Regular" textAnchor="middle">
                      {item.label}
                    </SvgText>

                    {/* Pontos Real (AZUL) */}
                    <Circle cx={xPos} cy={yReal} r={4} fill="#FFFFFF" stroke="#00A0A6" strokeWidth={2} />
                    <SvgText x={xPos} y={txtYReal} fill="#00A0A6" fontSize="10" fontFamily="Outfit_700Bold" textAnchor="middle">
                      {item.real}
                    </SvgText>

                    {/* Pontos Estimado (VERDE) */}
                    <Circle cx={xPos} cy={yEstimado} r={4} fill="#FFFFFF" stroke="#0AA146" strokeWidth={2} />
                    <SvgText x={xPos} y={txtYEstimado} fill="#0AA146" fontSize="10" fontFamily="Outfit_700Bold" textAnchor="middle">
                      {item.estimado}
                    </SvgText>
                  </G>
                );
              })}

              {/* LINHA BASE DO EIXO X */}
              <Line x1={leftAxisWidth} y1={topPadding + chartInnerHeight} x2={leftAxisWidth + drawingWidth} y2={topPadding + chartInnerHeight} stroke="#0D0D0D" strokeWidth="1" />
            </Svg>
          )}
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
                className={`border-[1px] border-[#b8b8b8] bg-white w-[100px] cursor-pointer hover:opacity-90 ${logOpen ? "rounded-t-[12px] rounded-b-none border-b-0" : "rounded-[12px] border-b-[1px]"}`}
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
            <Pressable className="active:opacity-50 hover:opacity-80 cursor-pointer transition-opacity bg-primaria-azul rounded-[12px] w-[40px] h-[40px] items-center justify-center">
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