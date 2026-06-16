import React, { useMemo } from "react";
import { View, ActivityIndicator, Alert, Pressable } from "react-native";
import { Text } from "@/components/ui/text";
import { Screen } from "@/components/custom/Screen";
import Header from "@/components/custom/Header";
import { Table, TableColumn } from "@/components/custom/Table";
import { Trash } from "lucide-react-native";

import { useUsuarios, useDeletarUsuario } from "@/hooks/api/useUsuarios";
import { Usuario } from "@/services/api/usuarios.service";

const formatCpfCnpj = (valor?: string) => {
  if (!valor) return "-";
  const numeros = valor.replace(/\D/g, "");
  if (numeros.length === 11)
    return numeros.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  if (numeros.length === 14)
    return numeros.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5",
    );
  return valor;
};

export default function TodosUsuarios() {
  const { data: usuarios, isPending } = useUsuarios();
  const { mutateAsync: deletarUsuario } = useDeletarUsuario();

  const confirmarExclusao = (nome: string, id: string) => {
    Alert.alert(
      "Excluir Usuário",
      `Tem certeza que deseja excluir ${nome}? Esta ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deletarUsuario(id);
              Alert.alert("Sucesso", "Usuário excluído com sucesso!");
            } catch (error: any) {
              const mensagemBackend = error.response?.data?.message || error.response?.data?.mensagem;
              if (mensagemBackend) {
                Alert.alert("Ação Bloqueada", mensagemBackend);
              } else {
                Alert.alert("Erro", "Não foi possível excluir. Verifique se ele possui fazendas.");
              }
            }
          },
        },
      ]
    );
  };

  const colunasUsuarios: TableColumn<Usuario>[] = useMemo(() => [
    { key: "id", title: "ID", width: 80, renderCell: (item) => <Text className="text-xs uppercase text-white font-bold text-center">{item.id.slice(0, 5)}</Text> },
    { key: "nome", title: "Nome", width: 220, renderCell: (item) => <Text className="text-center">{item.nome}</Text> },
    { key: "cpf_cnpj", title: "CPF/CNPJ", width: 170, renderCell: (item) => <Text className="text-center">{formatCpfCnpj(item.cpf_cnpj)}</Text> },
    { key: "email", title: "E-mail", width: 200, renderCell: (item) => <Text className="text-center">{item.email}</Text> },
    {
      key: "acoes", title: "Ações", width: 80,
      renderCell: (item) => (
        <View className="items-center justify-center">
          <Pressable className="p-2 active:opacity-50" onPress={() => confirmarExclusao(item.nome, item.id)}>
            <Trash size={20} color="#D32F2F" />
          </Pressable>
        </View>
      ),
    },
  ], []);

  return (
    <Screen>
      <Header title="Todos os Usuários" subtitle="Controle Geral" />
      
      <View className="flex-1 mt-4 rounded-md">
        {isPending ? (
          <ActivityIndicator size="large" color="#00A0A6" />
        ) : (
          <Table columns={colunasUsuarios} data={usuarios || []}/>
        )}
      </View>
    </Screen>
  );
}