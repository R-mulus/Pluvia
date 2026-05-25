import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cronogramaService, CriarCronogramaDTO } from '@/services/api/cronograma.service';

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
    mutationFn: (dados: CriarCronogramaDTO) => cronogramaService.agendarComando(dados),
    onSuccess: (_, variaveis) => {
      queryClient.invalidateQueries({ queryKey: ['cronograma', variaveis.pivo_id] });
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

export function useAtivarCronograma() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, pivo_id }: { id: string; pivo_id: string }) => cronogramaService.ativarCronograma(id, pivo_id),
    onSuccess: (_, variaveis) => {
      // Atualiza a lista automaticamente na tela
      queryClient.invalidateQueries({ queryKey: ['cronograma', variaveis.pivo_id] });
    },
  });
}

// Adicione junto com os outros export functions no seu arquivo de hooks
export function useControleCronograma() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, acao }: { id: string; acao: 'iniciar' | 'pausar' | 'continuar' }) => 
      cronogramaService.controlarCronograma(id, acao),
    onSuccess: () => {
      // Invalida para a tela puxar o novo status imediatamente (ex: mudar o botão de Iniciar para Parar)
      queryClient.invalidateQueries({ queryKey: ['cronograma'] });
    },
  });
}

