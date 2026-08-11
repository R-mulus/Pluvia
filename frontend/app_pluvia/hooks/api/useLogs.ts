import { useQuery } from "@tanstack/react-query";
import { logsService } from "@/services/api/logs.service";

// * --------------- Queries de leitura ---------------

export function useLogsEventos(pivoId: string, limit: number = 50) {
  return useQuery({
    queryKey: ["logs_eventos", pivoId, limit],
    queryFn: () => logsService.buscarLogsDeEventos(pivoId, limit),
    enabled: !!pivoId,
    refetchInterval: 1000 * 30,
  });
}

export function useLogsConexao(pivoId: string, limit: number = 24) {
  return useQuery({
    queryKey: ["logs_conexao", pivoId, limit],
    queryFn: () => logsService.buscarHistoricoConexao(pivoId, limit),
    enabled: !!pivoId,
  });
}

export function useAlertas(pivoId?: string, limit: number = 50) {
  return useQuery({
    queryKey: ["alertas", pivoId, limit],
    queryFn: () => logsService.buscarAlertas(limit, pivoId),
    refetchInterval: 1000 * 30, // Polling de backup
  });
}
