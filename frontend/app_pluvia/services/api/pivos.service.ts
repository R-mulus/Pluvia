import { api } from '@/lib/api';

export interface CriarPivoDTO {
  fazenda_id: string;
  operador_id?: string;
  nome_pivo: string;
  codigo_serie: string;
  modelo?: string;
  marca?: string;
  vazao?: number;
  raio?: number;
  coordenadas?: string;
}

export interface Pivo {
  id: string;
  fazenda_id: string;
  nome_pivo: string;
  codigo_serie: string;
  delta_device_id: string;
  marca: string | null;
  modelo: string | null;
  fazendas?: { nome_fazenda: string };
  vazao?: number;
  raio?: number;
  coordenadas?: string;
}

export interface DefaultResponse<T> {
  mensagem: string;
  dados: T;
}

export const pivosService = {
  listarTodosPivos: async (): Promise<Pivo[]> => {
    const { data } = await api.get('/pivos');
    return data;
  },

  buscarPivoPorId: async (id: string): Promise<DefaultResponse<Pivo>> => {
    const { data } = await api.get(`/pivos/${id}`);
    return data;
  },

  criarPivo: async (pivo: CriarPivoDTO): Promise<DefaultResponse<Pivo>> => {
    const { data } = await api.post('/pivos', pivo);
    return data;
  },

  atualizarPivo: async (id: string, pivo: Partial<CriarPivoDTO>): Promise<DefaultResponse<Pivo>> => {
    const { data } = await api.patch(`/pivos/${id}`, pivo);
    return data;
  },

  deletarPivo: async (id: string): Promise<{ mensagem: string }> => {
    const { data } = await api.delete(`/pivos/${id}`);
    return data;
  }
};