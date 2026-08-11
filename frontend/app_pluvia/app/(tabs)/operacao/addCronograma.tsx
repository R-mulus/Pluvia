/**
 * ✅ [PORTABILIDADE WEB CONCLUÍDA - TELA ADD CRONOGRAMA]
 * * MODIFICAÇÕES REALIZADAS PARA ADAPTAÇÃO WEB E MOBILE:
 * 1. MUDANÇA DE LISTAS PARA GRID RESPONSIVO: Ambas as listas ("Passos" e "Predefinições") foram alteradas de colunas para Grids (flex-row flex-wrap).
 * 2. LARGURA DINÂMICA: A largura dos cards agora usa 'getColunas()' com base na tela (1 por linha no mobile, até 4 no desktop).
 * 3. INTEGRAÇÃO SETAS HORIZONTAIS: A prop 'isGrid={getColunas() > 1}' é enviada para o PresetCard, transformando as setas em Esquerda/Direita quando em tela de PC.
 * 4. FIX SCROLLVIEW E GAPS: O ScrollView permanece gerenciando tudo. Os 'gap-*' não suportados na Web foram traduzidos para 'mb-4' e '-mx-2' para não quebrar.
 */

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
  useWindowDimensions,
  DimensionValue,
} from "react-native";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useRouter, useGlobalSearchParams } from "expo-router";
import { Screen } from "@/components/custom/Screen";
import Header from "@/components/custom/Header";
import {
  CalendarClock,
  Clock,
  Save,
  Plus,
  Layers,
} from "lucide-react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import PresetCard from "@/components/custom/PresetCard";
import { useCriarCronograma } from "@/hooks/api/useCronogramas";
import { usePresetsPivo } from "@/hooks/api/usePresets";

interface PassoSelecionado {
  id_temporario: string;
  preset: any;
}

// Neutraliza fuso horário (mantido)
const neutralizarFusoHorario = (date: Date) => {
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString();
};

