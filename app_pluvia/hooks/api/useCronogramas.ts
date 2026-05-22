import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cronogramaService, ComandoAgendamentoDTO } from '@/services/api/cronograma.service';

export function useCronogramasPivo(pivo_id: string) {
  return useQuery({
    queryKey: ['cronograma', pivo_id],
    queryFn: () => cronogramaService.listarAgendamentosDoPivo(pivo_id),
    refetchInterval: 1000 * 30,
    enabled: !!pivo_id,
  });
}

export function useCriarCronograma() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dados: ComandoAgendamentoDTO) => cronogramaService.agendarComando(dados),
    onSuccess: (_, variaveis) => {
      queryClient.invalidateQueries({ queryKey: ['cronograma', variaveis.pivo_id] });
    },
  });
}

export function useEditarCronograma() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dados }: { id: string; dados: Partial<ComandoAgendamentoDTO> }) => 
      cronogramaService.cancelarOuEditarAgendamento(id, dados),
    onSuccess: (_, variaveis) => {
      // Invalida a query específica do pivô se tivermos o pivo_id, caso contrário, invalida tudo de cronograma
      queryClient.invalidateQueries({ queryKey: ['cronograma'] });
    },
  });
}

export function useExcluirCronograma() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cronogramaService.excluirComando(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cronograma'] });
    },
  });
}