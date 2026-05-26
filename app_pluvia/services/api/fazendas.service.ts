import { api } from '@/lib/api';

export interface CriarFazendaDTO {
  nome_fazenda: string;
  codigo_identificacao: string;
  proprietario_id: string;
  endereco?: string;
  coordenadas?: string;
  cidade?: string;
  estado?: string;
  area_total?: number;
  cultura?: string[];
}

export interface Fazenda {
  id: string;
  proprietario_id: string;
  nome_fazenda: string;
  codigo_identificacao: string;
  endereco: string | null;
  coordenadas: string | null,
  cidade: string | null;
  estado: string | null;
  area_total: number | null;
  usuarios?: { nome: string }; 
}

// Interface genérica para espelhar o envelope do backend
export interface DefaultResponse<T> {
  mensagem: string;
  dados: T;
}

export const fazendasService = {
  // Listagens retornam a array diretamente
  listarTodasFazendas: async (): Promise<Fazenda[]> => {
    const { data } = await api.get('/fazendas');
    return data;
  },

  buscarFazendaPorId: async (id: string): Promise<DefaultResponse<Fazenda>> => {
    const { data } = await api.get(`/fazendas/${id}`);
    return data;
  },

  criarFazenda: async (fazenda: CriarFazendaDTO): Promise<DefaultResponse<Fazenda>> => {
    const { data } = await api.post('/fazendas', fazenda);
    return data;
  },

  atualizarFazenda: async (id: string, fazenda: Partial<CriarFazendaDTO>): Promise<DefaultResponse<Fazenda>> => {
    const { data } = await api.patch(`/fazendas/${id}`, fazenda);
    return data;
  },

  // Deleção agora retorna 200 OK com mensagem textual
  deletarFazenda: async (id: string): Promise<{ mensagem: string }> => {
    const { data } = await api.delete(`/fazendas/${id}`);
    return data;
  }
};