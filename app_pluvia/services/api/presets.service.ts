import { api } from '@/lib/api';

export interface Preset {
  id: string;
  pivo_id: string;
  nome: string;
  angulo_inicial: number;
  angulo_final: number;
  lamina: number;
  irrigacao: boolean;
  direcao: 'HORARIO' | 'ANTI_HORARIO';
  criado_por: string;
  nome_criador: string; // Vindo do JOIN no backend
  created_at: string;
}

export interface CriarPresetDTO {
  pivo_id: string;
  nome: string;
  angulo_inicial: number;
  angulo_final: number;
  lamina: number;
  irrigacao: boolean;
  direcao: 'HORARIO' | 'ANTI_HORARIO';
}

export const presetsService = {
  listarPorPivo: async (pivo_id: string): Promise<Preset[]> => {
    const { data } = await api.get(`/presets`, { params: { pivo_id } });
    return data;
  },

  criar: async (dados: CriarPresetDTO): Promise<{ mensagem: string, dados: Preset }> => {
    const { data } = await api.post('/presets', dados);
    return data;
  },

  deletar: async (id: string): Promise<{ mensagem: string }> => {
    const { data } = await api.delete(`/presets/${id}`);
    return data;
  }
};