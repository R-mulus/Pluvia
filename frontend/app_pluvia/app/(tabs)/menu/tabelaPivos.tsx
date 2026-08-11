import React, { useMemo } from "react";
import { View, ActivityIndicator, Alert, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { Screen } from "@/components/custom/Screen";
import Header from "@/components/custom/Header";
import { Table, TableColumn } from "@/components/custom/Table";
import { Trash } from "lucide-react-native";

import { usePivos, useDeletarPivo } from "@/hooks/api/usePivos";
import { Pivo } from "@/services/api/pivos.service";

export default function TodosPivos() {
  const { data: pivos, isPending } = usePivos();
  const { mutateAsync: deletarPivo } = useDeletarPivo();

  const confirmarExclusao = (nome: string, id: string) => {
    Alert.alert(
      "Excluir Pivô",
      `Tem certeza que deseja excluir ${nome}? Esta ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deletarPivo(id);
              Alert.alert("Sucesso", "Pivô excluído com sucesso!");
            } catch (error: any) {
              const mensagemBackend = error.response?.data?.message || error.response?.data?.mensagem;
              if (mensagemBackend) {
                Alert.alert("Ação Bloqueada", mensagemBackend);
              } else {
                Alert.alert("Erro", "Não foi possível excluir.");
              }
            }
          },
        },
      ]
    );
  };

  const colunasPivos: TableColumn<Pivo>[] = useMemo(() => [
    { key: "id", title: "ID", width: 80, renderCell: (item) => <Text className="text-xs uppercase text-white font-bold text-center">{item.id.slice(0, 5)}</Text> },
    { key: "fazenda_id", title: "Fazenda", width: 190, renderCell: (item) => <Text className="text-center">{item.fazendas?.nome_fazenda || "-"}</Text> },
    { key: "nome_pivo", title: "Nome", width: 140, renderCell: (item) => <Text className="text-center">{item.nome_pivo}</Text> },
    { key: "codigo_serie", title: "Nº Série", width: 140, renderCell: (item) => <Text className="text-center">{item.codigo_serie}</Text> },
    { key: "vazao", title: "Vazão Nominal", width: 130, renderCell: (item) => <Text className="text-center">{(item as any).vazao ? `${(item as any).vazao} L/h` : "-"}</Text> },
    {
      key: "acoes", title: "Ações", width: 80,
      renderCell: (item) => (
        <View className="items-center justify-center">
          <Pressable className="p-2 active:opacity-50" onPress={() => confirmarExclusao(item.nome_pivo, item.id)}>
            <Trash size={20} color="#D32F2F" />
          </Pressable>
        </View>
      ),
    },
  ], []);

  return (
    <Screen>
      <Header title="Todos os Pivôs" subtitle="Controle Geral" />
      
      <View className="flex-1 mt-4 rounded-md">
        {isPending ? (
          <ActivityIndicator size="large" color="#00A0A6" />
        ) : (
          <Table columns={colunasPivos} data={pivos || []}/>
        )}
      </View>
    </Screen>
  );
}