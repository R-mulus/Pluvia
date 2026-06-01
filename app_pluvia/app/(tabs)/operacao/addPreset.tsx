import * as React from "react";
import { View, Pressable, KeyboardAvoidingView, ScrollView, Platform, Alert, ActivityIndicator } from "react-native";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useRouter, useLocalSearchParams } from "expo-router"; // <- CORREÇÃO: useLocalSearchParams
import { Screen } from "@/components/custom/Screen";
import Header from "@/components/custom/Header";
import { LayersPlus, RotateCcw, RotateCw } from "lucide-react-native";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useCriarPreset } from "@/hooks/api/usePresets";

const formSchema = z.object({
  nome: z.string().min(3, "Nome do preset obrigatório"),
  lamina: z.string().min(1, "Valor obrigatório"), // Pode ser mm ou %
  angulo_inicial: z.string().min(1, "Obrigatório"),
  angulo_final: z.string().min(1, "Obrigatório"),
  irrigacao: z.boolean(),
  direcao: z.enum(["HORARIO", "ANTI_HORARIO"]),
});

type FormData = z.infer<typeof formSchema>;

export default function AdicionarPresetBiblioteca() {
  const router = useRouter();
  
  // 👉 CORREÇÃO: Pega o parâmetro local da rota atual de forma confiável
  const params = useLocalSearchParams(); 
  const pivo_id = params.pivo_id as string;

  const { mutateAsync: criarPreset, isPending } = useCriarPreset();

  const { control, handleSubmit, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      lamina: "", 
      angulo_inicial: "",
      angulo_final: "",
      irrigacao: false,
      direcao: "HORARIO",
    },
  });

  const isIrrigating = watch("irrigacao");
  const direcao = watch("direcao");

  const onSubmit = async (data: FormData) => {
    try {
      if (!pivo_id) {
        Alert.alert("Erro de Rota", "ID do pivô não foi encontrado.");
        return;
      }

      const payload = {
        pivo_id: pivo_id,
        nome: data.nome,
        // Converte pra float independente de ser % ou mm
        lamina: parseFloat(data.lamina.replace(",", ".")) || 0,
        angulo_inicial: parseInt(data.angulo_inicial, 10) || 0,
        angulo_final: parseInt(data.angulo_final, 10) || 0,
        irrigacao: data.irrigacao,
        direcao: data.direcao,
      };

      await criarPreset(payload);
      Alert.alert("Sucesso", "Predefinição adicionada à biblioteca!");
      router.back();
    } catch (error) {
      Alert.alert("Erro", "Falha ao salvar predefinição.");
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        style={{ flex: 1, width: "100%" }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 40,
            gap: 24,
          }}
        >
          {/* Header Full Width */}
          <View className="flex-row justify-between items-start">
            <Header
              title={"Nova Predefinição"}
              subtitle="Biblioteca de Comandos"
            />

            <Pressable className="bg-primaria-azul rounded-[12px] w-[40px] h-[40px] items-center justify-center">
              <LayersPlus size={20} color="white" strokeWidth={2.5} />
            </Pressable>
          </View>

          {/* Container centralizado na Web */}
          <View className="w-full web:max-w-2xl web:mx-auto self-center gap-6">
            <View className="gap-6 flex-1">
              <View className="gap-1">
                <Text className="text-xs text-subtexto font-outfit">
                  Nome da Predefinição (Ex: Irrigação Noturna)
                </Text>

                <Controller
                  control={control}
                  name="nome"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      className="rounded-[12px] border-[2px] bg-white border-secundaria-azul w-full"
                      placeholder="Nome da predefinição"
                      value={value}
                      onChangeText={onChange}
                    />
                  )}
                />
              </View>

              <View className="flex-row justify-between gap-4">
                <View className="items-start gap-1 flex-[1.5]">
                  <Text className="text-xs text-subtexto font-outfit">
                    {isIrrigating ? "Lâmina (mm)" : "Percentímetro (%)"}
                  </Text>

                  <Controller
                    control={control}
                    name="lamina"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        className="rounded-[12px] border-[2px] border-l-[16px] bg-white border-l-secundaria-azul w-full"
                        placeholder="0.0"
                        keyboardType="numeric"
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                  />
                </View>

                <View className="items-start gap-1 flex-1">
                  <Text className="text-xs text-subtexto font-outfit">
                    Início (°)
                  </Text>

                  <Controller
                    control={control}
                    name="angulo_inicial"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        className="rounded-[12px] bg-white border-[2px] border-l-[16px] border-l-secundaria-azul w-full"
                        placeholder="0"
                        keyboardType="numeric"
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                  />
                </View>

                <View className="items-start gap-1 flex-1">
                  <Text className="text-xs text-subtexto font-outfit">
                    Final (°)
                  </Text>

                  <Controller
                    control={control}
                    name="angulo_final"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        className="rounded-[12px] bg-white border-[2px] border-l-[16px] border-l-secundaria-azul w-full"
                        placeholder="360"
                        keyboardType="numeric"
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                  />
                </View>
              </View>

              <View className="gap-2">
                <Text className="text-sm font-outfit text-texto">
                  Aplicar Água (Irrigação)
                </Text>

                <View className="flex-row items-center gap-3">
                  <Text
                    className={`text-base ${
                      !isIrrigating
                        ? "font-outfit-bold text-texto"
                        : "text-subtexto"
                    }`}
                  >
                    Não
                  </Text>

                  <Switch
                    checked={isIrrigating}
                    onCheckedChange={(val) =>
                      setValue("irrigacao", val)
                    }
                  />

                  <Text
                    className={`text-base ${
                      isIrrigating
                        ? "font-outfit-bold text-texto"
                        : "text-subtexto"
                    }`}
                  >
                    Sim
                  </Text>
                </View>
              </View>

              <View className="items-center gap-6">
                <ToggleGroup
                  value={direcao}
                  onValueChange={(val) =>
                    val &&
                    setValue(
                      "direcao",
                      val as "HORARIO" | "ANTI_HORARIO"
                    )
                  }
                  variant="outline"
                  type="single"
                  className="flex-row w-full gap-3"
                >
                  <ToggleGroupItem
                    value="ANTI_HORARIO"
                    className={`flex-1 flex-row items-center justify-center gap-2 border-[2px] rounded-l-2xl border-primaria-azul h-12 ${
                      direcao === "ANTI_HORARIO"
                        ? "bg-primaria-azul"
                        : "bg-transparent"
                    }`}
                  >
                    <RotateCcw
                      size={20}
                      strokeWidth={2.5}
                      color={
                        direcao === "ANTI_HORARIO"
                          ? "white"
                          : "#00A0A6"
                      }
                    />

                    <Text
                      className={`text-base font-outfit-medium ${
                        direcao === "ANTI_HORARIO"
                          ? "text-white"
                          : "text-primaria-azul"
                      }`}
                    >
                      Reverso
                    </Text>
                  </ToggleGroupItem>

                  <ToggleGroupItem
                    value="HORARIO"
                    className={`flex-1 flex-row items-center justify-center gap-2 border-[2px] rounded-r-2xl border-primaria-azul h-12 ${
                      direcao === "HORARIO"
                        ? "bg-primaria-azul"
                        : "bg-transparent"
                    }`}
                  >
                    <Text
                      className={`text-base font-outfit-medium ${
                        direcao === "HORARIO"
                          ? "text-white"
                          : "text-primaria-azul"
                      }`}
                    >
                      Horário
                    </Text>

                    <RotateCw
                      size={20}
                      strokeWidth={2.5}
                      color={
                        direcao === "HORARIO"
                          ? "white"
                          : "#00A0A6"
                      }
                    />
                  </ToggleGroupItem>
                </ToggleGroup>

                <View className="flex-row items-center w-full gap-4 mt-6">
                  <Button
                    className="bg-incorreto rounded-pluvia flex-1 h-[45px]"
                    onPress={() => router.back()}
                  >
                    <Text className="text-white font-outfit-bold">
                      Cancelar
                    </Text>
                  </Button>

                  <Button
                    className="bg-primaria-verde rounded-pluvia flex-1 h-[45px]"
                    onPress={handleSubmit(onSubmit)}
                    disabled={isPending}
                  >
                    {isPending ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text className="text-white font-outfit-bold">
                        Salvar na Biblioteca
                      </Text>
                    )}
                  </Button>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}