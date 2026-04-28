import * as React from "react";
import { useState } from "react";
import { Pressable, View, Platform } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { Screen } from "@/components/custom/Screen";
import { Separator } from "@/components/ui/separator";
import {
  Tractor,
  Plus,
  Users,
  CircleGauge,
  TriangleAlert,
  Droplet,
} from "lucide-react-native";
import { Table, TableColumn } from "@/components/custom/Table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TriggerRef } from "@rn-primitives/select";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// * SELECTS
const pivos = [
  { id: 1, label: "Todos", value: "todos" },
  { id: 2, label: "Pivô 1", value: "pivo_1" },
  { id: 3, label: "Pivô 2", value: "pivo_2" },
  { id: 4, label: "Pivô 3", value: "pivo_3" },
];

// * Mocks de tabelas
export const usuariosMock = [
  {
    id: "01",
    nome: "Renan da Towner Azul",
    cpfCnpj: "00.000.000/0000-00",
    email: "Exemplo@gmail.com",
    telefone: "(99) 9 9999-9999",
  },
  {
    id: "02",
    nome: "Renan da Towner Azul",
    cpfCnpj: "00.000.000/0000-00",
    email: "Exemplo@gmail.com",
    telefone: "(99) 9 9999-9999",
  },
  {
    id: "03",
    nome: "Renan da Towner Azul",
    cpfCnpj: "00.000.000/0000-00",
    email: "Exemplo@gmail.com",
    telefone: "(99) 9 9999-9999",
  },
  {
    id: "04",
    nome: "Renan da Towner Azul",
    cpfCnpj: "00.000.000/0000-00",
    email: "Exemplo@gmail.com",
    telefone: "(99) 9 9999-9999",
  },
];

export const fazendasMock = [
  {
    id: "01",
    nome: "Fazenda Santa Tereza",
    codigo: "FZ-001",
    endereco: "Rodovia MG-354, Km 12",
    coordenadas: "-18.4184, -46.4181",
    cidade: "Presidente Olegário",
    estado: "MG",
    areaTotal: "1500 Ha",
    cultura: "Soja",
  },
  {
    id: "02",
    nome: "Fazenda Boa Vista",
    codigo: "FZ-002",
    endereco: "Estrada da Prata, S/N",
    coordenadas: "-18.3991, -46.4300",
    cidade: "Presidente Olegário",
    estado: "MG",
    areaTotal: "850 Ha",
    cultura: "Milho",
  },
  {
    id: "03",
    nome: "Sítio Recanto",
    codigo: "FZ-003",
    endereco: "Zona Rural",
    coordenadas: "-18.5921, -46.5198",
    cidade: "Patos de Minas",
    estado: "MG",
    areaTotal: "320 Ha",
    cultura: "Feijão",
  },
];

