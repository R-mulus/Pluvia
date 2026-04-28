import * as React from "react";
import { useState } from "react";
import * as Haptics from "expo-haptics";
import { View, Pressable } from "react-native";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useRouter, type Href } from "expo-router";
import { Screen } from "@/components/custom/Screen";
import Header from "@/components/custom/Header";
import {
  LayersPlus,
  AlarmClock,
  Calendar,
  RotateCcw,
  RotateCw,
} from "lucide-react-native";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function AdicionarPreset() {
  const router = useRouter();
  const [isIrrigating, setIsIrrigating] = useState(false);

  const [direcao, setDirecao] = useState("horario");

  const onDirecaoChange = (novoValor: string | undefined) => {
    if (novoValor) {
      setDirecao(novoValor);
    }
  };

  return (
    <Screen>

      {/* Cabeçalho */}
      <View className="flex-row justify-between">
        <Header title="Pivô 01" subtitle="AXCP2134HIM" />
        <Pressable className="active:opacity-50 bg-primaria-azul rounded-[12px] w-[40px] h-[40px] items-center justify-center">
          <LayersPlus size={20} color="white" strokeWidth={2.5} />
        </Pressable>
      </View>

      {/* Conteúdo */}
      <View className="gap-4 flex-1">
        {/* Linha de inputs */}
        <View className="flex-row justify-between gap-6">
          <View className="items-start gap-1 flex-[2]">
            <Text className="text-xs">Percentímetro</Text>
            <Input
              className="rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul"
              placeholder="100%"
            ></Input>
          </View>

          <View className="items-start gap-1 flex-1">
            <Text className="text-xs">Ângulo Inicial</Text>
            <Input
              className="rounded-[12px] bg-white border-[2px] border-l-[16px] border-l-secundaria-azul"
              placeholder="180º"
            ></Input>
          </View>

          <View className="items-start gap-1 flex-1">
            <Text className="text-xs">Ângulo Final</Text>
            <Input
              className="rounded-[12px] bg-white border-[2px]  border-l-[16px] border-l-secundaria-azul"
              placeholder="180º"
            ></Input>
          </View>
        </View>

        {/* Linha de inputs */}
        <View className="flex-row gap-4">
          <View className="flex-[2] gap-1">
            <Text className="text-xs">Horário</Text>

            <View className="flex-row items-center border-[2px] border-[#B8B8B8] bg-white rounded-xl overflow-hidden h-10">
              {/* Ícone fixo */}
              <View className="bg-primaria-azul w-12 h-full items-center justify-center">
                <AlarmClock size={24} color="white" strokeWidth={2.5} />
              </View>

              <Input
                placeholder="00:00"
                className="flex-1 border-0 h-full px-4 bg-white font-outfit"
              />
            </View>
          </View>

          <View className="flex-[3] gap-1">
            <Text className="text-xs">Data</Text>

            <View className="flex-row items-center border-[2px] border-[#B8B8B8] bg-white rounded-xl overflow-hidden h-10">
              <View className="bg-primaria-azul w-12 h-full items-center justify-center">
                <Calendar size={24} color="white" strokeWidth={2.5} />
              </View>

              <Input
                placeholder="00/00/0000"
                className="flex-1 border-0 h-full px-4 bg-white text-texto font-outfit"
              />
            </View>
          </View>
        </View>

        {/* Switch de irrigação */}
        <View className="gap-2">
          <Text className="text-sm font-outfit text-texto">Irrigação</Text>

          <View className="flex-row items-center gap-3">
            <Text
              className={`text-base font-outfit ${
                !isIrrigating ? "font-outfit-medium" : "text-subtexto"
              }`}
            >
              Não
            </Text>

            <Switch checked={isIrrigating} onCheckedChange={setIsIrrigating} />

            <Text
              className={`text-base ${
                isIrrigating ? "font-outfit-medium" : "text-subtexto"
              }`}
            >
              Sim
            </Text>
          </View>
        </View>

        <View className="items-center gap-10">
          <ToggleGroup
            value={direcao}
            onValueChange={onDirecaoChange}
            variant="outline"
            type="single"
            // Removi o 'gap-5' para ficarem colados como no Figma.
            className="flex-row gap-3"
          >
            {/* BOTÃO REVERSO */}
            <ToggleGroupItem
              isFirst
              value="reverso"
              aria-label="Sentido Reverso"
              className={`flex-row items-center justify-center gap-2 border-[2px] border-primaria-azul h-12 ${
                direcao === "reverso" ? "bg-primaria-azul" : "bg-transparent"
              }`}
            >
              <RotateCcw
                size={20}
                strokeWidth={2.5}
                color={direcao === "reverso" ? "white" : "#00A0A6"}
              />
              <Text
                className={`text-base font-outfit-medium ${
                  direcao === "reverso" ? "text-white" : "text-primaria-azul"
                }`}
              >
                Reverso
              </Text>
            </ToggleGroupItem>

            {/* BOTÃO HORÁRIO */}
            <ToggleGroupItem
              isLast
              value="horario"
              aria-label="Sentido Horário"
              className={`flex-row items-center justify-center gap-2 border-[2px] border-primaria-azul h-12 ${
                direcao === "horario" ? "bg-primaria-azul" : "bg-transparent"
              }`}
            >
              <Text
                className={`text-base font-outfit-medium ${
                  direcao === "horario" ? "text-white" : "text-primaria-azul"
                }`}
              >
                Horário
              </Text>
              <RotateCw
                size={20}
                strokeWidth={2.5}
                color={direcao === "horario" ? "white" : "#00A0A6"}
              />
            </ToggleGroupItem>
          </ToggleGroup>

          <View className="flex-row items-center w-full gap-4">
            <Button className="bg-incorreto rounded-none rounded-pluvia flex-1 h-[40px]">
              <Text>Cancelar</Text>
            </Button>
            <Button className="bg-primaria-verde rounded-none rounded-pluvia flex-1 h-[40px]">
              <Text>Salvar</Text>
            </Button>
          </View>
        </View>
      </View>
    </Screen>
  );
}
