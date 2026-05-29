import * as React from "react";
import { useState, useMemo } from "react";
import { Pressable, View, Platform, ActivityIndicator } from "react-native";
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

// Hooks e Tipagens Reais
import { useFazendas } from "@/hooks/api/useFazendas";
import { usePivos } from "@/hooks/api/usePivos";
import { useUsuarios } from "@/hooks/api/useUsuarios";
import { Usuario } from "@/services/api/usuarios.service";
import { Fazenda } from "@/services/api/fazendas.service";
import { Pivo } from "@/services/api/pivos.service";
import { useAlertas } from "@/hooks/api/useLogs";

// * Mocks de Alertas (Mantido temporariamente)
// export const alertasMock = [
//   { id: "01", tipo: "info", icone: "gota", evento: "Economia por Horário", data: "20/03/2026", hora: "21:00", pivo: '"', operador: '"' },
//   { id: "02", tipo: "perigo", icone: "alerta", evento: "Pressão Acima de 50 PSI", data: "20/03/2026", hora: "00:24", pivo: "01", operador: "João Pedro" },
// ];

// * COLUNAS DINÂMICAS MAPEADAS E ESTILIZADAS
const formatCpfCnpj = (valor?: string) => {
  if (!valor) return "-";
  const numeros = valor.replace(/\D/g, "");
  if (numeros.length === 11)
    return numeros.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  if (numeros.length === 14)
    return numeros.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5",
    );
  return valor;
};

export const colunasUsuarios: TableColumn<Usuario>[] = [
  {
    key: "id",
    title: "ID",
    width: 80,
    renderCell: (item) => (
      <Text className="text-xs uppercase text-white font-bold text-center">
        {item.id.slice(0, 5)}
      </Text>
    ),
  },
  {
    key: "nome",
    title: "Nome",
    width: 220,
    renderCell: (item) => <Text className="text-center">{item.nome}</Text>,
  }, // Mais largo para nomes completos
  {
    key: "cpf_cnpj",
    title: "CPF/CNPJ",
    width: 170,
    renderCell: (item) => (
      <Text className="text-center">{formatCpfCnpj(item.cpf_cnpj)}</Text>
    ),
  },
  {
    key: "email",
    title: "E-mail",
    width: 200,
    renderCell: (item) => <Text className="text-center">{item.email}</Text>,
  },
  {
    key: "telefone",
    title: "Telefone",
    width: 150,
    renderCell: (item) => {
      const telefone = item.telefone
        ?.replace(/\D/g, "")
        .replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
      return <Text className="text-center">{telefone || "-"}</Text>;
    },
  },
];

export const colunasFazendas: TableColumn<Fazenda>[] = [
  {
    key: "id",
    title: "ID",
    width: 80,
    renderCell: (item) => (
      <Text className="text-xs uppercase text-white font-bold text-center">
        {item.id.slice(0, 5)}
      </Text>
    ),
  },
  {
    key: "nome_fazenda",
    title: "Nome",
    width: 190,
    renderCell: (item) => (
      <Text className="text-center">{item.nome_fazenda}</Text>
    ),
  },
  {
    key: "codigo_identificacao",
    title: "Código",
    width: 90,
    renderCell: (item) => (
      <Text className="text-center">{item.codigo_identificacao}</Text>
    ),
  },
  {
    key: "endereco",
    title: "Endereço",
    width: 220,
    renderCell: (item) => (
      <Text className="text-center">{item.endereco || "-"}</Text>
    ),
  },
  {
    key: "coordenadas",
    title: "Coordenadas",
    width: 160,
    renderCell: (item) => (
      <Text className="text-center">{item.coordenadas || "-"}</Text>
    ),
  },
  {
    key: "cidade",
    title: "Cidade",
    width: 160,
    renderCell: (item) => (
      <Text className="text-center">{item.cidade || "-"}</Text>
    ),
  },
  {
    key: "estado",
    title: "Estado",
    width: 80,
    renderCell: (item) => (
      <Text className="text-center">{item.estado || "-"}</Text>
    ),
  },
  {
    key: "area_total",
    title: "Área Total",
    width: 110,
    renderCell: (item) => (
      <Text className="text-center">
        {item.area_total ? `${item.area_total} Ha` : "-"}
      </Text>
    ),
  },
  {
    key: "cultura" as keyof Fazenda,
    title: "Cultura",
    width: 120,
    renderCell: (item) => {
      const culturas = (item as any).cultura as string[] | undefined;
      return (
        <Text className="text-center">
          {culturas ? culturas.join(", ") : "-"}
        </Text>
      );
    },
  },
];

