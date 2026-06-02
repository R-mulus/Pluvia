import { api } from '@/lib/api';

export type StatusExecucao = 'aguardando' | 'executando' | 'concluido' | 'falha' | 'interrompido';

export interface PassoDTO {
  preset_origem_id?: string | null;
  nome: string;
  angulo_inicial: number;
  angulo_final: number;
  lamina: number;
  irrigacao: boolean;
  direcao: 'HORARIO' | 'ANTI_HORARIO';
  ordem: number;
}

export interface Passo extends PassoDTO {
  id: string;
  cronograma_id: string;
  pivo_id: string;
  status_passo: StatusExecucao;
  created_at: string;
}

export interface CriarCronogramaDTO {
  pivo_id: string;
  nome: string;
  horario_inicio: string;
  passos: PassoDTO[];
}

export interface Cronograma {
  id: string;
  pivo_id: string;
  nome: string;
  is_ativo: boolean;
  status_final: StatusExecucao;
  horario_inicio?: string;
  created_at: string;
  criado_por: string;
  nome_criador: string; 
  passos: Passo[]; 
}

export interface DefaultResponse<T> {
  mensagem: string;
  dados: T;
}

export const cronogramaService = {
  listarAgendamentosDoPivo: async (pivo_id: string): Promise<Cronograma[]> => {
    const { data } = await api.get(`/cronograma`, { params: { pivo_id } });
    return data;
  },

  ativarCronograma: async (id: string, pivo_id: string): Promise<DefaultResponse<Cronograma>> => {
    const { data } = await api.patch(`/cronograma/${id}/ativar`, { pivo_id });
    return data;
  },

  agendarComando: async (dados: CriarCronogramaDTO): Promise<DefaultResponse<Cronograma>> => {
    const { data } = await api.post('/cronograma', dados);
    return data;
  },

  excluirComando: async (id: string): Promise<{ mensagem: string }> => {
    const { data } = await api.delete(`/cronograma/${id}`);
    return data;
  },

  controlarCronograma: async (id: string, acao: 'iniciar' | 'pausar' | 'continuar'): Promise<DefaultResponse<Cronograma>> => {
    const { data } = await api.patch(`/cronograma/${id}/controle`, { acao });
    return data;
  }
};