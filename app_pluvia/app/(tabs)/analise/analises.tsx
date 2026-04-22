import * as React from "react";
import { useState } from "react";
import { View, Platform, Pressable } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useRouter, type Href } from "expo-router";
import { FlashList } from "@shopify/flash-list"; // <-- Importação da FlashList
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TriggerRef } from "@rn-primitives/select";
import Header from "@/components/custom/Header";
import { Screen } from "@/components/custom/Screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
} from "lucide-react-native";
import { Separator } from "@/components/ui/separator";

// --- DADOS MOCKADOS PARA OS GRÁFICOS E SELECTS ---
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

export default function Analises() {
  const ref = React.useRef<TriggerRef>(null);
  const [open, setOpen] = useState(false); // ATENÇÃO: Esse estado está controlando todos os selects ao mesmo tempo.

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

  // Guardamos todo o seu conteúdo dentro desta variável para injetar no cabeçalho da lista
  const ConteudoDaTela = (
    <View className="gap-6 pt-4">
      {/* // * Cabeçalho */}
      <View className="flex-row w-full justify-between items-center">
        <Header title="Análise" subtitle="AHCX21214BMM" />
        <View className="flex-row gap-2 items-center">
          <Select onOpenChange={setOpen}>
            <SelectTrigger
              ref={ref}
              className={`border-[1px] border-[#b8b8b8] bg-white w-[120px] ${open ? "rounded-t-[12px] rounded-b-none border-b-0" : "rounded-[12px]"}`}
            >
              <SelectValue placeholder="Fazendas" />
            </SelectTrigger>
            <SelectContent
              insets={contentInsets}
              className={`border-[#b8b8b8] bg-white w-[120px] ${open ? "rounded-b-[12px] rounded-t-none" : "rounded-xl"}`}
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

      {/* // * Alertas */}
      <View className="flex-row w-full justify-between items-center">
        <Text className="font-outfit-bold">Alertas</Text>
        <View className="flex-row gap-2 items-center">
          <Select onOpenChange={setOpen}>
            <SelectTrigger
              ref={ref}
              className={`border-[1px] border-[#b8b8b8] bg-white w-[100px] ${open ? "rounded-t-[12px] rounded-b-none border-b-0" : "rounded-[12px]"}`}
            >
              <SelectValue placeholder="Pivô" />
            </SelectTrigger>
            <SelectContent
              insets={contentInsets}
              className={`border-[#b8b8b8] bg-white w-[100px] ${open ? "rounded-b-[12px] rounded-t-none" : "rounded-xl"}`}
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

      {/* // * Placeholder */}
      <View className="py-10 px-5 bg-gray-100 rounded-xl border border-dashed border-gray-400 items-center justify-center">
        <Text className="text-gray-500 font-outfit-medium text-center">
          [ Placeholder de Tabela ]
        </Text>
      </View>

      {/* // * Visão Geral */}
      <View className="self-stretch gap-5">
        <View className="flex-row w-full justify-between items-center">
          <Text className="font-outfit-bold">Visão Geral</Text>
          <View className="flex-row gap-2 items-center">
            <Select onOpenChange={setOpen}>
              <SelectTrigger
                ref={ref}
                className={`border-[1px] border-[#b8b8b8] bg-white w-[100px] ${open ? "rounded-t-[12px] rounded-b-none border-b-0" : "rounded-[12px]"}`}
              >
                <SelectValue placeholder="Pivô" />
              </SelectTrigger>
              <SelectContent
                insets={contentInsets}
                className={`border-[#b8b8b8] bg-white w-[100px] ${open ? "rounded-b-[12px] rounded-t-none" : "rounded-xl"}`}
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
            <Select onOpenChange={setOpen}>
              <SelectTrigger
                ref={ref}
                className={`border-[1px] border-[#b8b8b8] bg-white w-[120px] ${open ? "rounded-t-[12px] rounded-b-none border-b-0" : "rounded-[12px]"}`}
              >
                <SelectValue placeholder="Tempo" />
              </SelectTrigger>
              <SelectContent
                insets={contentInsets}
                className={`border-[#b8b8b8] bg-white w-[120px] ${open ? "rounded-b-[12px] rounded-t-none" : "rounded-xl"}`}
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
        <View className="py-10 px-5 bg-gray-100 rounded-xl border border-dashed border-gray-400 items-center justify-center">
          <Text className="text-gray-500 font-outfit-medium text-center">
            [ Placeholder de Gráfico de Barras ]
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
            <Select onOpenChange={setOpen}>
              <SelectTrigger
                ref={ref}
                className={`border-[1px] border-[#b8b8b8] bg-white w-[100px] ${open ? "rounded-t-[12px] rounded-b-none border-b-0" : "rounded-[12px]"}`}
              >
                <SelectValue placeholder="Pivô" />
              </SelectTrigger>
              <SelectContent
                insets={contentInsets}
                className={`border-[#b8b8b8] bg-white w-[100px] ${open ? "rounded-b-[12px] rounded-t-none" : "rounded-xl"}`}
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
        <View className="py-10 px-5 bg-gray-100 rounded-xl border border-dashed border-gray-400 items-center justify-center">
          <Text className="text-gray-500 font-outfit-medium text-center">
            [ Placeholder de Gráfico de Barras ]
          </Text>
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
            <Select onOpenChange={setOpen}>
              <SelectTrigger
                ref={ref}
                className={`border-[1px] border-[#b8b8b8] bg-white w-[100px] ${open ? "rounded-t-[12px] rounded-b-none border-b-0" : "rounded-[12px]"}`}
              >
                <SelectValue placeholder="Pivô" />
              </SelectTrigger>
              <SelectContent
                insets={contentInsets}
                className={`border-[#b8b8b8] bg-white w-[100px] ${open ? "rounded-b-[12px] rounded-t-none" : "rounded-xl"}`}
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
        <View className="py-10 px-5 bg-gray-100 rounded-xl border border-dashed border-gray-400 items-center justify-center">
          <Text className="text-gray-500 font-outfit-medium text-center">
            [ Placeholder de Gráfico de Barras ]
          </Text>
        </View>
      </View>

      <Separator className="my-2 bg-[#B5B5B5]" decorative />

      {/* // * Consumo de Energia */}
      <View className="self-stretch gap-5">
        <View className="flex-row w-full justify-between items-center">
          <Text className="font-outfit-bold text-wrap">Consumo de Energia</Text>
          <View className="flex-row gap-2 items-center">
            <Select onOpenChange={setOpen}>
              <SelectTrigger
                ref={ref}
                className={`border-[1px] border-[#b8b8b8] bg-white w-[100px] ${open ? "rounded-t-[12px] rounded-b-none border-b-0" : "rounded-[12px]"}`}
              >
                <SelectValue placeholder="Pivô" />
              </SelectTrigger>
              <SelectContent
                insets={contentInsets}
                className={`border-[#b8b8b8] bg-white w-[100px] ${open ? "rounded-b-[12px] rounded-t-none" : "rounded-xl"}`}
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
        <View className="py-10 px-5 bg-gray-100 rounded-xl border border-dashed border-gray-400 items-center justify-center">
          <Text className="text-gray-500 font-outfit-medium text-center">
            [ Placeholder de Gráfico ]
          </Text>
        </View>
      </View>

      <Separator className="my-2 bg-[#B5B5B5]" decorative />

      {/* // * Log */}
      <View className="self-stretch gap-5">
        <View className="flex-row w-full justify-between items-center">
          <Text className="font-outfit-bold text-wrap">Log</Text>
          <View className="flex-row gap-2 items-center">
            <Select onOpenChange={setOpen}>
              <SelectTrigger
                ref={ref}
                className={`border-[1px] border-[#b8b8b8] bg-white w-[100px] ${open ? "rounded-t-[12px] rounded-b-none border-b-0" : "rounded-[12px]"}`}
              >
                <SelectValue placeholder="Pivô" />
              </SelectTrigger>
              <SelectContent
                insets={contentInsets}
                className={`border-[#b8b8b8] bg-white w-[100px] ${open ? "rounded-b-[12px] rounded-t-none" : "rounded-xl"}`}
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
        <View className="py-10 px-5 bg-gray-100 rounded-xl border border-dashed border-gray-400 items-center justify-center">
          <Text className="text-gray-500 font-outfit-medium text-center">
            [ Placeholder de Tabela ]
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <Screen className="flex-1 px-0">
      <FlashList
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={ConteudoDaTela}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      />

      {/* // * Botões de Ação */}
      <View className="gap-3 mt-4">
        <Button
          variant="destructive"
          className="w-full"
          onPress={() => router.replace("/" as Href)}
        >
          <Text>Sair (Voltar pro Login)</Text>
        </Button>
        <Button
          className="w-full"
          onPress={() => router.replace("/(tabs)/pivos")}
        >
          <Text>Ir para pivôs</Text>
        </Button>
        <Button
          className="w-full"
          onPress={() => router.replace("/(tabs)/menu")}
        >
          <Text>Ir para Menu</Text>
        </Button>
      </View>
    </Screen>
  );
}
