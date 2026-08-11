import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fazendasService,
  CriarFazendaDTO,
} from "@/services/api/fazendas.service";

// * --------------- Queries de leitura ---------------

export function useFazendas() {
  return useQuery({
    queryKey: ["fazendas"],
    queryFn: fazendasService.listarTodasFazendas,
    staleTime: 1000 * 60 * 5, // Os dados são considerados "frescos" por 5 minutos antes de refetch automático
  });
}

export function useFazenda(id: string) {
  return useQuery({
    queryKey: ["fazendas", id],
    queryFn: () => fazendasService.buscarFazendaPorId(id),
    enabled: !!id,
  });
}

// * --------------- Queries de escrita ---------------

export function useCriarFazenda() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dados: CriarFazendaDTO) => fazendasService.criarFazenda(dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fazendas"] });
    },
  });
}

export function useDeletarFazenda() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => fazendasService.deletarFazenda(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fazendas"] });
    },
  });
}

export function useAtualizarFazenda() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      dados,
    }: {
      id: string;
      dados: Partial<CriarFazendaDTO>;
    }) => fazendasService.atualizarFazenda(id, dados),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["fazendas"] });
      queryClient.invalidateQueries({ queryKey: ["fazendas", variables.id] });
    },
  });
}