export const colunasPivos: TableColumn<Pivo>[] = [
  {
    key: "id",
    title: "ID",
    width: 80,
    renderCell: (item) => (
      <Text className="text-xs uppercase text-white font-bold text-center">
        {item.id.slice(0, 5)}
      </Text>
    ),
  },
  {
    key: "fazenda_id",
    title: "Fazenda",
    width: 190,
    renderCell: (item) => (
      <Text className="text-center">{item.fazendas?.nome_fazenda || "-"}</Text>
    ),
  },
  {
    key: "nome_pivo",
    title: "Nome",
    width: 140,
    renderCell: (item) => <Text className="text-center">{item.nome_pivo}</Text>,
  },
  {
    key: "codigo_serie",
    title: "Nº Série",
    width: 140,
    renderCell: (item) => (
      <Text className="text-center">{item.codigo_serie}</Text>
    ),
  },
  {
    key: "delta_device_id",
    title: "ID Delta",
    width: 140,
    renderCell: (item) => (
      <Text className="text-center">{item.delta_device_id || "-"}</Text>
    ),
  },
  {
    key: "marca",
    title: "Marca",
    width: 110,
    renderCell: (item) => (
      <Text className="text-center">{item.marca || "-"}</Text>
    ),
  },
  {
    key: "modelo",
    title: "Modelo",
    width: 120,
    renderCell: (item) => (
      <Text className="text-center">{item.modelo || "-"}</Text>
    ),
  },
  {
    key: "vazao" as keyof Pivo,
    title: "Vazão Nominal",
    width: 130,
    renderCell: (item) => (
      <Text className="text-center">
        {(item as any).vazao ? `${(item as any).vazao} L/h` : "-"}
      </Text>
    ),
  },
  {
    key: "raio" as keyof Pivo,
    title: "Raio",
    width: 90,
    renderCell: (item) => (
      <Text className="text-center">
        {(item as any).raio ? `${(item as any).raio} km` : "-"}
      </Text>
    ),
  },
];

