import axios from 'axios';
import { supabase } from './supabase'; // Importamos o cliente do supabase

// 1. Criamos a instância do Axios apontando para o seu servidor Node.js
export const api = axios.create({
  // Vamos puxar do .env, mas se não tiver, usa localhost como fallback
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000',
});

// 2. O "Interceptador": Processo que acontece ANTES de cada requisição sair do celular
api.interceptors.request.use(
  async (config) => {
    // Pegamos a sessão atual do usuário logado direto do Supabase Secure Store
    const { data: { session } } = await supabase.auth.getSession();
    
    // Se o usuário estiver logado e tiver um token, nós injetamos no Cabeçalho
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);