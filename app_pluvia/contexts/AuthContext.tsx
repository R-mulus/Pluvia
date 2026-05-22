import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useRouter, useSegments } from 'expo-router';

// Definição da interface do contexto para tipagem estrita
interface AuthContextProps {
  user: User | null;
  session: Session | null;
  initialized: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

// Hook customizado para acessar o contexto em qualquer componente
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // 1. Inicializa a sessão a partir do armazenamento local
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setInitialized(true);
    };

    initializeAuth();

    // 2. Escuta mudanças no estado de autenticação (Login, Logout, Refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setInitialized(true);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // 3. Lógica de Redirecionamento (Route Guard)
  useEffect(() => {
    if (!initialized) return;

    // Verifica se o usuário está tentando acessar uma rota protegida (grupo (tabs))
    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      // Usuário sem sessão tentando acessar área restrita -> redireciona para login
      router.replace('/(auth)');
    } else if (session && inAuthGroup) {
      // Usuário logado tentando acessar login -> redireciona para dashboard
      router.replace('/(tabs)/pivos/');
    }
  }, [router, session, initialized, segments]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, initialized, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};