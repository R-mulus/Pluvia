import { api } from '@/lib/api';

export interface EventLog {
  id: string;
  cronograma_id: string | null;
  pivo_id: string;
  operador_id: string;
  tipo_evento: string; 
  codigo: string | null;
  timestamp: string;
}

export interface ConectLog {
  id: number;
  pivo_id: string;
  latencia_ms: number;
  status_conexao: boolean;
  timestamp: string;
}

export const logsService = {
  buscarLogsDeEventos: async (pivoId: string, limit: number = 50): Promise<EventLog[]> => {
    const { data } = await api.get(`/logs/eventos/${pivoId}?limit=${limit}`);
    return data.dados ? data.dados : data;
  },

  buscarHistoricoConexao: async (pivoId: string, limit: number = 24): Promise<ConectLog[]> => {
    const { data } = await api.get(`/logs/conexao/${pivoId}?limit=${limit}`);
    return data.dados ? data.dados : data;
  },

  buscarAlertas: async (limit: number = 50, pivoId?: string): Promise<EventLog[]> => {
    const { data } = await api.get(`/logs/alertas`, { 
      params: { limit, pivoId: pivoId === 'todos' ? undefined : pivoId } 
    });
    return data.dados ? data.dados : data;
  }
};