export default function AdicionarCronograma() {
  const router = useRouter();
  const { pivo_id } = useGlobalSearchParams();
  const { data: bibliotecaPresets, isPending: isLoadingPresets } = usePresetsPivo(pivo_id as string);
  const { mutateAsync: criarCronograma, isPending: isCriando } = useCriarCronograma();

  const [nomeCronograma, setNomeCronograma] = useState("");
  const [passos, setPassos] = useState<PassoSelecionado[]>([]);
  const [horarioInicio, setHorarioInicio] = useState<Date>(new Date());
  const [pickerConfig, setPickerConfig] = useState<"date" | "time" | null>(null);

  // [WEB] Lendo a largura da tela para Grid
  const { width } = useWindowDimensions();

  const getColunas = () => {
    if (width >= 1650) return 4; 
    if (width >= 1250) return 3; 
    if (width >= 870) return 2; 
    return 1;                   
  };

  // ==================== HANDLERS ====================

  const handlePickerChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") setPickerConfig(null);
    if (selectedDate) setHorarioInicio(selectedDate);
  };

  // Para Web - Atualiza data
  const handleDateChangeWeb = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [year, month, day] = e.target.value.split("-").map(Number);
    const newDate = new Date(horarioInicio);
    newDate.setFullYear(year, month - 1, day);
    setHorarioInicio(newDate);
  };

  // Para Web - Atualiza hora
  const handleTimeChangeWeb = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(":").map(Number);
    const newDate = new Date(horarioInicio);
    newDate.setHours(hours, minutes, 0, 0);
    setHorarioInicio(newDate);
  };

  const adicionarPasso = (preset: any) => {
    setPassos([...passos, { id_temporario: Math.random().toString(), preset }]);
  };

  const removerPasso = (id_temporario: string) => {
    setPassos(passos.filter((p) => p.id_temporario !== id_temporario));
  };

  const moverPasso = (index: number, direcao: "cima" | "baixo") => {
    if (direcao === "cima" && index === 0) return;
    if (direcao === "baixo" && index === passos.length - 1) return;

    const novosPassos = [...passos];
    const swapIndex = direcao === "cima" ? index - 1 : index + 1;
    [novosPassos[index], novosPassos[swapIndex]] = [novosPassos[swapIndex], novosPassos[index]];
    setPassos(novosPassos);
  };

  const handleSalvar = async () => {
    try {
      if (!pivo_id) return Alert.alert("Erro", "ID do pivô não encontrado.");
      if (!nomeCronograma) return Alert.alert("Aviso", "Dê um nome para o cronograma.");
      if (passos.length === 0) return Alert.alert("Aviso", "Adicione pelo menos um passo.");

      const isUUID = (str: string) => /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/i.test(str);

      const payload = {
        pivo_id: pivo_id as string,
        nome: nomeCronograma,
        horario_inicio: neutralizarFusoHorario(horarioInicio),
        passos: passos.map((p, index) => ({
          preset_origem_id: isUUID(p.preset.id) ? p.preset.id : undefined,
          nome: p.preset.nome,
          lamina: p.preset.lamina,
          angulo_inicial: p.preset.angulo_inicial,
          angulo_final: p.preset.angulo_final,
          irrigacao: p.preset.irrigacao,
          direcao: p.preset.direcao,
          ordem: index + 1,
        })),
      };

      await criarCronograma(payload);
      Alert.alert("Sucesso", "Cronograma criado!");
      router.back();
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Falha ao criar cronograma.");
    }
  };

  // ==================== RENDER ====================

  const isWeb = Platform.OS === "web";
  const numColunas = getColunas();
  const isGridAtivo = numColunas > 1;

  return (
    <Screen>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}>
          <View className="flex-row justify-between mb-6">
            <Header title="Novo Cronograma" subtitle="Planejamento de Execução" />
            <Pressable onPress={handleSalvar} disabled={isCriando} className="bg-primaria-azul rounded-[12px] w-[40px] h-[40px] items-center justify-center active:opacity-50 cursor-pointer hover:opacity-80 transition-opacity">
              {isCriando ? <ActivityIndicator size="small" color="white" /> : <Save size={20} color="white" strokeWidth={2.5} />}
            </Pressable>
          </View>

          {/* O container interno do formulário foi mantido igual, sem Grid */}
          <View className="flex-1">
            {/* === Dados Básicos === */}
            <View className="bg-white p-4 rounded-[12px] border-[2px] border-secundaria-azul/30 mb-6">
              <View className="mb-4">
                <Text className="text-xs text-subtexto mb-1">Nome da Execução</Text>
                <Input
                  value={nomeCronograma}
                  onChangeText={setNomeCronograma}
                  className="rounded-[12px] border-[2px] border-l-[16px] bg-white border-secundaria-azul"
                  placeholder="Ex: Manejo Fim de Semana"
                />
              </View>

              {/* === Data e Hora - Web vs Mobile === */}
              <View className="flex-row w-full">
                
                {/* === DATA === */}
                <View className="flex-1 pr-2">
                  <Text className="text-xs text-subtexto mb-1">Data de Início</Text>
                  
                  {isWeb ? (
                    <View className="relative">
                      <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                        <CalendarClock size={18} color="#00A0A6" />
                      </View>
                      <input
                        type="date"
                        value={horarioInicio.toISOString().split("T")[0]}
                        onChange={handleDateChangeWeb}
                        className="w-full h-12 pl-11 pr-4 rounded-[12px] border border-[#cacaca] bg-white text-base 
                                  focus:outline-none focus:border-primaria-azul focus:ring-2 focus:ring-primaria-azul/20
                                  transition-all duration-200 cursor-pointer"
                      />
                    </View>
                  ) : (
                    <Pressable
                      onPress={() => setPickerConfig("date")}
                      className="bg-bg border-[1px] border-[#cacaca] h-12 px-4 rounded-[12px] flex-row items-center active:opacity-70"
                    >
                      <CalendarClock size={18} color="#00A0A6"/>
                      <Text className="font-outfit-medium text-texto ml-2">
                        {horarioInicio.toLocaleDateString("pt-BR")}
                      </Text>
                    </Pressable>
                  )}
                </View>

                {/* === HORA === */}
                <View className="flex-1 pl-2">
                  <Text className="text-xs text-subtexto mb-1">Hora de Início</Text>
                  
                  {isWeb ? (
                    <View className="relative">
                      <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                        <Clock size={18} color="#00A0A6" />
                      </View>
                      <input
                        type="time"
                        value={horarioInicio.toLocaleTimeString("pt-BR", { 
                          hour: "2-digit", 
                          minute: "2-digit" 
                        })}
                        onChange={handleTimeChangeWeb}
                        className="w-full h-12 pl-11 pr-4 rounded-[12px] border border-[#cacaca] bg-white text-base 
                                  focus:outline-none focus:border-primaria-azul focus:ring-2 focus:ring-primaria-azul/20
                                  transition-all duration-200 cursor-pointer"
                      />
                    </View>
                  ) : (
                    <Pressable
                      onPress={() => setPickerConfig("time")}
                      className="bg-bg border-[1px] border-[#cacaca] h-12 px-4 rounded-[12px] flex-row items-center active:opacity-70"
                    >
                      <Clock size={18} color="#00A0A6"/>
                      <Text className="font-outfit-medium text-texto ml-2">
                        {horarioInicio.toLocaleTimeString("pt-BR", { 
                          hour: "2-digit", 
                          minute: "2-digit" 
                        })}
                      </Text>
                    </Pressable>
                  )}
                </View>
              </View>
            </View>

            {/* ========================================================= */}
            {/* GRID: PASSOS DO CRONOGRAMA */}
            {/* ========================================================= */}
            <View className="mb-6">
              <Text className="font-outfit-bold text-lg text-primaria-azul mb-3">
                Passos do Cronograma
              </Text>
              {passos.length === 0 && (
                <Text className="text-sm text-subtexto text-center italic">
                  Nenhum passo adicionado. Selecione uma predefinição abaixo.
                </Text>
              )}
              
              {/* [WEB FIX] Container flex wrap para a Grid */}
              <View className={`flex-row flex-wrap w-full ${isGridAtivo ? '-mx-2' : ''}`}>
                {passos.map((passo, index) => {

                  return (
                    <View 
                        key={passo.id_temporario}
                        style={{
                          width: `${100 / numColunas}%` as DimensionValue,
                        }}
                        className={`${isGridAtivo ? 'px-2' : ''} mb-4`}
                    >
                      <PresetCard 
                        data={passo.preset}
                        variant="passo"
                        stepNumber={index + 1}
                        isFirst={index === 0}
                        isLast={index === passos.length - 1}
                        onMoveUp={() => moverPasso(index, "cima")}
                        onMoveDown={() => moverPasso(index, "baixo")}
                        onRemove={() => removerPasso(passo.id_temporario)}
                        isGrid={isGridAtivo} // Passa para o card saber se usa Left/Right ou Up/Down
                      />
                    </View>
                  );
                })}
              </View>
            </View>

            {/* ========================================================= */}
            {/* GRID: PREDEFINIÇÕES (BIBLIOTECA) */}
            {/* ========================================================= */}
            <View className="mt-2">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="font-outfit-bold text-lg">Predefinições</Text>
                <View className="flex-row gap-2">
                  <Pressable
                    className="active:opacity-50 bg-primaria-azul rounded-[12px] w-[40px] h-[40px] items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                    onPress={() => router.push({ pathname: "/(tabs)/operacao/presets", params: { pivo_id } })}
                  >
                    <Layers size={24} color="white" strokeWidth={2.5} />
                  </Pressable>
                  <Pressable
                    className="active:opacity-50 bg-primaria-azul rounded-[12px] w-[40px] h-[40px] items-center justify-center cursor-pointer hover:opacity-80 transition-opacity"
                    onPress={() => router.push({ pathname: "/(tabs)/operacao/addPreset", params: { pivo_id } })}
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
                <View className={`flex-row flex-wrap w-full ${isGridAtivo ? '-mx-2' : ''}`}>
                  {bibliotecaPresets?.map((preset) => {
                    const larguraColuna = `${100 / numColunas}%`;

                    return (
                      <View 
                          key={preset.id}
                          style={{
                            width: `${100 / numColunas}%` as DimensionValue,
                          }}
                          className={`${isGridAtivo ? 'px-2' : ''} mb-4`}
                      >
                        <PresetCard
                          data={preset}
                          variant="adicionar"
                          onAdd={() => adicionarPasso(preset)}
                          isGrid={isGridAtivo}
                        />
                      </View>
                    );
                  })}
                </View>
              )}
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* DateTimePicker Nativo (somente mobile) */}
      {!isWeb && pickerConfig && (
        <DateTimePicker
          value={horarioInicio}
          mode={pickerConfig}
          is24Hour={true}
          display="default"
          onChange={handlePickerChange}
        />
      )}

      {/* Botão confirmar no iOS */}
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