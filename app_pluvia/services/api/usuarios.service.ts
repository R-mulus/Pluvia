import { api } from '@/lib/api';

export type Cargo = 'Administrador' | 'Operador' | 'Cliente';

export interface UsuarioDTO {
  nome: string;
  cargo?: Cargo;
  cpf_cnpj: string;
  telefone?: string;
}

export interface CriarUsuarioDTO {
  nome: string;
  cargo: Cargo;
  email: string;
  senha_token: string;
  cpf_cnpj: string;
  telefone?: string;
}

export interface Usuario {
  id: string;
  nome: string;
  cargo: Cargo;
  email: string;
  cpf_cnpj: string;
  telefone: string | null;
  created_at: string;
}

export interface DefaultResponse<T> {
  mensagem: string;
  dados: T;
}

export const usuariosService = {
  
  criarUsuario: async (usuario: CriarUsuarioDTO): Promise<DefaultResponse<Usuario>> => {
    const { data } = await api.post('/usuarios', usuario);
    return data;
  },

  listarTodos: async (): Promise<Usuario[]> => {
    const { data } = await api.get('/usuarios');
    return data;
  },

  buscarPorId: async (id: string): Promise<DefaultResponse<Usuario>> => {
    const { data } = await api.get(`/usuarios/${id}`);
    return data;
  },

  atualizarPerfil: async (id: string, perfil: Partial<UsuarioDTO>): Promise<DefaultResponse<Usuario>> => {
    const { data } = await api.patch(`/usuarios/${id}`, perfil);
    return data;
  },

  deletar: async (id: string): Promise<{ mensagem: string }> => {
    const { data } = await api.delete(`/usuarios/${id}`);
    return data;
  }
};