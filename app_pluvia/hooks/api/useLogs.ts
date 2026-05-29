import { useQuery } from '@tanstack/react-query';
import { logsService } from '@/services/api/logs.service';

export function useLogsEventos(pivoId: string, limit: number = 50) {
  return useQuery({
    queryKey: ['logs_eventos', pivoId, limit],
    queryFn: () => logsService.buscarLogsDeEventos(pivoId, limit),
    enabled: !!pivoId,
    // Pode colocar um refetchInterval se quiser que a tabela atualize sozinha
    refetchInterval: 1000 * 30, 
  });
}

export function useLogsConexao(pivoId: string, limit: number = 24) {
  return useQuery({
    queryKey: ['logs_conexao', pivoId, limit],
    queryFn: () => logsService.buscarHistoricoConexao(pivoId, limit),
    enabled: !!pivoId,
  });
}