import { useQuery } from '@tanstack/react-query';
import { telemetriaService } from '@/services/api/telemetria.service';

export function useDashboardTelemetria() {
  return useQuery({
    queryKey: ['dashboard_telemetria'],
    queryFn: telemetriaService.obterDashboard,
    // Polling: Atualiza os dados silenciosamente a cada 10 segundos
    refetchInterval: 1000 * 10, 
  });
}