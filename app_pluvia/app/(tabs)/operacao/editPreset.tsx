import * as React from "react";
import { useState, useEffect } from "react";
import { View, Pressable, ActivityIndicator, Alert, ScrollView } from "react-native";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { useRouter, useLocalSearchParams, Stack } from "expo-router"; // <- Importamos o Stack
import { Screen } from "@/components/custom/Screen";
import Header from "@/components/custom/Header";
import { Save, RotateCcw, RotateCw, ChevronLeft } from "lucide-react-native"; // <- Importamos ChevronLeft para customizar a TopBar
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// Hooks reais de Presets
import { usePresetsPivo, useCriarPreset, useExcluirPreset } from "@/hooks/api/usePresets";

export default function EditarPresetBiblioteca() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id, pivo_id, origem, fb_nome, fb_lamina, fb_angulo_inicial, fb_angulo_final, fb_irrigacao, fb_direcao } = params;

  const { data: presets, isPending: isLoadingDados } = usePresetsPivo(pivo_id as string);
  const { mutateAsync: criarPreset, isPending: isSalvando } = useCriarPreset();
  const { mutateAsync: excluirPreset } = useExcluirPreset();

  const [nome, setNome] = useState("");
  const [lamina, setLamina] = useState("");
  const [anguloInicial, setAnguloInicial] = useState("");
  const [anguloFinal, setAnguloFinal] = useState("");
  const [isIrrigating, setIsIrrigating] = useState(false);
  const [direcao, setDirecao] = useState("horario");

  useEffect(() => {
  // Evita sobrescrever os campos depois que já foram carregados
  if (nome) return;

  // Tenta achar no banco primeiro
  const presetBanco = presets?.find(p => p.id === id);

  if (presetBanco) {
    setNome(presetBanco.nome);
    setLamina(presetBanco.lamina.toString());
    setAnguloInicial(presetBanco.angulo_inicial.toString());
    setAnguloFinal(presetBanco.angulo_final.toString());
    setIsIrrigating(presetBanco.irrigacao);
    setDirecao(
      presetBanco.direcao === "ANTI_HORARIO"
        ? "reverso"
        : "horario"
    );
  } else if (fb_nome) {
    // PLANO B: Usa os Fallbacks da URL se não achou no banco
    setNome(fb_nome as string);
    setLamina(fb_lamina as string);
    setAnguloInicial(fb_angulo_inicial as string);
    setAnguloFinal(fb_angulo_final as string);
    setIsIrrigating(fb_irrigacao === "true");
    setDirecao(
      fb_direcao === "ANTI_HORARIO"
        ? "reverso"
        : "horario"
    );
  }
}, [presets, id]);

  const handleSalvar = async () => {
    try {
      if (!lamina || !anguloInicial || !anguloFinal) {
        Alert.alert("Erro", "Preencha todos os campos numéricos.");
        return;
      }

      const payload = {
        pivo_id: pivo_id as string,
        nome: nome || "Molde Editado",
        lamina: parseFloat(lamina.replace(",", ".")) || 0,
        angulo_inicial: parseInt(anguloInicial, 10) || 0,
        angulo_final: parseInt(anguloFinal, 10) || 0,
        irrigacao: isIrrigating,
        direcao: (direcao === "reverso" ? "ANTI_HORARIO" : "HORARIO") as "HORARIO" | "ANTI_HORARIO",
      };

      await excluirPreset(id as string); 
      await criarPreset(payload);
      
      Alert.alert("Sucesso", "Preset atualizado!");
      handleVoltar(); // Usa a nossa função segura
    } catch (error) {
      Alert.alert("Erro", "Falha ao atualizar preset.");
    }
  };

  // Função segura de voltar que burla a Stack do Expo Router
  const handleVoltar = () => {
    if (origem === 'pivo') {
      router.navigate(`/(tabs)/pivos/${pivo_id}`);
    } else {
      router.back();
    }
  };

  if (isLoadingDados && !fb_nome) {
    return <Screen className="justify-center items-center"><ActivityIndicator size="large" color="#00A0A6" /></Screen>;
  }

  return (
    <Screen>
      {/* A MÁGICA DA NAVEGAÇÃO: 
        Sobrescrevemos o botão voltar nativo da TopBar para ele obedecer às nossas regras, não as da aba.
      */}
      <Stack.Screen 
        options={{
          headerLeft: () => (
            <Pressable onPress={handleVoltar} className="p-2 -ml-2 flex-row items-center active:opacity-50">
              <ChevronLeft size={28} color="#0D0D0D" />
            </Pressable>
          )
        }} 
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row justify-between mb-8">
          <Header title={nome || "Preset"} subtitle="Editar Predefinição" />
          <Pressable onPress={handleSalvar} disabled={isSalvando} className="bg-primaria-azul rounded-[12px] w-[40px] h-[40px] items-center justify-center">
            {isSalvando ? <ActivityIndicator size="small" color="white" /> : <Save size={20} color="white" />}
          </Pressable>
        </View>

        <View className="gap-6">
          <View className="gap-1">
            <Text className="text-xs text-subtexto">Nome do Molde</Text>
            <Input value={nome} onChangeText={setNome} className="rounded-[12px] border-[2px] bg-white border-secundaria-azul" />
          </View>

          <View className="flex-row gap-4">
             <View className="flex-1 gap-1">
               <Text className="text-xs text-subtexto">Lâmina (mm)</Text>
               <Input value={lamina} onChangeText={setLamina} keyboardType="numeric" className="rounded-[12px] border-l-[16px] border-l-secundaria-azul bg-white" />
             </View>
             <View className="flex-1 gap-1">
               <Text className="text-xs text-subtexto">Início (°)</Text>
               <Input value={anguloInicial} onChangeText={setAnguloInicial} keyboardType="numeric" className="rounded-[12px] border-l-[16px] border-l-secundaria-azul bg-white" />
             </View>
             <View className="flex-1 gap-1">
               <Text className="text-xs text-subtexto">Final (°)</Text>
               <Input value={anguloFinal} onChangeText={setAnguloFinal} keyboardType="numeric" className="rounded-[12px] border-l-[16px] border-l-secundaria-azul bg-white" />
             </View>
          </View>

          <View className="gap-2">
            <Text className="text-sm font-outfit">Irrigação</Text>
            <View className="flex-row items-center gap-3">
              <Text className={!isIrrigating ? "font-outfit-bold" : "text-subtexto"}>Não</Text>
              <Switch checked={isIrrigating} onCheckedChange={setIsIrrigating} />
              <Text className={isIrrigating ? "font-outfit-bold" : "text-subtexto"}>Sim</Text>
            </View>
          </View>

          <ToggleGroup value={direcao} onValueChange={(v) => v && setDirecao(v)} type="single" className="flex-row gap-3">
             <ToggleGroupItem value="reverso" className={`flex-1 flex-row gap-2 border-[2px] rounded-l-2xl border-primaria-azul h-12 ${direcao === 'reverso' ? 'bg-primaria-azul' : ''}`}>
                <RotateCcw size={20} color={direcao === 'reverso' ? 'white' : '#00A0A6'} />
                <Text className={direcao === 'reverso' ? 'text-white' : 'text-primaria-azul'}>Reverso</Text>
             </ToggleGroupItem>
             <ToggleGroupItem value="horario" className={`flex-1 flex-row gap-2 border-[2px] rounded-r-2xl border-primaria-azul h-12 ${direcao === 'horario' ? 'bg-primaria-azul' : ''}`}>
                <Text className={direcao === 'horario' ? 'text-white' : 'text-primaria-azul'}>Horário</Text>
                <RotateCw size={20} color={direcao === 'horario' ? 'white' : '#00A0A6'} />
             </ToggleGroupItem>
          </ToggleGroup>

          <View className="flex-row gap-4 mt-10">
            <Button onPress={handleVoltar} className="bg-incorreto flex-1 h-[45px] rounded-pluvia"><Text className="text-white">Cancelar</Text></Button>
            <Button onPress={handleSalvar} className="bg-primaria-verde flex-1 h-[45px] rounded-pluvia"><Text className="text-white">Salvar Alterações</Text></Button>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}