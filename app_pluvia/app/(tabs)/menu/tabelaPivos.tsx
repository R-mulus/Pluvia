import React from "react";
import { View, ActivityIndicator } from "react-native";
import { Screen } from "@/components/custom/Screen";
import Header from "@/components/custom/Header";
import { Table } from "@/components/custom/Table";

import { usePivos } from "@/hooks/api/usePivos";
import { colunasPivos } from "../menu";

export default function TodosPivos() {
  // * Pega TODOS os pivôs
  const { data: pivos, isPending } = usePivos();

  return (
    <Screen>
      <Header title="Todos os Pivôs" subtitle="AXCP2134HIM" />
      
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