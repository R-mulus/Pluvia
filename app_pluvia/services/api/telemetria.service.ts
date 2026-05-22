import { api } from '@/lib/api';

export interface PivoStatus {
  pivo_id: string;
  angulo_atual: number;
  pressao: number;
  tensao: number;
  direcao_atual: 'HORARIO' | 'ANTI-HORARIO' | 'PARADO' | null;
  ultima_atualizacao: string;
}

export interface DashboardPivo {
  id: string;
  fazenda_id: string;
  nome_pivo: string;
  codigo_serie: string;
  marca: string | null;
  modelo: string | null;
  angulo_atual: number;
  pressao: number;
  tensao: number;
  direcao_atual: 'HORARIO' | 'ANTI_HORARIO' | 'PARADO' | null;
  ultima_atualizacao: string | null;
  status_operacional: string | null;
  angulo_inicio: number;
  angulo_final: number;
  lamina: number;
  water_on: boolean;
}

export const telemetriaService = {
  obterDashboard: async (): Promise<DashboardPivo[]> => {
    const { data } = await api.get('/telemetria/dashboard');
    // Retornamos data.dados porque o backend envelopou a resposta
    return data.dados;
  }
};

// export const telemetriaService = {
//   // Busca o status atual de todos os pivôs de uma fazenda
//   buscarStatusFazenda: async (fazendaId: string): Promise<PivoStatus[]> => {
//     // Assumindo que criaremos esta rota no backend futuramente
//     const { data } = await api.get(`/telemetria/fazenda/${fazendaId}`);
//     return data;
//   },

//   // Busca o snapshot do status de um pivô específico
//   buscarStatusPivo: async (pivoId: string): Promise<PivoStatus> => {
//     const { data } = await api.get(`/telemetria/pivo/${pivoId}`);
//     return data;
//   }
// };