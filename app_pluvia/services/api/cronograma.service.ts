import { api } from '@/lib/api';

export type StatusCronograma = 'aguardando' | 'executando' | 'concluido' | 'falha';

export interface ComandoAgendamentoDTO {
  pivo_id: string;
  comando: Record<string, any>;
  horario: string;
}

// A interface de retorno (GET) é diferente da de envio (POST)
export interface Agendamento {
  id: string;
  pivo_id: string;
  comando: Record<string, any>;
  horario: string;
  status_final: StatusCronograma;
  updated_at: string;
  
  // Dados do Criador injetados pelo Backend via JOIN
  criado_por: string; // O UUID (caso precise para alguma lógica de permissão)
  nome_criador: string; // O texto pronto para a UI (Ex: "Mateus Felisberto...")
}

export interface DefaultResponse<T> {
  mensagem: string;
  dados: T;
}

export const cronogramaService = {
  // Ajuste: Recebe o ID do pivô para buscar apenas os agendamentos dele
  listarAgendamentosDoPivo: async (pivo_id: string): Promise<Agendamento[]> => {
    // Usando query params para o backend filtrar (ex: /cronograma?pivo_id=123)
    const { data } = await api.get(`/cronograma`, { params: { pivo_id } });
    return data;
  },

  agendarComando: async (comando: ComandoAgendamentoDTO): Promise<DefaultResponse<Agendamento>> => {
    const { data } = await api.post('/cronograma', comando);
    return data;
  },

  cancelarOuEditarAgendamento: async (id: string, comando: Partial<ComandoAgendamentoDTO>): Promise<DefaultResponse<Agendamento>> => {
    const { data } = await api.patch(`/cronograma/${id}`, comando);
    return data;
  },

  excluirComando: async (id: string): Promise<{ mensagem: string }> => {
    const { data } = await api.delete(`/cronograma/${id}`);
    return data;
  }
};