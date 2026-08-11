import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const realizarLogout = async () => {
    try {
      // * Encerra a sessão no servidor e remove o token do Secure Storage
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw new Error(error.message);
      }

      // * Limpa o cache de memória do TanStack Query
      queryClient.clear();

      // * Redireciona para o grupo de rotas públicas (auth), que no caso é a tela de login, 
      router.replace('/(auth)'); 

    } catch (err: any) {
      Alert.alert('Falha ao deslogar', err.message);
      console.error('[AUTH_ERROR] Logout falhou:', err);
    }
  };

  return { realizarLogout };
}