export const pivosMock = [
  {
    id: "01",
    fazenda: "Fazenda Santa Tereza",
    nome: "Pivô Central 01",
    codigoSerie: "AXCP2134HIM",
    idDelta: "DLT-9921",
    marca: "Valley",
    modelo: "8000 Series",
    vazao: "120 L/s",
    raio: "400 m",
    coordenadas: "-18.4184, -46.4181",
  },
  {
    id: "02",
    fazenda: "Fazenda Boa Vista",
    nome: "Pivô Sul",
    codigoSerie: "BXCP9982JKL",
    idDelta: "DLT-9922",
    marca: "Zimmatic",
    modelo: "9500P",
    vazao: "95 L/s",
    raio: "350 m",
    coordenadas: "-18.3991, -46.4300",
  },
  {
    id: "03",
    fazenda: "Fazenda Santa Tereza",
    nome: "Pivô Leste",
    codigoSerie: "CXCP1122QWE",
    idDelta: "DLT-9923",
    marca: "Valley",
    modelo: "8000 Series",
    vazao: "150 L/s",
    raio: "500 m",
    coordenadas: "-18.4200, -46.4150",
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

const colunasUsuarios: TableColumn<(typeof usuariosMock)[0]>[] = [
  { key: "id", title: "ID", width: 60 },
  { key: "nome", title: "Nome", width: 220 }, // Mais largo para nomes completos
  { key: "cpfCnpj", title: "CPF/CNPJ", width: 170 },
  { key: "email", title: "E-mail", width: 200 },
  { key: "telefone", title: "Telefone", width: 150 },
];

const colunasFazendas: TableColumn<(typeof fazendasMock)[0]>[] = [
  { key: "id", title: "ID", width: 60 },
  { key: "nome", title: "Nome", width: 190 },
  { key: "codigo", title: "Código", width: 90 },
  { key: "endereco", title: "Endereço", width: 220 },
  { key: "coordenadas", title: "Coordenadas", width: 160 },
  { key: "cidade", title: "Cidade", width: 160 },
  { key: "estado", title: "Estado", width: 80 },
  { key: "areaTotal", title: "Área Total", width: 110 },
  { key: "cultura", title: "Cultura", width: 120 },
];

export const colunasPivos: TableColumn<(typeof pivosMock)[0]>[] = [
  { key: "id", title: "ID", width: 60 },
  { key: "fazenda", title: "Fazenda", width: 190 },
  { key: "nome", title: "Nome", width: 140 },
  { key: "codigoSerie", title: "Nº Série", width: 140 },
  { key: "idDelta", title: "ID Delta", width: 110 },
  { key: "marca", title: "Marca", width: 110 },
  { key: "modelo", title: "Modelo", width: 120 },
  { key: "vazao", title: "Vazão Nominal", width: 130 },
  { key: "raio", title: "Raio", width: 90 },
  { key: "coordenadas", title: "Coordenadas", width: 160 },
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

export default function Menu() {
  const ref = React.useRef<TriggerRef>(null);
  const router = useRouter();
  const [tabValue, setTabValue] = React.useState("usuarios");
  const [alertasOpen, setAlertasOpen] = useState(false);

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

  const ConteudoDaTela = (
    <View className="items-center justify-center gap-6">
      {/* // * Tabelas de Usuários, Pivôs e Fazendas */}

      <View className="w-full">
        <Tabs
          value={tabValue}
          onValueChange={setTabValue}
          className="w-full overflow-scroll"
        >
          <TabsList className="gap-2">
            <TabsTrigger
              value="usuarios"
              className="flex-1 border-2 border-primaria-azul rounded-xl"
            >
              <Text>Usuários</Text>
            </TabsTrigger>
            <TabsTrigger
              value="fazendas"
              className="flex-1 border-2 border-primaria-azul rounded-xl"
            >
              <Text>Fazendas</Text>
            </TabsTrigger>
            <TabsTrigger
              value="pivos"
              className="flex-1 border-2 border-primaria-azul rounded-xl"
            >
              <Text>Pivôs</Text>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="usuarios">
            <Table columns={colunasUsuarios} data={usuariosMock} />
          </TabsContent>
          <TabsContent value="fazendas">
            <Table columns={colunasFazendas} data={fazendasMock} />
          </TabsContent>
          <TabsContent value="pivos">
            <Table columns={colunasPivos} data={pivosMock} />
          </TabsContent>
        </Tabs>
      </View>

      {/* // * Botões de Cadastro */}
      <View className="gap-4">
        <Button
          className="bg-primaria-azul w-full h-[40px] flex-row justify-between rounded-none rounded-pluvia pr-0 active:opacity-80 overflow-hidden"
          onPress={() => router.replace("/(tabs)/menu/addUsuario")}
        >
          <View className="flex-row gap-4">
            <Users size={24} color="white" />
            <Text className="text-white text-base">Cadastrar Usuário</Text>
          </View>
          <Pressable className="rounded-bl-[12px] bg-secundaria-azul w-[40px] h-[40px] items-center justify-center">
            <Plus size={24} strokeWidth={2.5} color="white" />
          </Pressable>
        </Button>

        <Button
          className="bg-primaria-azul w-full h-[40px] flex-row justify-between rounded-none rounded-pluvia pr-0 active:opacity-50 overflow-hidden"
          onPress={() => router.replace("/(tabs)/menu/addFazenda")}
        >
          <View className="flex-row gap-4">
            <Tractor size={24} color="white" />
            <Text className="text-white text-base">Cadastrar Fazenda</Text>
          </View>
          <Pressable className="rounded-bl-[12px] bg-secundaria-azul w-[40px] h-[40px] items-center justify-center">
            <Plus size={24} strokeWidth={2.5} color="white" />
          </Pressable>
        </Button>

        <Button
          className="bg-primaria-azul w-full h-[40px] flex-row justify-between rounded-none rounded-pluvia pr-0 active:opacity-50 overflow-hidden"
          onPress={() => router.replace("/(tabs)/menu/addPivo")}
        >
          <View className="flex-row gap-4">
            <CircleGauge size={24} color="white" />
            <Text className="text-white text-base">Cadastrar Pivô</Text>
          </View>
          <Pressable className="rounded-bl-[12px] bg-secundaria-azul w-[40px] h-[40px] items-center justify-center">
            <Plus size={24} strokeWidth={2.5} color="white" />
          </Pressable>
        </Button>
      </View>

      <Separator className="my-2 bg-[#B5B5B5]" decorative />

      {/* // * Alertas */}
      <View className="w-full gap-4">
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
