import React, { useMemo } from "react";
import { View, ActivityIndicator } from "react-native";
import { Screen } from "@/components/custom/Screen";
import Header from "@/components/custom/Header";
import { Table } from "@/components/custom/Table";

import { useAlertas } from "@/hooks/api/useLogs";
import { colunasAlertas } from ".";

export default function TodosAlertas() {
  // * Pega TODOS os alertas
  const { data: alertasReais, isPending } = useAlertas();

  const alertasFormatados = useMemo(() => {
    if (!alertasReais) return [];
    
    return alertasReais.map((log: any) => {
      const dateObj = new Date(log.timestamp);
      
      const nomeOperador = Array.isArray(log.usuarios)
        ? log.usuarios[0]?.nome
        : log.usuarios?.nome;
        
      const nomePivo = Array.isArray(log.pivos)
        ? log.pivos[0]?.nome_pivo
        : log.pivos?.nome_pivo;

      let corTipo = "info"; // Azul (alertas, comandos, etc)
      let iconeTipo = "alerta"; // Triângulo (Padrão)

      if (log.tipo_evento === "erro" || log.tipo_evento === "falha") {
        corTipo = "perigo"; // Vermelho
      } else if (log.tipo_evento === "conclusao") {
        corTipo = "sucesso"; // Verde
      }

      if (log.tipo_evento === "comando" || log.tipo_evento === "sensor") {
        iconeTipo = "gota";
      }

      return {
        id: log.id?.substring(0, 5).toUpperCase() || "-",
        tipo: corTipo,
        icone: iconeTipo,
        evento: log.codigo ? log.codigo.replace(/_/g, " ") : "Alerta do Sistema",
        data: dateObj.toLocaleDateString("pt-BR"),
        hora: dateObj.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        pivo: nomePivo || log.pivo_id?.substring(0, 5) || "Sistema",
        operador: nomeOperador || "Sistema Autônomo",
      };
    });
  }, [alertasReais]);

  return (
    <Screen>
      <Header title="Todos os Alertas" subtitle="AXCP2134HIM" />
      
      <View className="flex-1 mt-6 rounded-md">
        {isPending ? (
          <ActivityIndicator size="large" color="#00A0A6" />
        ) : (
          <Table columns={colunasAlertas} data={alertasFormatados || []} alerta />
        )}
      </View>
    </Screen>
  );
}