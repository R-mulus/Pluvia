import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fazendasService, CriarFazendaDTO } from '@/services/api/fazendas.service';

// --- QUERIES (Leitura) ---

export function useFazendas() {
  return useQuery({
    queryKey: ['fazendas'], // Chave única para o cache em memória
    queryFn: fazendasService.listarTodasFazendas,
    staleTime: 1000 * 60 * 5, // Os dados são considerados "frescos" por 5 minutos antes de refetch automático
  });
}

export function useFazenda(id: string) {
  return useQuery({
    queryKey: ['fazendas', id], // Cache isolado para um ID específico
    queryFn: () => fazendasService.buscarFazendaPorId(id),
    enabled: !!id, // Só executa a query se o ID existir (evita erros em chamadas vazias)
  });
}

// --- MUTATIONS (Escrita) ---

export function useCriarFazenda() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dados: CriarFazendaDTO) => fazendasService.criarFazenda(dados),
    onSuccess: () => {
      // INVALIDAÇÃO: Quando a criação for bem-sucedida, avisamos o cache para apagar
      // os dados antigos da chave ['fazendas'] e fazer um novo GET automaticamente.
      queryClient.invalidateQueries({ queryKey: ['fazendas'] });
    },
  });
}

export function useDeletarFazenda() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => fazendasService.deletarFazenda(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fazendas'] });
    },
  });
}

export function useAtualizarFazenda() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dados }: { id: string; dados: Partial<CriarFazendaDTO> }) => 
      fazendasService.atualizarFazenda(id, dados),
    onSuccess: (_, variables) => {
      // Invalida a lista geral e o cache individual da fazenda editada
      queryClient.invalidateQueries({ queryKey: ['fazendas'] });
      queryClient.invalidateQueries({ queryKey: ['fazendas', variables.id] });
    },
  });
}