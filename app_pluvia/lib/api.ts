import {create} from 'axios'
import { supabase } from './supabase';

// * Instanciando Axios
export const api = create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
});

// * Processo que acontece antes de cada requisição
api.interceptors.request.use(
  async (config) => {

    // * Pega a sessão atual do usuário logado direto do Supabase Secure Store
    const { data: { session } } = await supabase.auth.getSession();
    
    // * Se o usuário estiver logado e tiver um token, ele é injetado no Cabeçalho
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);