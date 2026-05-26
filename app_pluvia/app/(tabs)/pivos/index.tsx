/**
 * ✅ [PORTABILIDADE WEB CONCLUÍDA]
 * * MODIFICAÇÕES REALIZADAS PARA ADAPTAÇÃO WEB:
 * 1. GRID RESPONSIVO: Adicionado 'useWindowDimensions' para detectar a largura da tela dinamicamente. 
 * - Mobile (< 768px): 1 Coluna
 * - Tablet/Laptop (< 1150px): 2 Colunas
 * - Monitor Desktop: 4 Colunas
 * O 'numColumns' do FlashList foi vinculado a este cálculo.
 * 2. FEEDBACK DE MOUSE: 'cursor-pointer' e 'hover' adicionados ao botão de filtro e ao select.
 * 3. LAYOUT: Inserida uma View como wrapper para manter os elementos organizados mesmo quando a lista preencher múltiplas colunas.
 * 4. ATUALIZAÇÃO (FlashList v2.0.2): Removido o 'estimatedItemSize' pois o cálculo agora é automático na versão atual da biblioteca.
 */

import { useState, useMemo } from "react";
import * as React from "react";
// [WEB] Importado 'useWindowDimensions' para controlar o Grid do FlashList na web
import { View, Pressable, Platform, ActivityIndicator, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { useRouter } from "expo-router";
import PivotCard from "@/components/custom/PivotCard";
import { FlashList } from "@shopify/flash-list";
import { Funnel } from "lucide-react-native";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TriggerRef } from "@rn-primitives/select";
import Header from "@/components/custom/Header";
import { Screen } from "@/components/custom/Screen";

// Importando Hooks Reais
import { useDashboardTelemetria } from "@/hooks/api/useTelemetria";
import { useFazendas } from "@/hooks/api/useFazendas";

export default function ListaDePivos() {
  const ref = React.useRef<TriggerRef>(null);
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  const [open, setOpen] = useState(false);
  const [fazendaFiltro, setFazendaFiltro] = useState<{ label: string; value: string } | undefined>(undefined);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // [WEB] Ler a largura atual da tela
  const { width } = useWindowDimensions();

  const getColunas = () => {
    if (width >= 1650) return 4; 
    if (width >= 1250) return 3; 
    if (width >= 870) return 2; 
    return 1;                   
  };

  // Substituímos o usePivos pelo hook do Dashboard completo
  const { data: pivosDashboard, isPending: isLoadingPivos, refetch: refetchPivos } = useDashboardTelemetria();
  const { data: fazendas, isPending: isLoadingFazendas, refetch: refetchFazendas } = useFazendas();

  const contentInsets = {
    top: insets.top,
    bottom: Platform.select({ ios: insets.bottom, android: insets.bottom + 24 }),
    left: 12, right: 12,
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refetchPivos(), refetchFazendas()]);
    setIsRefreshing(false);
  };

  const pivosExibidos = useMemo(() => {
    if (!pivosDashboard) return [];
    if (!fazendaFiltro || fazendaFiltro.value === "todos") return pivosDashboard;
    return pivosDashboard.filter(pivo => pivo.fazenda_id === fazendaFiltro.value);
  }, [pivosDashboard, fazendaFiltro]);

  return (
    <Screen className="justify-center overflow-scroll px-0">
      <View>
        
        <View className="flex-row justify-between items-center mb-4 px-3">
          <Header title="Pivôs" subtitle="AXC23KJ09P" />

          {isLoadingFazendas ? (
            <ActivityIndicator size="small" color="#00A0A6" />
          ) : (
            <Select
              value={fazendaFiltro}
              onValueChange={setFazendaFiltro}
              onOpenChange={setOpen}
            >
              <SelectTrigger
                ref={ref}
                // [WEB] Adicionado cursor-pointer e hover:opacity-90 e mantido tamanho original do backend
                className={`w-[220px] border-[1px] border-b-[1px] border-[#b8b8b8] bg-white cursor-pointer hover:opacity-90 ${open ? "rounded-t-[12px] rounded-b-none border-b-0" : "rounded-[12px] border-b-[1px]"}`}
              >
                <SelectValue placeholder="Fazenda" />
              </SelectTrigger>
              
              <SelectContent
                insets={contentInsets}
                className={`w-[220px] border-[#b8b8b8] bg-white ${open ? "rounded-b-[12px] rounded-t-none" : "rounded-xl"}`}
              >
                <SelectGroup>
                  
                  {/* OPÇÃO DE DESTAQUE */}
                  <SelectItem 
                    label="Todas as Fazendas" 
                    value="todos" 
                    className="border-b-[1px] border-[#b8b8b8] mb-1"
                  >
                    <Text className="font-outfit-bold text-white">
                      Todas as Fazendas
                    </Text>
                  </SelectItem>

                  {/* LISTA DINÂMICA DE FAZENDAS */}
                  {fazendas?.map((fazenda, index) => (
                    <SelectItem
                      key={fazenda.id}
                      label={fazenda.nome_fazenda}
                      value={fazenda.id}
                      className={index % 2 !== 0 ? "bg-[#E1E1E1]" : "bg-transparent"}
                    >
                      <Text className="font-outfit text-texto">
                        {fazenda.nome_fazenda}
                      </Text>
                    </SelectItem>
                  ))}
                  
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </View>

        <View className="w-full flex-row justify-end mb-4 px-3">
          <Dialog>
            <DialogTrigger asChild>
              {/* [WEB] Adicionado cursor-pointer e hover:opacity-80 */}
              <Pressable className