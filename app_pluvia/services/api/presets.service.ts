import { api } from '@/lib/api';

export interface Preset {
  id: string;
  pivo_id: string;
  nome: string;
  comando: Record<string, any>;
  criado_por: string;
  created_at: string;
}

export interface CriarPresetDTO {
  pivo_id: string;
  nome: string;
  comando: Record<string, any>;
}

export const presetsService = {
  // Lista todos os presets de um pivô específico
  listarPorPivo: async (pivo_id: string): Promise<Preset[]> => {
    const { data } = await api.get(`/presets`, { params: { pivo_id } });
    return data;
  },

  // Cria um novo preset
  criar: async (dados: CriarPresetDTO): Promise<{ mensagem: string, dados: Preset }> => {
    const { data } = await api.post('/presets', dados);
    return data;
  },

  // Exclui um preset
  deletar: async (id: string): Promise<{ mensagem: string }> => {
    const { data } = await api.delete(`/presets/${id}`);
    return data;
  }
};