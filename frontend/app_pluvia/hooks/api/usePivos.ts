import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pivosService, CriarPivoDTO } from "@/services/api/pivos.service";

// * --------------- Queries de leitura ---------------

export function usePivos() {
  return useQuery({
    queryKey: ["pivos"],
    queryFn: pivosService.listarTodosPivos,
  });
}

// * --------------- Queries de escrita ---------------

export function useCriarPivo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dados: CriarPivoDTO) => pivosService.criarPivo(dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pivos"] });
    },
  });
}

export function useDeletarPivo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => pivosService.deletarPivo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pivos"] });
    },
  });
}

export function usePivo(id: string) {
  return useQuery({
    queryKey: ["pivos", id],
    queryFn: () => pivosService.buscarPivoPorId(id),
    enabled: !!id,
  });
}

export function useAtualizarPivo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dados }: { id: string; dados: Partial<CriarPivoDTO> }) =>
      pivosService.atualizarPivo(id, dados),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pivos"] });
      queryClient.invalidateQueries({ queryKey: ["pivos", variables.id] });
    },
  });
}
