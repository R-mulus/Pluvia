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
import { useState, useMemo } from "react";
import { View, Platform, Pressable, LayoutChangeEvent } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "expo-router";
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

// ! COMPONENTES CUSTOM E HOOKS
import { Table, TableColumn } from "@/components/custom/Table";
import Header from "@/components/custom/Header";
import { Screen } from "@/components/custom/Screen";
import { usePivos } from "@/hooks/api/usePivos";
import { useAlertas, useLogsEventos } from "@/hooks/api/useLogs";

// * Dados Mockados para Gráficos e Selects
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

// * GRÁFICOS
export const tempoOperacaoMock = [
  { label: "01", value: 4 }, { label: "02", value: 25 }, { label: "03", value: 21 }, { label: "04", value: 9 }, { label: "05", value: 13 }, { label: "06", value: 10 }, { label: "07", value: 6 }, { label: "08", value: 22 }, { label: "09", value: 19 }, { label: "10", value: 8 },
];

export const falhasPeriodoMock = [
  { label: "Jul", value: 4 }, { label: "Jun", value: 2 }, { label: "Mai", value: 8 }, { label: "Abr", value: 5 }, { label: "Mar", value: 4 }, { label: "Feb", value: 15 }, { label: "Jan", value: 1 },
];

export const consumoAguaMock = [
  { label: "Seg", value: 110 }, { label: "Ter", value: 200 }, { label: "Qua", value: 150 }, { label: "Qui", value: 80 }, { label: "Sex", value: 130 }, { label: "Sab", value: 110 }, { label: "Dom", value: 130 },
];

export const consumoEnergiaMock = [
  { label: "Seg", real: 190, estimado: 0 }, { label: "Ter", real: 300, estimado: 230 }, { label: "Qua", real: 240, estimado: 300 }, { label: "Qui", real: 80, estimado: 260 }, { label: "Sex", real: 210, estimado: 370 }, { label: "Sab", real: 215, estimado: 300 }, { label: "Dom", real: 180, estimado: 240 },
];

