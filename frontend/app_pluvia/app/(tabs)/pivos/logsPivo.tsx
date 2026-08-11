import React, { useMemo } from "react";
import { View, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Screen } from "@/components/custom/Screen";
import Header from "@/components/custom/Header";
import { Table, TableColumn } from "@/components/custom/Table";

// Importa o hook para buscar os dados do banco
import { useLogsEventos } from "@/hooks/api/useLogs";

// Colunas idênticas às da tela principal
const colunasHistorico: TableColumn<any>[] = [
  { key: "id", title: "ID", width: 80 },
  { key: "data", title: "Data", width: 110 },
  { key: "hora", title: "Hora", width: 80 },
  { key: "evento", title: "Evento", width: 250 },
  { key: "operador", title: "Operador", width: 200 },
];

export default function LogsPivo() {
  // Captura o ID do pivô que foi passado no botão "Ver Tabela Completa"
  const { pivo_id } = useLocalSearchParams();
  
  // Busca TODOS os logs do pivô (o padrão do hook busca até 50 ou 100 itens)
  const { data: logsReais, isPending } = useLogsEventos(pivo_id as string);

  // Formata os dados crus do banco para o padrão visual
  const logsFormatados = useMemo(() => {
    if (!logsReais) return [];
    
    return logsReais.map((log: any) => {
      const dateObj = new Date(log.timestamp);
      
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

      const nomeOperador = Array.isArray(log.usuarios) ? log.usuarios[0]?.nome : log.usuarios?.nome;

      return {
        id: log.id?.substring(0, 5).toUpperCase() || "-",
        data: dateObj.toLocaleDateString("pt-BR"),
        hora: dateObj.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        evento: eventoTexto,
        operador: nomeOperador || "Sistema Autônomo",
      };
    });
  }, [logsReais]);

  return (
    <Screen>
      <Header title="Histórico Completo" subtitle="Logs de Operação e Eventos" />
      
      <View className="flex-1 mt-6 rounded-md">
        {isPending ? (
          <ActivityIndicator size="large" color="#00A0A6" className="mt-10" />
        ) : (
          <Table columns={colunasHistorico} data={logsFormatados || []} />
        )}
      </View>
    </Screen>
  );
}