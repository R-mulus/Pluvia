// ! CÓDIGO DE EXEMPLO
import { View } from "react-native";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useRouter, type Href } from "expo-router";
import { FlashList } from "@shopify/flash-list";

// * Teste de Gráficos
import {
  BarChart,
  LineChart,
  PieChart,
  PopulationPyramid,
  RadarChart,
  BubbleChart,
} from "react-native-gifted-charts";
import { Screen } from "@/components/custom/Screen";

// * Teste de Gráficos
const data = [{ value: 50 }, { value: 80 }, { value: 90 }, { value: 70 }];

export const tempoOperacaoMock = [
  { label: '01', value: 4 },
  { label: '02', value: 12 },
  { label: '03', value: 21 },
  { label: '04', value: 9 },
  { label: '05', value: 13 },
  { label: '06', value: 10 },
  { label: '07', value: 6 },
];

export default function Menu() {
  const router = useRouter();

  const ConteudoDaTela = (
    <View className="items-center justify-center bg-background gap-6 p-4">
      <Text className="text-2xl font-outfit-bold text-foreground">Menu</Text>

      {/* // * Teste de Gráficos */}
      <BarChart data={data} />
      <LineChart data={data} />
      <PieChart data={data} />
      <PopulationPyramid
        data={[
          { left: 10, right: 12 },
          { left: 9, right: 8 },
        ]}
      />
      <RadarChart data={[50, 80, 90, 70]} />
      <BubbleChart
        data={[
          { x: 20, y: 4, r: 10 },
          { x: 40, y: 6, r: 20 },
        ]}
      />

      <BarChart data={data} horizontal />
    </View>
  );

  return (
    <Screen className="flex-1 px-0 gap-4 ">
      <FlashList
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={ConteudoDaTela}
        showsVerticalScrollIndicator={false}
      />

      {/* Botão de Teste para fazer Logout */}
      <View>
        <Button
        variant="destructive"
        className="w-full"
        onPress={() => router.replace("/" as Href)}
      >
        <Text>Sair (Voltar pro Login)</Text>
      </Button>
      <Button
        className="w-full"
        onPress={() => router.replace("/")}
      >
        <Text>Ir para pivôs</Text>
      </Button>
      <Button
        className="w-full"
        onPress={() => router.replace("/(tabs)/analise/analises")} 
        // ! BERNARDO: quando na sua pasta não tem "index" tem que linkar assim, se não era só analise memo **tava dando erro
      >
        <Text>Ir para Análise</Text>
      </Button>

      {/* // ! BERNARDO: colocando a parte de cadastrar aqui pra separar */}
      <Text className="text-2xl font-outfit-bold text-foreground">
        Cadastrar
      </Text>

      <Button
        className="w-full"
        onPress={() => router.replace("/(tabs)/menu/addUsuario")}
      >
        <Text>Cadastrar Usuário</Text>
      </Button>

      <Button
        className="w-full"
        onPress={() => router.replace("/(tabs)/menu/addFazenda")}
        
      >
        <Text>Cadastrar Fazenda</Text>
      </Button>

      <Button
        className="w-full"
        onPress={() => router.replace("/(tabs)/menu/addPivo")}
      >
        <Text>Cadastrar Pivô</Text>
      </Button>
    </View>
  );
}