export default function Analises() {
  const [containerWidth, setContainerWidth] = useState(0);

  const handleLayout = (event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  const chartHeight = 240;
  const leftAxisWidth = 48; 
  const rightPadding = 20;  
  const topPadding = 30;    
  const bottomPadding = 30;
  
  const chartInnerHeight = chartHeight - topPadding - bottomPadding;
  const drawingWidth = Math.max(0, containerWidth - leftAxisWidth - rightPadding);

  const maxFalhasData = Math.max(...falhasPeriodoMock.map((item) => item.value));
  const maxFalhasValue = Math.max(8, Math.ceil(maxFalhasData / 4) * 4);
  const stepFalhas = maxFalhasValue / 4;
  const falhasGridSteps = [0, stepFalhas, stepFalhas * 2, stepFalhas * 3, maxFalhasValue];
  const falhasRowHeight = chartInnerHeight / falhasPeriodoMock.length;
  const barHeight = 16;

  const tempoMax = 25;
  const tempoSteps = [0, 5, 10, 15, 20, 25];

  const aguaMax = 200;
  const aguaSteps = [0, 50, 100, 150, 200];

  const energiaMax = 400;
  const energiaSteps = [0, 100, 200, 300, 400];

  const ref = React.useRef<TriggerRef>(null);

  const { data: pivos } = usePivos();
  const pivosDropdownOptions = useMemo(() => pivos || [], [pivos]);

  const [filtroFazenda, setFiltroFazenda] = useState<string>("todos");
  const [filtroVisaoGeral, setFiltroVisaoGeral] = useState<string>("todos");
  const [filtroFalhas, setFiltroFalhas] = useState<string>("todos");
  const [filtroTempo, setFiltroTempo] = useState<string>("dia");
  const [filtroAgua, setFiltroAgua] = useState<string>("todos");
  const [filtroEnergia, setFiltroEnergia] = useState<string>("todos");

  const [filtroAlerta, setFiltroAlerta] = useState<string>("todos");
  const [filtroLog, setFiltroLog] = useState<string>("todos");
  
  const { data: alertasReais } = useAlertas(filtroAlerta);
  const { data: logsReais } = useLogsEventos(filtroLog);

  // * FORMATAÇÕES BLINDADAS COM CORREÇÃO DE CORES
  const alertasFormatados = useMemo(() => {
    if (!alertasReais) return [];
    return alertasReais.map((log: any) => {
      const dateObj = new Date(log.timestamp);
      const nomeOperador = Array.isArray(log.usuarios) ? log.usuarios[0]?.nome : log.usuarios?.nome;
      const nomePivo = Array.isArray(log.pivos) ? log.pivos[0]?.nome_pivo : log.pivos?.nome_pivo;

      let corTipo = "info"; 
      let iconeTipo = "alerta";

      if (log.tipo_evento === "erro" || log.tipo_evento === "falha") {
        corTipo = "perigo"; 
      } else if (log.tipo_evento === "conclusao") {
        corTipo = "sucesso"; 
      }
      if (log.tipo_evento === "comando" || log.tipo_evento === "sensor") {
        iconeTipo = "gota";
      }

      return {
        id: log.id?.substring(0, 5).toUpperCase() || "-",
        tipo: corTipo,
        icone: iconeTipo,
        evento: log.codigo ? log.codigo.replace(/_/g, " ") : "Alerta do Sistema",
        data: dateObj.toLocaleDateString("pt-BR"),
        hora: dateObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        pivo: nomePivo || log.pivo_id?.substring(0, 5) || "-",
        operador: nomeOperador || "Sistema Autônomo",
      };
    });
  }, [alertasReais]);

  const logsFormatados = useMemo(() => {
    if (!logsReais) return [];
    return logsReais.map((log: any) => {
      const dateObj = new Date(log.timestamp);
      const nomeOperador = Array.isArray(log.usuarios) ? log.usuarios[0]?.nome : log.usuarios?.nome;
      const nomePivo = Array.isArray(log.pivos) ? log.pivos[0]?.nome_pivo : log.pivos?.nome_pivo;

      let eventoTexto = log.tipo_evento;
      if (log.tipo_evento === 'comando') eventoTexto = 'Comando Manual';
      else if (log.tipo_evento === 'pausa_manual') eventoTexto = 'Pausa Manual';
      else if (log.tipo_evento === 'pausa_automatica') eventoTexto = 'Parada Automática';
      else if (['erro', 'alerta', 'falha'].includes(log.tipo_evento)) eventoTexto = 'Anomalia no Sistema';
      else if (log.tipo_evento === 'conclusao') eventoTexto = 'Operação Concluída';
      else if (log.tipo_evento === 'sensor') eventoTexto = 'Leitura de Sensor';

      if (log.codigo) {
        const codigoAmigavel = log.codigo.replace(/_/g, ' '); 
        eventoTexto = `${eventoTexto} (${codigoAmigavel})`;
      }

      return {
        id: log.id?.substring(0, 5).toUpperCase() || "-",
        data: `${dateObj.toLocaleDateString("pt-BR")} ${dateObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`,
        pivo: nomePivo || log.pivo_id?.substring(0, 5) || "-",
        status: log.tipo_evento,
        evento: eventoTexto,
        origem: "Sistema",
        operador: nomeOperador || "Autônomo",
        voltas: "-", irrigacao: "-", milimetros: "-", pressao: "-", tensao: "-", direcao: "-", anguloAtual: "-", percentimetro: "-",
      };
    });
  }, [logsReais]);

  const alertasPreview = useMemo(() => alertasFormatados.slice(0, 10), [alertasFormatados]);
  const logsPreview = useMemo(() => logsFormatados.slice(0, 10), [logsFormatados]);

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

  const colunasLog: TableColumn<any>[] = [
    { key: "id", title: "ID", width: 60 },
    { key: "data", title: "Data", width: 180 },
    { key: "pivo", title: "Pivô", width: 100 },
    { key: "status", title: "Status", width: 90 },
    { key: "evento", title: "Evento", width: 220 },
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

  const colunasAlertas: TableColumn<any>[] = [
    { key: "id", title: "ID", width: 60 },
    {
      key: "tag",
      title: <TriangleAlert size={18} color="white" />,
      width: 60,
      renderCell: (item) => {
        let bgColor = "bg-[#00A0A6]";
        if (item.tipo === "perigo") bgColor = "bg-[#D32F2F]";
        if (item.tipo === "sucesso") bgColor = "bg-[#0AA146]";
        const Icone = item.icone === "gota" ? Droplet : TriangleAlert;
        return (
          <View className={`${bgColor} w-full py-3 items-center justify-center rounded-r-xl`}>
            <Icone size={20} color="white" />
          </View>
        );
      },
    },
    { key: "evento", title: "Evento", width: 260 },
    { key: "data", title: "Data", width: 110 },
    { key: "hora", title: "Hora", width: 80 },
    { key: "pivo", title: "Pivô", width: 100 },
    { key: "operador", title: "Operador", width: 140 },
  ];

  const ConteudoDaTela = (
    <View className="gap-6 w-full pb-4">
      {/* // * Cabeçalho */}
      <View className="gap-1">
        <View className="flex-row w-full justify-between items-center">
          <Header title="Análise" subtitle="AHCX21214BMM" />
          <View className="flex-row gap-2 items-center">
            <Select 
              onOpenChange={setAnaliseOpen}
              onValueChange={(option) => { if (option) setFiltroFazenda(option.value); }}
              defaultValue={{ value: "todos", label: "Todas as Fazendas" }}
            >
              <SelectTrigger
                ref={ref}
                className={`border-[1px] border-[#b8b8b8] bg-white w-[160px] cursor-pointer hover:opacity-90 ${analiseOpen ? "rounded-t-[12px] rounded-b-none border-b-0" : "rounded-[12px] border-b-[1px]"}`}
              >
                <SelectValue placeholder="Fazendas" />
              </SelectTrigger>
              <SelectContent
                insets={contentInsets}
                className={`border-[#b8b8b8] bg-white w-[160px] ${analiseOpen ? "rounded-b-[12px] rounded-t-none" : "rounded-xl"}`}
              >
                <SelectGroup>
                  <SelectItem key="todos" label="Todas as Fazendas" value="todos" className="bg-transparent">
                    Todas as Fazendas
                  </SelectItem>
                  {fazendas?.map((fazenda) => (
                    <SelectItem key={fazenda.value} label={fazenda.label} value={fazenda.value} className={Number(fazenda.id) % 2 !== 0 ? "bg-[#E1E1E1]" : "bg-transparent"}>
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
      </View>

      {/* // * Alertas (Integrado com Banco) */}
      <View className="gap-y-5">
        <View className="flex-row w-full justify-between items-center">
          <Text className="font-outfit-bold text-lg">Alertas Recentes</Text>
          <View className="flex-row gap-2 items-center">
            <Select 
              onOpenChange={setAlertasOpen}
              onValueChange={(option) => { if (option) setFiltroAlerta(option.value); }}
              defaultValue={{ value: "todos", label: "Todos os Pivôs" }}
            >
              <SelectTrigger
                ref={ref}
                className={`border-[1px] border-[#b8b8b8] bg-white h-[40px] w-[140px] cursor-pointer hover:opacity-90 ${alertasOpen ? "rounded-t-[12px] rounded-b-none border-b-0" : "rounded-[12px] border-b-[1px]"}`}
              >
                <SelectValue placeholder="Pivô" />
              </SelectTrigger>
              <SelectContent
                insets={contentInsets}
                className={`border-[#b8b8b8] bg-white w-[140px] ${alertasOpen ? "rounded-b-[12px] rounded-t-none" : "rounded-xl"}`}
              >
                <SelectGroup>
                  <SelectItem key="todos" label="Todos os Pivôs" value="todos" className="bg-transparent">
                    Todos os Pivôs
                  </SelectItem>
                  {pivosDropdownOptions.map((pivo, index) => (
                    <SelectItem key={pivo.id} label={pivo.nome_pivo} value={pivo.id} className={index % 2 === 0 ? "bg-[#E1E1E1]" : "bg-transparent"}>
                      {pivo.nome_pivo}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </View>
        </View>

        {/* 👉 BOTÃO ADICIONADO PARA A TELA CHEIA (Alertas) */}
        <Button
          className="rounded-md w-full bg-secundaria-azul h-[40px] px-3 active:opacity-70"
          onPress={() => router.push({ pathname: "/(tabs)/analise/analiseAlertas" } as any)}
        >
          <Text className="text-white font-outfit-medium">Ver Tabela Completa</Text>
        </Button>

        <Table data={alertasPreview} columns={colunasAlertas} alerta/>
      </View>

      {/* // * Visão Geral */}
      <View className="self-stretch gap-5 mt-4">
        <View className="flex-row w-full justify-between items-center">
          <Text className="font-outfit-bold text-lg">Visão Geral</Text>
          <View className="flex-row gap-2 items-center">
            <Select 
              onOpenChange={setGeralOpen}
              onValueChange={(option) => { if (option) setFiltroVisaoGeral(option.value); }}
              defaultValue={{ value: "todos", label: "Todos os Pivôs" }}
            >
              <SelectTrigger
                ref={ref}
                className={`border-[1px] border-[#b8b8b8] bg-white w-[140px] cursor-pointer hover:opacity-90 ${geralOpen ? "rounded-t-[12px] rounded-b-none border-b-0" : "rounded-[12px] border-b-[1px]"}`}
              >
                <SelectValue placeholder="Pivô" />
              </SelectTrigger>
              <SelectContent
                insets={contentInsets}
                className={`border-[#b8b8b8] bg-white w-[140px] ${geralOpen ? "rounded-b-[12px] rounded-t-none" : "rounded-xl"}`}
              >
                <SelectGroup>
                  <SelectItem key="todos" label="Todos os Pivôs" value="todos" className="bg-transparent">
                    Todos os Pivôs
                  </SelectItem>
                  {pivosDropdownOptions.map((pivo, index) => (
                    <SelectItem key={pivo.id} label={pivo.nome_pivo} value={pivo.id} className={index % 2 === 0 ? "bg-[#E1E1E1]" : "bg-transparent"}>
                      {pivo.nome_pivo}
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
            <Text className="font-outfit text-texto text-sm">Área Total Irrigada:</Text>
          </View>
          <Text className="font-outfit-bold">342 Ha</Text>
        </View>
        <View className="flex-row justify-between items-center gap-2">
          <View className="flex-row items-center gap-2">
            <Droplet size={20} color="#0D0D0D" strokeWidth={2.5} />
            <Text className="font-outfit text-texto text-sm">Consumo Total de Água:</Text>
          </View>
          <Text className="font-outfit-bold">120.582 L</Text>
        </View>
        <View className="flex-row justify-between items-center gap-2">
          <View className="flex-row items-center gap-2">
            <Zap size={20} color="#0D0D0D" strokeWidth={2.5} />
            <Text className="font-outfit text-texto text-sm">Consumo Total de Energia:</Text>
          </View>
          <Text className="font-outfit-bold">584 KWh</Text>
        </View>
        <View className="flex-row justify-between items-center gap-2">
          <View className="flex-row items-center gap-2">
            <Clock size={20} color="#0D0D0D" strokeWidth={2.5} />
            <Text className="font-outfit text-texto text-sm">Tempo Médio de Operação:</Text>
          </View>
          <Text className="font-outfit-bold">18 h 25 min</Text>
        </View>
      </View>

      <Separator className="my-2 bg-[#B5B5B5]" decorative />

      {/* GRÁFICO 1 */}
      <View className="self-stretch gap-5">
        <View className="flex-row w-full justify-between items-center">
          <Text className="font-outfit-bold text-wrap w-[140px]">Quantidade de Falhas por Período</Text>
          <View className="flex-row gap-2 items-center">
            <Select 
              onOpenChange={setFalhasOpen}
              onValueChange={(option) => { if (option) setFiltroFalhas(option.value); }}
              defaultValue={{ value: "todos", label: "Todos os Pivôs" }}
            >
              <SelectTrigger
                ref={ref}
                className={`border-[1px] border-[#b8b8b8] bg-white w-[140px] cursor-pointer hover:opacity-90 ${falhasOpen ? "rounded-t-[12px] rounded-b-none border-b-0" : "rounded-[12px] border-b-[1px]"}`}
              >
                <SelectValue placeholder="Pivô" />
              </SelectTrigger>
              <SelectContent
                insets={contentInsets}
                className={`border-[#b8b8b8] bg-white w-[140px] ${falhasOpen ? "rounded-b-[12px] rounded-t-none" : "rounded-xl"}`}
              >
                <SelectGroup>
                  <SelectItem key="todos" label="Todos os Pivôs" value="todos" className="bg-transparent">
                    Todos os Pivôs
                  </SelectItem>
                  {pivosDropdownOptions.map((pivo, index) => (
                    <SelectItem key={pivo.id} label={pivo.nome_pivo} value={pivo.id} className={index % 2 === 0 ? "bg-[#E1E1E1]" : "bg-transparent"}>
                      {pivo.nome_pivo}
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

        <View onLayout={handleLayout} className="bg-white border-[2px] border-[#cacaca] rounded-[12px] w-full overflow-hidden">
          {(containerWidth > 0 || Platform.OS === 'web') && (
            <Svg width={containerWidth || "100%"} height={chartHeight}>
              {falhasGridSteps.map((currentStep) => {
                const xPos = leftAxisWidth + (currentStep / maxFalhasValue) * drawingWidth;
                return (
                  <G key={`grid-${currentStep}`}>
                    <Line x1={xPos} y1={topPadding} x2={xPos} y2={chartHeight - bottomPadding} stroke="#DBDEE4" strokeWidth="1" />
                    <SvgText x={xPos} y={chartHeight - bottomPadding + 20} fill="#0D0D0D" fontSize="12" fontFamily="Outfit_400Regular" textAnchor="middle">{currentStep}</SvgText>
                  </G>
                );
              })}
              {falhasPeriodoMock.map((item, index) => {
                const barWidth = (item.value / maxFalhasValue) * drawingWidth;
                const rowCenterY = topPadding + index * falhasRowHeight + falhasRowHeight / 2;
                const barY = rowCenterY - barHeight / 2;

                return (
                  <G key={`bar-${item.label}`}>
                    <SvgText x={leftAxisWidth - 10} y={rowCenterY + 4} fill="#0D0D0D" fontSize="12" fontFamily="Outfit_400Regular" textAnchor="end">{item.label}</SvgText>
                    <Rect x={leftAxisWidth} y={barY} width={barWidth} height={barHeight} rx={4} fill="#00A0A6" />
                    <Rect x={leftAxisWidth} y={barY} width={Math.min(4, barWidth)} height={barHeight} fill="#00A0A6" />
                    <SvgText x={leftAxisWidth + barWidth + 4} y={rowCenterY + 4} fill="#0D0D0D" fontSize="12" fontFamily="Outfit_700Bold" color="#666666" textAnchor="start">{item.value}</SvgText>
                  </G>
                );
              })}
              <Line x1={leftAxisWidth} y1={topPadding} x2={leftAxisWidth} y2={chartHeight - bottomPadding + 4} stroke="#0D0D0D" strokeWidth="0.5" />
            </Svg>
          )}
        </View>
      </View>

      <Separator className="my-2 bg-[#B5B5B5]" decorative />

      {/* GRÁFICO 2 */}
      <View className="self-stretch gap-5">
        <View className="flex-row w-full justify-between items-center">
          <Text className="font-outfit-bold">Tempo de Operação</Text>
          <View className="flex-row gap-2 items-center">
            <Select 
              onOpenChange={setTempoOpen}
              onValueChange={(option) => { if (option) setFiltroTempo(option.value); }}
              defaultValue={{ value: "dia", label: "Dia" }}
            >
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
              {tempoSteps.map((currentStep) => {
                const yPos = topPadding + chartInnerHeight - (currentStep / tempoMax) * chartInnerHeight;
                return (
                  <G key={`grid-h-${currentStep}`}>
                    <Line x1={leftAxisWidth} y1={yPos} x2={leftAxisWidth + drawingWidth} y2={yPos} stroke="#CACACA" strokeWidth="1" />
                    <SvgText x={leftAxisWidth - 10} y={yPos + 4} fill="#0D0D0D" fontSize="12" fontFamily="Outfit_400Regular" textAnchor="end">{currentStep}</SvgText>
                  </G>
                );
              })}
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
                    <SvgText x={xCenter} y={yPos - 6} fill="#666666" fontSize="12" fontFamily="Outfit_700Bold" textAnchor="middle">{item.value}</SvgText>
                    <SvgText x={xCenter} y={chartHeight - bottomPadding + 20} fill="#0D0D0D" fontSize="12" fontFamily="Outfit_400Regular" textAnchor="middle">{item.label}</SvgText>
                  </G>
                );
              })}
              <Line x1={leftAxisWidth} y1={topPadding + chartInnerHeight} x2={leftAxisWidth + drawingWidth} y2={topPadding + chartInnerHeight} stroke="#0D0D0D" strokeWidth="1" />
            </Svg>
          )}
          <Text className="text-xs font-outfit-bold text-center mt-2">Pivôs</Text>
        </View>
      </View>

      <Separator className="my-2 bg-[#B5B5B5]" decorative />

      {/* GRÁFICO 3 */}
      <View className="self-stretch gap-5">
        <View className="flex-row w-full justify-between items-center">
          <Text className="font-outfit-bold text-wrap w-[140px]">Consumo de Água por Hora</Text>
          <View className="flex-row gap-2 items-center">
            <Select 
              onOpenChange={setAguaOpen}
              onValueChange={(option) => { if (option) setFiltroAgua(option.value); }}
              defaultValue={{ value: "todos", label: "Todos os Pivôs" }}
            >
              <SelectTrigger
                ref={ref}
                className={`border-[1px] border-[#b8b8b8] bg-white w-[140px] cursor-pointer hover:opacity-90 ${aguaOpen ? "rounded-t-[12px] rounded-b-none border-b-0" : "rounded-[12px] border-b-[1px]"}`}
              >
                <SelectValue placeholder="Pivô" />
              </SelectTrigger>
              <SelectContent
                insets={contentInsets}
                className={`border-[#b8b8b8] bg-white w-[140px] ${aguaOpen ? "rounded-b-[12px] rounded-t-none" : "rounded-xl"}`}
              >
                <SelectGroup>
                  <SelectItem key="todos" label="Todos os Pivôs" value="todos" className="bg-transparent">
                    Todos os Pivôs
                  </SelectItem>
                  {pivosDropdownOptions.map((pivo, index) => (
                    <SelectItem key={pivo.id} label={pivo.nome_pivo} value={pivo.id} className={index % 2 === 0 ? "bg-[#E1E1E1]" : "bg-transparent"}>
                      {pivo.nome_pivo}
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
              {aguaSteps.map((currentStep) => {
                const yPos = topPadding + chartInnerHeight - (currentStep / aguaMax) * chartInnerHeight;
                return (
                  <G key={`grid-h-agua-${currentStep}`}>
                    <Line x1={leftAxisWidth} y1={yPos} x2={leftAxisWidth + drawingWidth} y2={yPos} stroke="#CACACA" strokeWidth="1" />
                    <SvgText x={leftAxisWidth - 10} y={yPos + 4} fill="#0D0D0D" fontSize="12" fontFamily="Outfit_400Regular" textAnchor="end">{currentStep}</SvgText>
                  </G>
                );
              })}
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
                    <SvgText x={xCenter} y={yPos - 6} fill="#666666" fontSize="12" fontFamily="Outfit_700Bold" textAnchor="middle">{item.value}</SvgText>
                    <SvgText x={xCenter} y={chartHeight - bottomPadding + 20} fill="#0D0D0D" fontSize="12" fontFamily="Outfit_400Regular" textAnchor="middle">{item.label}</SvgText>
                  </G>
                );
              })}
              <Line x1={leftAxisWidth} y1={topPadding + chartInnerHeight} x2={leftAxisWidth + drawingWidth} y2={topPadding + chartInnerHeight} stroke="#0D0D0D" strokeWidth="1" />
            </Svg>
          )}
        </View>
      </View>

      <Separator className="my-2 bg-[#B5B5B5]" decorative />

      {/* GRÁFICO 4 */}
      <View className="self-stretch gap-5">
        <View className="flex-row w-full justify-between items-center">
          <Text className="font-outfit-bold text-wrap">Consumo de Energia</Text>
          <View className="flex-row gap-2 items-center">
            <Select 
              onOpenChange={setEnergiaOpen}
              onValueChange={(option) => { if (option) setFiltroEnergia(option.value); }}
              defaultValue={{ value: "todos", label: "Todos os Pivôs" }}
            >
              <SelectTrigger
                ref={ref}
                className={`border-[1px] border-[#b8b8b8] bg-white w-[140px] cursor-pointer hover:opacity-90 ${energiaOpen ? "rounded-t-[12px] rounded-b-none border-b-0" : "rounded-[12px] border-b-[1px]"}`}
              >
                <SelectValue placeholder="Pivô" />
              </SelectTrigger>
              <SelectContent
                insets={contentInsets}
                className={`border-[#b8b8b8] bg-white w-[140px] ${energiaOpen ? "rounded-b-[12px] rounded-t-none" : "rounded-xl"}`}
              >
                <SelectGroup>
                  <SelectItem key="todos" label="Todos os Pivôs" value="todos" className="bg-transparent">
                    Todos os Pivôs
                  </SelectItem>
                  {pivosDropdownOptions.map((pivo, index) => (
                    <SelectItem key={pivo.id} label={pivo.nome_pivo} value={pivo.id} className={index % 2 === 0 ? "bg-[#E1E1E1]" : "bg-transparent"}>
                      {pivo.nome_pivo}
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
          <View className="flex-row justify-between items-center mb-6 pl-1">
            <Text className="text-xs font-outfit-bold text-texto">KWh</Text>
            <View className="flex-row items-center gap-4 pr-2">
              <View className="flex-row items-center gap-1.5"><View className="w-6 h-4 rounded-full bg-primaria-azul" /><Text className="text-xs">Real</Text></View>
              <View className="flex-row items-center gap-1.5"><View className="w-6 h-4 rounded-full bg-primaria-verde" /><Text className="text-xs">Estimado</Text></View>
            </View>
          </View>

          {(containerWidth > 0 || Platform.OS === 'web') && (
            <Svg width={containerWidth || "100%"} height={chartHeight}>
              {energiaSteps.map((currentStep) => {
                const yPos = topPadding + chartInnerHeight - (currentStep / energiaMax) * chartInnerHeight;
                return (
                  <G key={`grid-h-ene-${currentStep}`}>
                    <Line x1={leftAxisWidth} y1={yPos} x2={leftAxisWidth + drawingWidth} y2={yPos} stroke="#CACACA" strokeWidth="1" />
                    <SvgText x={leftAxisWidth - 10} y={yPos + 4} fill="#0D0D0D" fontSize="12" fontFamily="Outfit_400Regular" textAnchor="end">{currentStep}</SvgText>
                  </G>
                );
              })}
              <Path
                d={`M ${consumoEnergiaMock.map((item, i) => {
                  const stepX = drawingWidth / consumoEnergiaMock.length;
                  const x = leftAxisWidth + i * stepX + stepX / 2;
                  const y = topPadding + chartInnerHeight - (item.real / energiaMax) * chartInnerHeight;
                  return `${x} ${y}`;
                }).join(" L ")}`}
                fill="none" stroke="#00A0A6" strokeWidth="2"
              />
              <Path
                d={`M ${consumoEnergiaMock.map((item, i) => {
                  const stepX = drawingWidth / consumoEnergiaMock.length;
                  const x = leftAxisWidth + i * stepX + stepX / 2;
                  const y = topPadding + chartInnerHeight - (item.estimado / energiaMax) * chartInnerHeight;
                  return `${x} ${y}`;
                }).join(" L ")}`}
                fill="none" stroke="#0AA146" strokeWidth="2"
              />
              {consumoEnergiaMock.map((item, index) => {
                const stepX = drawingWidth / consumoEnergiaMock.length;
                const xPos = leftAxisWidth + index * stepX + stepX / 2;
                const yReal = topPadding + chartInnerHeight - (item.real / energiaMax) * chartInnerHeight;
                const yEstimado = topPadding + chartInnerHeight - (item.estimado / energiaMax) * chartInnerHeight;
                const isRealMaior = item.real >= item.estimado;
                const txtYReal = isRealMaior || item.real === 0 ? yReal - 10 : yReal + 16;
                const txtYEstimado = !isRealMaior || item.estimado === 0 ? yEstimado - 10 : yEstimado + 16;

                return (
                  <G key={`points-ene-${item.label}`}>
                    <SvgText x={xPos} y={chartHeight - bottomPadding + 20} fill="#0D0D0D" fontSize="12" fontFamily="Outfit_400Regular" textAnchor="middle">{item.label}</SvgText>
                    <Circle cx={xPos} cy={yReal} r={4} fill="#FFFFFF" stroke="#00A0A6" strokeWidth={2} />
                    <SvgText x={xPos} y={txtYReal} fill="#00A0A6" fontSize="10" fontFamily="Outfit_700Bold" textAnchor="middle">{item.real}</SvgText>
                    <Circle cx={xPos} cy={yEstimado} r={4} fill="#FFFFFF" stroke="#0AA146" strokeWidth={2} />
                    <SvgText x={xPos} y={txtYEstimado} fill="#0AA146" fontSize="10" fontFamily="Outfit_700Bold" textAnchor="middle">{item.estimado}</SvgText>
                  </G>
                );
              })}
              <Line x1={leftAxisWidth} y1={topPadding + chartInnerHeight} x2={leftAxisWidth + drawingWidth} y2={topPadding + chartInnerHeight} stroke="#0D0D0D" strokeWidth="1" />
            </Svg>
          )}
        </View>
      </View>

      <Separator className="my-2 bg-[#B5B5B5]" decorative />

      {/* // * Log (Integrado com Banco) */}
      <View className="gap-y-5 mt-2 w-full">
        <View className="flex-row w-full justify-between items-center">
          <Text className="font-outfit-bold text-lg">Histórico (Logs)</Text>
          <View className="flex-row gap-2 items-center">
            <Select 
              onOpenChange={setLogOpen}
              onValueChange={(option) => { if (option) setFiltroLog(option.value); }}
              defaultValue={{ value: "todos", label: "Todos os Pivôs" }}
            >
              <SelectTrigger
                ref={ref}
                className={`border-[1px] border-[#b8b8b8] bg-white h-[40px] w-[140px] cursor-pointer hover:opacity-90 ${logOpen ? "rounded-t-[12px] rounded-b-none border-b-0" : "rounded-[12px] border-b-[1px]"}`}
              >
                <SelectValue placeholder="Todos os Pivôs" />
              </SelectTrigger>
              <SelectContent
                insets={contentInsets}
                className={`border-[#b8b8b8] bg-white w-[140px] ${logOpen ? "rounded-b-[12px] rounded-t-none" : "rounded-xl"}`}
              >
                <SelectGroup>
                  <SelectItem key="todos" label="Todos os Pivôs" value="todos" className="bg-transparent">
                    Todos os Pivôs
                  </SelectItem>
                  {pivosDropdownOptions.map((pivo, index) => (
                    <SelectItem key={pivo.id} label={pivo.nome_pivo} value={pivo.id} className={index % 2 === 0 ? "bg-[#E1E1E1]" : "bg-transparent"}>
                      {pivo.nome_pivo}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </View>
        </View>

        {/* 👉 BOTÃO ADICIONADO PARA A TELA CHEIA (Logs) */}
        <Button
          className="rounded-md w-full bg-secundaria-azul h-[40px] px-3 active:opacity-70"
          onPress={() => router.push({ pathname: "/(tabs)/analise/analiseLogs" } as any)}
        >
          <Text className="text-white font-outfit-medium">Ver Tabela Completa</Text>
        </Button>

        <Table data={logsPreview} columns={colunasLog} />
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