export const colunasAlertas: TableColumn<any>[] = [
  // <- Removido o typeof do mock
  { key: "id", title: "ID", width: 80 },
  {
    key: "icone",
    title: <TriangleAlert size={18} color="white" />,
    width: 60,
    renderCell: (item) => {
      let bgColor = "bg-[#00A0A6]";
      if (item.tipo === "perigo") bgColor = "bg-[#D32F2F]";
      if (item.tipo === "sucesso") bgColor = "bg-[#0AA146]";
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
  { key: "pivo", title: "Pivô", width: 100 },
  { key: "operador", title: "Operador", width: 140 },
];

export default function Menu() {
  const ref = React.useRef<TriggerRef>(null);
  const router = useRouter();

  // Execução dos hooks
  const {
    data: usuarios,
    isPending: isLoadingUsuarios,
    refetch: refetchUsuarios,
  } = useUsuarios();
  const {
    data: fazendas,
    isPending: isLoadingFazendas,
    refetch: refetchFazendas,
  } = useFazendas();
  const {
    data: pivos,
    isPending: isLoadingPivos,
    refetch: refetchPivos,
  } = usePivos();

  // --- NOVA ENGENHARIA: MEMOIZAÇÃO DAS PREVIEWS DAS TABELAS ---
  // Isso impede que as tabelas renderizem pesadamente a cada digitação ou toque na tela
  const usuariosPreview = useMemo(
    () => usuarios?.slice(0, 10) || [],
    [usuarios],
  );
  const fazendasPreview = useMemo(
    () => fazendas?.slice(0, 10) || [],
    [fazendas],
  );
  const pivosPreview = useMemo(() => pivos?.slice(0, 10) || [], [pivos]);

  // Memoização do Dropdown de Alertas
  const pivosDropdownOptions = useMemo(() => pivos || [], [pivos]);

  const [tabValue, setTabValue] = React.useState("usuarios");
  const [filtroAlerta, setFiltroAlerta] = useState<string>("todos");
  const [alertasOpen, setAlertasOpen] = useState(false);
  const { data: alertasReais } = useAlertas(filtroAlerta);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Formate os dados do banco para a tabela (cole este useMemo logo abaixo)
  const alertasFormatados = useMemo(() => {
    if (!alertasReais) return [];
    return alertasReais.map((log: any) => {
      const dateObj = new Date(log.timestamp);
      const nomeOperador = Array.isArray(log.usuarios)
        ? log.usuarios[0]?.nome
        : log.usuarios?.nome;
      const nomePivo = Array.isArray(log.pivos)
        ? log.pivos[0]?.nome_pivo
        : log.pivos?.nome_pivo;

      return {
        id: log.id.substring(0, 5).toUpperCase(),
        tipo:
          log.tipo_evento === "erro" || log.tipo_evento === "falha"
            ? "perigo"
            : "info",
        icone: "alerta",
        evento: log.codigo
          ? log.codigo.replace(/_/g, " ")
          : "Alerta do Sistema",
        data: dateObj.toLocaleDateString("pt-BR"),
        hora: dateObj.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        pivo: nomePivo || log.pivo_id.substring(0, 5),
        operador: nomeOperador || "Sistema Autônomo",
      };
    });
  }, [alertasReais]);

  const alertasPreview = useMemo(() => alertasFormatados.slice(0, 15), [alertasFormatados]);

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

  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetchUsuarios(), refetchFazendas(), refetchPivos()]);
    } catch (error) {
      console.error("Erro ao recarregar dados do dashboard:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const ConteudoDaTela = (
    <View className="items-center justify-center gap-6">
      {/* // * Tabelas Reais */}

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

          <TabsContent value="usuarios" className="gap-2">
            <Button
              className="rounded-md bg-secundaria-azul"
              onPress={() => router.push("/(tabs)/menu/tabelaUsuarios")}
            >
              <Text>Ver Tabela Completa</Text>
            </Button>
            {isLoadingUsuarios ? (
              <ActivityIndicator
                className="mt-6"
                size="large"
                color="#00A0A6"
              />
            ) : (
              <Table columns={colunasUsuarios} data={usuariosPreview} />
            )}
          </TabsContent>

          <TabsContent value="fazendas" className="gap-2">
            <Button
              className="rounded-md bg-secundaria-azul"
              onPress={() => router.push("/(tabs)/menu/tabelaFazendas")}
            >
              <Text>Ver Tabela Completa</Text>
            </Button>
            {isLoadingFazendas ? (
              <ActivityIndicator
                className="mt-6"
                size="large"
                color="#00A0A6"
              />
            ) : (
              <Table columns={colunasFazendas} data={fazendasPreview} />
            )}
          </TabsContent>

          <TabsContent value="pivos" className="gap-2">
            <Button
              className="rounded-md bg-secundaria-azul"
              onPress={() => router.push("/(tabs)/menu/tabelaPivos")}
            >
              <Text className="font-outfit-medium">Ver Tabela Completa</Text>
            </Button>
            {isLoadingPivos ? (
              <ActivityIndicator
                className="mt-6"
                size="large"
                color="#00A0A6"
              />
            ) : (
              <Table columns={colunasPivos} data={pivosPreview} />
            )}
          </TabsContent>
        </Tabs>
      </View>

      <Separator className="my-2 bg-[#B5B5B5]" decorative />

      {/* // * Botões de Cadastro */}
      <View className="w-full gap-4">
        <Text className="font-outfit-bold">Cadastro</Text>
        <View className="w-full md:max-w-md gap-4">
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
      </View>

      <Separator className="my-2 bg-[#B5B5B5]" decorative />

      {/* // * Alertas */}
      <View className="w-full gap-4">
        <View className="flex-row w-full justify-between items-center flex-wrap gap-y-3">
          <Text className="font-outfit-bold">Alertas</Text>
          
          <View className="flex-row gap-2 items-center">
            
            

            <Select
              onOpenChange={setAlertasOpen}
              onValueChange={(option) => {
                if (option) setFiltroAlerta(option.value);
              }}
              defaultValue={{ value: "todos", label: "Todos os Pivôs" }}
            >
              <SelectTrigger
                ref={ref}
                className={`border-[1px] border-[#b8b8b8] bg-white h-[40px] w-[130px] ${alertasOpen ? "rounded-t-[12px] rounded-b-none border-b-0" : "rounded-[12px] border-b-[1px]"}`}
              >
                <SelectValue placeholder="Todos os Pivôs" />
              </SelectTrigger>
              <SelectContent
                insets={contentInsets}
                className={`border-[#b8b8b8] bg-white w-[130px] ${alertasOpen ? "rounded-b-[12px] rounded-t-none" : "rounded-xl"}`}
              >
                <SelectGroup>
                  <SelectItem key="todos" label="Todos os Pivôs" value="todos" className="bg-transparent">
                    Todos os Pivôs
                  </SelectItem>

                  {pivosDropdownOptions.map((pivo, index) => (
                    <SelectItem
                      key={pivo.id}
                      label={pivo.nome_pivo}
                      value={pivo.id} 
                      className={index % 2 === 0 ? "bg-[#E1E1E1]" : "bg-transparent"}
                    >
                      {pivo.nome_pivo}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </View>
        </View>

        <Button
              className="rounded-md bg-secundaria-azul h-[40px] px-3"
              onPress={() => router.push({ pathname: "/menu/tabelaAlertas" } as any)}
            >
              <Text className="font-outfit-medium">Ver Tabela Completa</Text>
            </Button>

        {/* 👉 TABELA ATUALIZADA: Usando a variável alertasPreview com limite de 15 */}
        <Table data={alertasPreview} columns={colunasAlertas} alerta />
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
        refreshing={isRefreshing}
        onRefresh={onRefresh}
      />
    </Screen>
  );
}
