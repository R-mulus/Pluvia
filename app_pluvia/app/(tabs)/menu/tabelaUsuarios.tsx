import React from "react";
import { View, ActivityIndicator } from "react-native";
import { Screen } from "@/components/custom/Screen";
import Header from "@/components/custom/Header";
import { Table } from "@/components/custom/Table";

import { useUsuarios } from "@/hooks/api/useUsuarios";
import { colunasUsuarios } from "../menu";

export default function TodosUsuarios() {
  // Pega os dados direto do cache instantaneamente
  const { data: pivos, isPending } = useUsuarios();

  return (
    <Screen>
      <Header title="Todos os Pivôs" subtitle="AXCP2134HIM" />
      
      <View className="flex-1 mt-4 rounded-md">
        {isPending ? (
          <ActivityIndicator size="large" color="#00A0A6" />
        ) : (
          <Table columns={colunasUsuarios} data={pivos || []}/>
        )}
      </View>
    </Screen>
  );
}