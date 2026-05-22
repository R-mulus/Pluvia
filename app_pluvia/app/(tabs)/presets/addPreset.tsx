import * as React from "react";
import { useState } from "react";
import {
  View,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useRouter, useLocalSearchParams } from "expo-router";
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
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Hook fictício de criação
import { useCriarCronograma } from "@/hooks/api/useCronogramas";

// --- MÁSCARAS ---
const maskDate = (v: string) => {
  v = v.replace(/\D/g, "");
  if (v.length > 2) v = v.replace(/^(\d{2})(\d)/, "$1/$2");
  if (v.length > 5) v = v.replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
  return v.substring(0, 10);
};

const maskTime = (v: string) => {
  v = v.replace(/\D/g, "");
  if (v.length > 2) v = v.replace(/^(\d{2})(\d)/, "$1:$2");
  return v.substring(0, 5);
};

// --- SCHEMA DO FORMULÁRIO ---
const formSchema = z.object({
  lamina: z.string().min(1, "Obrigatório"),
  angulo_inicial: z.string().min(1, "Obrigatório"),
  angulo_final: z.string().min(1, "Obrigatório"),
  data: z.string().length(10, "Data inválida"),
  horario: z.string().length(5, "Hora inválida"),
  irrigacao: z.boolean(),
  direcao: z.enum(["HORARIO", "ANTI_HORARIO"]),
});
type FormData = z.infer<typeof formSchema>;

