import * as React from "react";
import { useState, useEffect } from "react";
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
import { useRouter, useGlobalSearchParams } from "expo-router";
import { Screen } from "@/components/custom/Screen";
import Header from "@/components/custom/Header";
import {
  CalendarClock,
  Plus,
  Layers,
  Save,
  Clock,
} from "lucide-react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import PresetCard from "@/components/custom/PresetCard";
import { Separator } from "@/components/ui/separator";

import {
  useCronogramasPivo,
  useCriarCronograma,
  useExcluirCronograma,
  useAtivarCronograma,
} from "@/hooks/api/useCronogramas";
import { usePresetsPivo } from "@/hooks/api/usePresets";

interface PassoSelecionado {
  id_temporario: string;
  preset: any;
}

const neutralizarFusoHorario = (date: Date) => {
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString();
};

export default function EditarCronograma() {
  const router = useRouter();
  const { id, pivo_id } = useGlobalSearchParams();

  const { data: cronogramas, isPending: isLoadingCronogramas } = useCronogramasPivo(pivo_id as string);
  const { data: bibliotecaPresets, isPending: isLoadingPresets } = usePresetsPivo(pivo_id as string);

  const { mutateAsync: criarCronograma, isPending: isCriando } = useCriarCronograma();
  const { mutateAsync: excluirCronograma, isPending: isExcluindo } = useExcluirCronograma();
  const { mutateAsync: ativarCronograma } = useAtivarCronograma();

  const isSalvando = isCriando || isExcluindo;

  const [nomeCronograma, setNomeCronograma] = useState("");
  const [passos, setPassos] = useState<PassoSelecionado[]>([]);
  const [horarioInicio, setHorarioInicio] = useState<Date>(new Date());
  const [pickerConfig, setPickerConfig] = useState<"date" | "time" | null>(null);

  const [eraAtivo, setEraAtivo] = useState(false);

  const isWeb = Platform.OS === "web";

  // ==================== HANDLERS WEB ====================

  const handleDateChangeWeb = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [year, month, day] = e.target.value.split("-").map(Number);
    const newDate = new Date(horarioInicio);
    newDate.setFullYear(year, month - 1, day);
    setHorarioInicio(newDate);
  };

  const handleTimeChangeWeb = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(":").map(Number);
    const newDate = new Date(horarioInicio);
    newDate.setHours(hours, minutes, 0, 0);
    setHorarioInicio(newDate);
  };

  // ==================== USE EFFECT ====================

  useEffect(() => {
    if (cronogramas && id) {
      const cronogramaEditado = cronogramas.find((c) => c.id === id);
      if (cronogramaEditado) {
        setNomeCronograma(cronogramaEditado.nome);
        setEraAtivo(cronogramaEditado.is_ativo);

        if (cronogramaEditado.horario_inicio) {
          const dataBanco = new Date(cronogramaEditado.horario_inicio);
          setHorarioInicio(
            new Date(dataBanco.getTime() + dataBanco.getTimezoneOffset() * 60000)
          );
        }

        const passosCarregados = cronogramaEditado.passos
          .sort((a, b) => a.ordem - b.ordem)
          .map((passoBanco) => ({
            id_temporario: Math.random().toString(),
            preset: {
              ...passoBanco,
              id: passoBanco.preset_origem_id || "avulso",
            },
          }));
        setPassos(passosCarregados);
      }
    }
  }, [cronogramas, id]);

  const adicionarPasso = (preset: any) =>
    setPassos([...passos, { id_temporario: Math.random().toString(), preset }]);

  const removerPasso = (id_temporario: string) =>
    setPassos(passos.filter((p) => p.id_temporario !== id_temporario));

  const moverPasso = (index: number, direcao: "cima" | "baixo") => {
    if (direcao === "cima" && index === 0) return;
    if (direcao === "baixo" && index === passos.length - 1) return;
    const novosPassos = [...passos];
    const swapIndex = direcao === "cima" ? index - 1 : index + 1;
    const temp = novosPassos[index];
    novosPassos[index] = novosPassos[swapIndex];
    novosPassos[swapIndex] = temp;
    setPassos(novosPassos);
  };

  const handlePickerChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") setPickerConfig(null);
    if (selectedDate) setHorarioInicio(selectedDate);
  };

  const handleSalvar = async () => {
    try {
      if (!nomeCronograma) return Alert.alert("Aviso", "Dê um nome para o cronograma.");
      if (passos.length === 0) return Alert.alert("Aviso", "Adicione pelo menos um passo.");

      const isUUID = (str: string) =>
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i.test(str);

      const passosFormatados = passos.map((p, index) => ({
        preset_origem_id: isUUID(p.preset.id) ? p.preset.id : undefined,
        nome: p.preset.nome,
        lamina: p.preset.lamina,
        angulo_inicial: p.preset.angulo_inicial,
        angulo_final: p.preset.angulo_final,
        irrigacao: p.preset.irrigacao,
        direcao: p.preset.direcao,
        ordem: index + 1,
      }));

      const payload = {
        pivo_id: pivo_id as string,
        nome: nomeCronograma,
        horario_inicio: neutralizarFusoHorario(horarioInicio),
        passos: passosFormatados,
      };

      await excluirCronograma(id as string);
      const res = await criarCronograma(payload);

      if (eraAtivo && res.dados?.id) {
        await ativarCronograma({ id: res.dados.id, pivo_id: pivo_id as string });
      }

      Alert.alert("Sucesso", "Cronograma atualizado!");
      router.back();
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Falha ao atualizar cronograma.");
    }
  };

  if (isLoadingCronogramas)
    return (
      <Screen className="justify-center items-center">
        <ActivityIndicator size="large" color="#00A0A6" />
      </Screen>
    );

  return (
    <Screen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}>
          <View className="flex-row justify-between mb-6">
            <Header title={nomeCronograma || "Cronograma"} subtitle="Editar Agendamento" />
            <Pressable onPress={handleSalvar} disabled={isSalvando} className="bg-primaria-azul rounded-[12px] w-[40px] h-[40px] items-center justify-center active:opacity-50">
              {isSalvando ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Save size={20} color="white" strokeWidth={2.5} />
              )}
            </Pressable>
          </View>

          <View className="gap-6 flex-1">
            <View className="gap-4 bg-white p-4 rounded-[12px] border-[2px] border-secundaria-azul/30">
              <View className="gap-1">
                <Text className="text-xs text-subtexto">Nome da Execução</Text>
                <Input
                  value={nomeCronograma}
                  onChangeText={setNomeCronograma}
                  className="rounded-[12px] border-[2px] border-l-[16px] bg-white border-secundaria-azul"
                  placeholder="Ex: Manejo Fim de Semana"
                />
              </View>

              {/* === DATA E HORA (Web + Mobile) === */}
              <View className="flex-row gap-4">
                <View className="flex-1">
                  <Text className="text-xs text-subtexto mb-1">Data de Início</Text>
                  
                  {isWeb ? (
                    <View className="relative">
                      <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <CalendarClock size={18} color="#00A0A6" />
                      </View>
                      <input
                        type="date"
                        value={horarioInicio.toISOString().split("T")[0]}
                        onChange={handleDateChangeWeb}
                        className="w-full h-12 pl-11 pr-4 rounded-[12px] border border-[#cacaca] bg-white text-base 
                                   focus:outline-none focus:border-primaria-azul focus:ring-2 focus:ring-primaria-azul/20
                                   transition-all duration-200"
                      />
                    </View>
                  ) : (
                    <Pressable
                      onPress={() => setPickerConfig("date")}
                      className="bg-bg border-[1px] border-[#cacaca] h-12 px-4 rounded-[12px] flex-row items-center gap-2 active:opacity-70"
                    >
                      <CalendarClock size={18} color="#00A0A6" />
                      <Text className="font-outfit-medium text-texto">
                        {horarioInicio.toLocaleDateString("pt-BR")}
                      </Text>
                    </Pressable>
                  )}
                </View>

                <View className="flex-1">
                  <Text className="text-xs text-subtexto mb-1">Hora de Início</Text>
                  
                  {isWeb ? (
                    <View className="relative">
                      <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
                        <Clock size={18} color="#00A0A6" />
                      </View>
                      <input
                        type="time"
                        value={horarioInicio.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        onChange={handleTimeChangeWeb}
                        className="w-full h-12 pl-11 pr-4 rounded-[12px] border border-[#cacaca] bg-white text-base 
                                   focus:outline-none focus:border-primaria-azul focus:ring-2 focus:ring-primaria-azul/20
                                   transition-all duration-200"
                      />
                    </View>
                  ) : (
                    <Pressable
                      onPress={() => setPickerConfig("time")}
                      className="bg-bg border-[1px] border-[#cacaca] h-12 px-4 rounded-[12px] flex-row items-center gap-2 active:opacity-70"
                    >
                      <Clock size={18} color="#00A0A6" />
                      <Text className="font-outfit-medium text-texto">
                        {horarioInicio.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
            </View>

            {/* Restante do conteúdo permanece igual */}
            <Separator className="my-2 bg-[#B5B5B5]" decorative />

            <View className="gap-3 mt-2">
              <Text className="font-outfit-bold text-lg text-primaria-azul">
                Passos do Cronograma
              </Text>
              {passos.length === 0 && (
                <Text className="text-sm text-subtexto text-center italic">
                  Nenhum passo adicionado. Selecione uma predefinição abaixo.
                </Text>
              )}
              {passos.map((passo, index) => (
                <PresetCard 
                  key={passo.id_temporario}
                  data={passo.preset}
                  variant="passo"
                  stepNumber={index + 1}
                  isFirst={index === 0}
                  isLast={index === passos.length - 1}
                  onMoveUp={() => moverPasso(index, "cima")}
                  onMoveDown={() => moverPasso(index, "baixo")}
                  onRemove={() => removerPasso(passo.id_temporario)}
                />
              ))}
            </View>

            <Separator className="my-2 bg-[#B5B5B5]" decorative />

            <View className="gap-3 mt-4">
              <View className="flex-row justify-between items-center">
                <Text className="font-outfit-bold text-lg">
                  Predefinições
                </Text>
                <View className="flex-row gap-2">
                  <Pressable
                    className="active:opacity-50 bg-primaria-azul rounded-[12px] w-[40px] h-[40px] items-center justify-center self-end"
                    onPress={() => router.push("/(tabs)/operacao/presets")}
                  >
                    <Layers size={24} color="white" strokeWidth={2.5} />
                  </Pressable>
                  <Pressable
                    className="active:opacity-50 bg-primaria-azul rounded-[12px] w-[40px] h-[40px] items-center justify-center self-end"
                    onPress={() => router.push("/(tabs)/operacao/addPreset")}
                  >
                    <Plus size={24} color="white" strokeWidth={2.5} />
                  </Pressable>
                </View>
              </View>
              {isLoadingPresets ? (
                <ActivityIndicator size="small" color="#00A0A6" />
              ) : bibliotecaPresets?.length === 0 ? (
                <Text className="text-sm text-subtexto">
                  Você não possui predefinições criadas.
                </Text>
              ) : (
                bibliotecaPresets?.map((preset) => (
                  <PresetCard
                    key={preset.id}
                    data={preset}
                    variant="adicionar"
                    onAdd={() => adicionarPasso(preset)}
                  />
                ))
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* DateTimePicker apenas para mobile */}
      {!isWeb && pickerConfig && (
        <DateTimePicker
          value={horarioInicio}
          mode={pickerConfig}
          is24Hour={true}
          display="default"
          onChange={handlePickerChange}
        />
      )}

      {Platform.OS === "ios" && pickerConfig && (
        <View className="absolute bottom-0 w-full bg-white p-4 border-t-[1px] border-[#cacaca] z-50">
          <Button onPress={() => setPickerConfig(null)} className="bg-primaria-azul">
            <Text className="text-white">Confirmar Seleção</Text>
          </Button>
        </View>
      )}
    </Screen>
  );
}
