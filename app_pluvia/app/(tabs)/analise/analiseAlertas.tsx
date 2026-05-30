import React, { useMemo } from "react";
import { View, ActivityIndicator } from "react-native";
import { Screen } from "@/components/custom/Screen";
import Header from "@/components/custom/Header";
import { Table, TableColumn } from "@/components/custom/Table";
import { TriangleAlert, Droplet } from "lucide-react-native";

import { useAlertas } from "@/hooks/api/useLogs";

export default function AnaliseAlertas() {
  const { data: alertasReais, isPending } = useAlertas(); // Busca sem limite

  const colunasAlertas: TableColumn<any>[] = [
    { key: "id", title: "ID", width: 60 },
    {
      key: "tag",
      title: <TriangleAlert size={18} color="white" />,
      width: 60,
      renderCell: (item) => {
        let bgColor = "bg-[#00A0A6]";
        if (item.tipo === "perigo") bgColor = "bg-[#D32F2F]";
        if (item.tipo === "sucesso") bgColor = "bg-[#0AA146]";
        const Icone = item.icone === "gota" ? Droplet : TriangleAlert;
        return (
          <View className={`${bgColor} w-full py-3 items-center justify-center rounded-r-xl`}>
            <Icone size={20} color="white" />
          </View>
        );
      },
    },
    { key: "evento", title: "Evento", width: 260 },
    { key: "data", title: "Data", width: 110 },
    { key: "hora", title: "Hora", width: 80 },
    { key: "pivo", title: "Pivô", width: 100 },
    { key: "operador", title: "Operador", width: 140 },
  ];

  const alertasFormatados = useMemo(() => {
    if (!alertasReais) return [];
    
    return alertasReais.map((log: any) => {
      const dateObj = new Date(log.timestamp);
      const nomeOperador = Array.isArray(log.usuarios) ? log.usuarios[0]?.nome : log.usuarios?.nome;
      const nomePivo = Array.isArray(log.pivos) ? log.pivos[0]?.nome_pivo : log.pivos?.nome_pivo;

      let corTipo = "info"; 
      let iconeTipo = "alerta";

      if (log.tipo_evento === "erro" || log.tipo_evento === "falha") {
        corTipo = "perigo"; 
      } else if (log.tipo_evento === "conclusao") {
        corTipo = "sucesso"; 
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
        hora: dateObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        pivo: nomePivo || log.pivo_id?.substring(0, 5) || "-",
        operador: nomeOperador || "Sistema Autônomo",
      };
    });
  }, [alertasReais]);

  return (
    <Screen>
      <Header title="Alertas do Sistema" subtitle="Histórico Geral" />
      
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