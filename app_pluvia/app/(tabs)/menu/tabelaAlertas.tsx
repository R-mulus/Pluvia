import React from "react";
import { View, ActivityIndicator } from "react-native";
import { Screen } from "@/components/custom/Screen";
import Header from "@/components/custom/Header";
import { Table } from "@/components/custom/Table";

import { useAlertas } from "@/hooks/api/useLogs";
import { colunasAlertas } from ".";

export default function TodosAlertas() {
  // Pega os dados direto do cache instantaneamente
  const { data: pivos, isPending } = useAlertas();

  return (
    <Screen>
      <Header title="Todos os Alertas" subtitle="AXCP2134HIM" />
      
      
        {isPending ? (
          <ActivityIndicator size="large" color="#00A0A6" />
        ) : (
          <Table columns={colunasAlertas} data={pivos || []} alerta/>
        )}
     
    </Screen>
  );
}