export default function AdicionarCronograma() {
  const router = useRouter();
  const { id: pivo_id } = useLocalSearchParams(); // Pega o ID da URL

  const { mutateAsync: criarCronograma, isPending } = useCriarCronograma();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lamina: "",
      angulo_inicial: "",
      angulo_final: "",
      data: "",
      horario: "",
      irrigacao: false,
      direcao: "HORARIO",
    },
  });

  const isIrrigating = watch("irrigacao");
  const direcao = watch("direcao");

  const onSubmit = async (data: FormData) => {
    try {
      // 1. Converter Data (DD/MM/YYYY) e Hora (HH:MM) para Timestamp ISO
      const [dia, mes, ano] = data.data.split("/");
      // Atenção: Em produção, você precisa lidar com Timezones corretamente.
      const dataISO = new Date(
        `${ano}-${mes}-${dia}T${data.horario}:00`,
      ).toISOString();

      // 2. Montar o JSONB do comando exatamente como o banco espera
      const comandoJson = {
        lamina: parseFloat(data.lamina.replace(",", ".")),
        angulo_inicial: parseInt(data.angulo_inicial, 10),
        angulo_final: parseInt(data.angulo_final, 10),
        irrigacao: data.irrigacao,
        direcao: data.direcao,
        percentimetro: 0, // Fallback para não quebrar o banco
      };

      const payload = {
        pivo_id: pivo_id as string,
        horario: dataISO,
        comando: comandoJson,
      };

      await criarCronograma(payload);
      Alert.alert("Sucesso", "Agendamento criado!");
      router.back();
    } catch (error) {
      Alert.alert("Erro", "Falha ao criar o agendamento.");
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}
        >
          <View className="flex-row justify-between mb-6">
            <Header title="Novo Agendamento" subtitle="Pivô" />
            <Pressable className="bg-primaria-azul rounded-[12px] w-[40px] h-[40px] items-center justify-center">
              <LayersPlus size={20} color="white" strokeWidth={2.5} />
            </Pressable>
          </View>

          <View className="gap-6 flex-1">
            <View className="flex-row justify-between gap-4">
              <View className="items-start gap-1 flex-[1.5]">
                <Text className="text-xs">Lâmina (mm)</Text>
                <Controller
                  control={control}
                  name="lamina"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      className="rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul w-full"
                      placeholder="10.5"
                      keyboardType="numeric"
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />
              </View>
              <View className="items-start gap-1 flex-1">
                <Text className="text-xs">Início</Text>
                <Controller
                  control={control}
                  name="angulo_inicial"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      className="rounded-[12px] bg-white border-[2px] border-l-[16px] border-l-secundaria-azul w-full"
                      placeholder="0º"
                      keyboardType="numeric"
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />
              </View>
              <View className="items-start gap-1 flex-1">
                <Text className="text-xs">Final</Text>
                <Controller
                  control={control}
                  name="angulo_final"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      className="rounded-[12px] bg-white border-[2px] border-l-[16px] border-l-secundaria-azul w-full"
                      placeholder="180º"
                      keyboardType="numeric"
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />
              </View>
            </View>

            <View className="flex-row gap-4">
              <View className="flex-[2] gap-1">
                <Text className="text-xs">Horário de Início</Text>
                <View className="flex-row items-center border-[2px] border-[#B8B8B8] bg-white rounded-xl overflow-hidden h-12">
                  <View className="bg-primaria-azul w-12 h-full items-center justify-center">
                    <AlarmClock size={24} color="white" strokeWidth={2.5} />
                  </View>
                  <Controller
                    control={control}
                    name="horario"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        placeholder="00:00"
                        keyboardType="numeric"
                        className="flex-1 border-0 h-full px-4 bg-white font-outfit"
                        value={value}
                        onChangeText={(t) => onChange(maskTime(t))}
                      />
                    )}
                  />
                </View>
              </View>
              <View className="flex-[3] gap-1">
                <Text className="text-xs">Data de Início</Text>
                <View className="flex-row items-center border-[2px] border-[#B8B8B8] bg-white rounded-xl overflow-hidden h-12">
                  <View className="bg-primaria-azul w-12 h-full items-center justify-center">
                    <Calendar size={24} color="white" strokeWidth={2.5} />
                  </View>
                  <Controller
                    control={control}
                    name="data"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        placeholder="DD/MM/AAAA"
                        keyboardType="numeric"
                        className="flex-1 border-0 h-full px-4 bg-white font-outfit"
                        value={value}
                        onChangeText={(t) => onChange(maskDate(t))}
                      />
                    )}
                  />
                </View>
              </View>
            </View>

            <View className="gap-2 mt-2">
              <Text className="text-sm font-outfit text-texto">
                Aplicar Água (Irrigação)
              </Text>
              <View className="flex-row items-center gap-3">
                <Text
                  className={`text-base ${!isIrrigating ? "font-outfit-bold text-texto" : "text-subtexto"}`}
                >
                  Não
                </Text>
                <Switch
                  checked={isIrrigating}
                  onCheckedChange={(val) => setValue("irrigacao", val)}
                />
                <Text
                  className={`text-base ${isIrrigating ? "font-outfit-bold text-texto" : "text-subtexto"}`}
                >
                  Sim
                </Text>
              </View>
            </View>

            <View className="items-center gap-6 mt-2">
              <ToggleGroup
                value={direcao}
                onValueChange={(val) =>
                  val && setValue("direcao", val as "HORARIO" | "ANTI_HORARIO")
                }
                variant="outline"
                type="single"
                className="flex-row w-full gap-3"
              >
                <ToggleGroupItem
                  value="ANTI_HORARIO"
                  className={`flex-1 flex-row items-center justify-center gap-2 border-[2px] border-primaria-azul h-12 ${direcao === "ANTI_HORARIO" ? "bg-primaria-azul" : "bg-transparent"}`}
                >
                  <RotateCcw
                    size={20}
                    strokeWidth={2.5}
                    color={direcao === "ANTI_HORARIO" ? "white" : "#00A0A6"}
                  />
                  <Text
                    className={`text-base font-outfit-medium ${direcao === "ANTI_HORARIO" ? "text-white" : "text-primaria-azul"}`}
                  >
                    Reverso
                  </Text>
                </ToggleGroupItem>

                <ToggleGroupItem
                  value="HORARIO"
                  className={`flex-1 flex-row items-center justify-center gap-2 border-[2px] border-primaria-azul h-12 ${direcao === "HORARIO" ? "bg-primaria-azul" : "bg-transparent"}`}
                >
                  <Text
                    className={`text-base font-outfit-medium ${direcao === "HORARIO" ? "text-white" : "text-primaria-azul"}`}
                  >
                    Horário
                  </Text>
                  <RotateCw
                    size={20}
                    strokeWidth={2.5}
                    color={direcao === "HORARIO" ? "white" : "#00A0A6"}
                  />
                </ToggleGroupItem>
              </ToggleGroup>

              <View className="flex-row items-center w-full gap-4 mt-4">
                <Button
                  className="bg-incorreto rounded-none rounded-pluvia flex-1 h-[40px]"
                  onPress={() => router.back()}
                >
                  <Text>Cancelar</Text>
                </Button>
                <Button
                  className="bg-primaria-verde rounded-none rounded-pluvia flex-1 h-[40px]"
                  onPress={handleSubmit(onSubmit)}
                  disabled={isPending}
                >
                  {isPending ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text>Agendar</Text>
                  )}
                </Button>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
