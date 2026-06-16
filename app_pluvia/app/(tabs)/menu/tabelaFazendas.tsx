import React, { useMemo } from "react";
import { View, ActivityIndicator, Alert, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { Screen } from "@/components/custom/Screen";
import Header from "@/components/custom/Header";
import { Table, TableColumn } from "@/components/custom/Table";
import { Trash } from "lucide-react-native";

import { useFazendas, useDeletarFazenda } from "@/hooks/api/useFazendas";
import { Fazenda } from "@/services/api/fazendas.service";

export default function TodasFazendas() {
  const { data: fazendas, isPending } = useFazendas();
  const { mutateAsync: deletarFazenda } = useDeletarFazenda();

  const confirmarExclusao = (nome: string, id: string) => {
    Alert.alert(
      "Excluir Fazenda",
      `Tem certeza que deseja excluir ${nome}? Esta ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deletarFazenda(id);
              Alert.alert("Sucesso", "Fazenda excluída com sucesso!");
            } catch (error: any) {
              const mensagemBackend = error.response?.data?.message || error.response?.data?.mensagem;
              if (mensagemBackend) {
                Alert.alert("Ação Bloqueada", mensagemBackend);
              } else {
                Alert.alert("Erro", "Não foi possível excluir. Verifique se há pivôs vinculados.");
              }
            }
          },
        },
      ]
    );
  };

  const colunasFazendas: TableColumn<Fazenda>[] = useMemo(() => [
    { key: "id", title: "ID", width: 80, renderCell: (item) => <Text className="text-xs uppercase text-white font-bold text-center">{item.id.slice(0, 5)}</Text> },
    { key: "nome_fazenda", title: "Nome", width: 190, renderCell: (item) => <Text className="text-center">{item.nome_fazenda}</Text> },
    { key: "codigo_identificacao", title: "Código", width: 90, renderCell: (item) => <Text className="text-center">{item.codigo_identificacao}</Text> },
    { key: "endereco", title: "Endereço", width: 220, renderCell: (item) => <Text className="text-center">{item.endereco || "-"}</Text> },
    { key: "area_total", title: "Área Total", width: 110, renderCell: (item) => <Text className="text-center">{item.area_total ? `${item.area_total} Ha` : "-"}</Text> },
    {
      key: "acoes", title: "Ações", width: 80,
      renderCell: (item) => (
        <View className="items-center justify-center">
          <Pressable className="p-2 active:opacity-50" onPress={() => confirmarExclusao(item.nome_fazenda, item.id)}>
            <Trash size={20} color="#D32F2F" />
          </Pressable>
        </View>
      ),
    },
  ], []);

  return (
    <Screen>
      <Header title="Todas as Fazendas" subtitle="Controle Geral" />
      
      <View className="flex-1 mt-4 rounded-md">
        {isPending ? (
          <ActivityIndicator size="large" color="#00A0A6" />
        ) : (
          <Table columns={colunasFazendas} data={fazendas || []}/>
        )}
      </View>
    </Screen>
  );
}