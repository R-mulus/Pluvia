import React, { useMemo } from "react";
import { View, ActivityIndicator } from "react-native";
import { Screen } from "@/components/custom/Screen";
import Header from "@/components/custom/Header";
import { Table, TableColumn } from "@/components/custom/Table";

import { useLogsEventos } from "@/hooks/api/useLogs";

export default function AnaliseLogs() {
  const { data: logsReais, isPending } = useLogsEventos("todos");

  const colunasLog: TableColumn<any>[] = [
    { key: "id", title: "ID", width: 60 },
    { key: "data", title: "Data", width: 180 },
    { key: "pivo", title: "Pivô", width: 100 },
    { key: "status", title: "Status", width: 90 },
    { key: "evento", title: "Evento", width: 220 },
    { key: "origem", title: "Origem", width: 100 },
    { key: "operador", title: "Operador", width: 120 },
    { key: "voltas", title: "Voltas", width: 80 },
    { key: "irrigacao", title: "Irrigação", width: 100 },
    { key: "milimetros", title: "Milímetros", width: 110 },
    { key: "pressao", title: "Pressão", width: 110 },
    { key: "tensao", title: "Tensão", width: 90 },
    { key: "direcao", title: "Direção", width: 100 },
    { key: "anguloAtual", title: "Ângulo Atual", width: 120 },
    { key: "percentimetro", title: "Percentímetro", width: 130 },
  ];

  const logsFormatados = useMemo(() => {
    if (!logsReais) return [];
    
    return logsReais.map((log: any) => {
      const dateObj = new Date(log.timestamp);
      const nomeOperador = Array.isArray(log.usuarios) ? log.usuarios[0]?.nome : log.usuarios?.nome;
      const nomePivo = Array.isArray(log.pivos) ? log.pivos[0]?.nome_pivo : log.pivos?.nome_pivo;

      let eventoTexto = log.tipo_evento;
      if (log.tipo_evento === 'comando') eventoTexto = 'Comando Manual';
      else if (log.tipo_evento === 'pausa_manual') eventoTexto = 'Pausa Manual';
      else if (log.tipo_evento === 'pausa_automatica') eventoTexto = 'Parada Automática';
      else if (['erro', 'alerta', 'falha'].includes(log.tipo_evento)) eventoTexto = 'Anomalia no Sistema';
      else if (log.tipo_evento === 'conclusao') eventoTexto = 'Operação Concluída';
      else if (log.tipo_evento === 'sensor') eventoTexto = 'Leitura de Sensor';

      if (log.codigo) {
        const codigoAmigavel = log.codigo.replace(/_/g, ' '); 
        eventoTexto = `${eventoTexto} (${codigoAmigavel})`;
      }

      return {
        id: log.id?.substring(0, 5).toUpperCase() || "-",
        data: `${dateObj.toLocaleDateString("pt-BR")} ${dateObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`,
        pivo: nomePivo || log.pivo_id?.substring(0, 5) || "-",
        status: log.tipo_evento,
        evento: eventoTexto,
        origem: "Sistema",
        operador: nomeOperador || "Autônomo",
        voltas: "-", irrigacao: "-", milimetros: "-", pressao: "-", tensao: "-", direcao: "-", anguloAtual: "-", percentimetro: "-",
      };
    });
  }, [logsReais]);

  return (
    <Screen>
      <Header title="Logs do Sistema" subtitle="Auditoria Geral" />
      
      <View className="flex-1 mt-6 rounded-md">
        {isPending ? (
          <ActivityIndicator size="large" color="#00A0A6" />
        ) : (
          <Table columns={colunasLog} data={logsFormatados || []} />
        )}
      </View>
    </Screen>
  );
}