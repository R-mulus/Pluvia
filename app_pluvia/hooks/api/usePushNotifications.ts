import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';

// Correção: Adicionados os novos parâmetros exigidos pela tipagem do Expo
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true, // <- Adicionado
    shouldShowList: true,   // <- Adicionado
  }),
});

export function usePushNotifications() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Pede permissão ao usuário (no iOS é obrigatório, no Android 13+ também)
    Notifications.requestPermissionsAsync();

    // Cria o canal WebSockets ouvindo INSERÇÕES na tabela de logs
    const channel = supabase
      .channel('alertas-emergencia')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'event_logs' },
        (payload) => {
          const novoLog = payload.new;

          // Se for erro, alerta ou falha, dispara o Push Nativo!
          if (['erro', 'alerta', 'falha'].includes(novoLog.tipo_evento)) {
            
            // 1. Atualiza as tabelas do App na mesma hora sem o usuário dar refresh
            queryClient.invalidateQueries({ queryKey: ['alertas'] });

            // 2. Dispara a Notificação no celular
            const codigoAmigavel = novoLog.codigo ? novoLog.codigo.replace(/_/g, ' ') : 'Falha Crítica';
            
            Notifications.scheduleNotificationAsync({
              content: {
                title: '⚠️ Alerta do Pivô!',
                body: `O sistema detectou um evento: ${codigoAmigavel}`,
                data: { pivo_id: novoLog.pivo_id }, // Dá pra usar isso pra clicar e abrir a tela do pivô!
              },
              trigger: null, // Dispara IMEDIATAMENTE
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
}