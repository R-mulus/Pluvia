import React from "react";
import { View, ActivityIndicator } from "react-native";
import { Screen } from "@/components/custom/Screen";
import Header from "@/components/custom/Header";
import { Table } from "@/components/custom/Table";

import { useFazendas } from "@/hooks/api/useFazendas";
import { colunasFazendas } from "../menu";

export default function TodasFazendas() {
  // ! Pega TODAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAS AS FAZENDAS
  const { data: pivos, isPending } = useFazendas();

  return (
    <Screen>
      <Header title="Todos os Pivôs" subtitle="AXCP2134HIM" />
      
      <View className="flex-1 mt-4 rounded-md">
        {isPending ? (
          <ActivityIndicator size="large" color="#00A0A6" />
        ) : (
          <Table columns={colunasFazendas} data={pivos || []}/>
        )}
      </View>
    </Screen>
  );
}