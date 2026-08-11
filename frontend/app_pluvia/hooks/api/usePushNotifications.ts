import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function usePushNotifications() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // * Pede permissão ao usuário (no iOS é obrigatório, no Android 13+ também)
    Notifications.requestPermissionsAsync();

    // * Cria um canal que ouve INSERÇÕES na tabela de logs 👂👂👂👂👂👂
    const channel = supabase
      .channel('alertas-emergencia')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'event_logs' },
        (payload) => {
          const novoLog = payload.new;

          // * Se for erro, alerta ou falha, dispara o Push Nativo
          if (['erro', 'alerta', 'falha'].includes(novoLog.tipo_evento)) {
            
            // * Atualiza as tabelas do App na mesma hora sem o usuário dar refresh
            queryClient.invalidateQueries({ queryKey: ['alertas'] });

            // * Dispara a Notificação no celular
            const codigoAmigavel = novoLog.codigo ? novoLog.codigo.replace(/_/g, ' ') : 'Falha Crítica';
            
            Notifications.scheduleNotificationAsync({
              content: {
                title: '⚠️ Alerta do Pivô!',
                body: `O sistema detectou um evento: ${codigoAmigavel}`,
                data: { pivo_id: novoLog.pivo_id }, // ! Dá pra usar isso pra clicar e abrir a tela do pivô (se Deus quiser)
              },
              trigger: null,
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