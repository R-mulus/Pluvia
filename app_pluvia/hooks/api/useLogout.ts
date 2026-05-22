import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const realizarLogout = async () => {
    try {
      // 1. Invalida a sessão no servidor e remove o token do Secure Storage
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw new Error(error.message);
      }

      // 2. Limpa completamente o cache de memória do TanStack Query
      // Isso garante que nenhum dado do usuário atual vaze na interface
      queryClient.clear();

      // 3. Redireciona para o grupo de rotas públicas (auth), 
      // destruindo a pilha de navegação das abas privadas.
      router.replace('/(auth)'); 

    } catch (err: any) {
      Alert.alert('Falha ao deslogar', err.message);
      console.error('[AUTH_ERROR] Logout falhou:', err);
    }
  };

  return { realizarLogout };
}