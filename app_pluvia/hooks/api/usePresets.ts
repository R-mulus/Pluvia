import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { presetsService, CriarPresetDTO } from '@/services/api/presets.service';

// * --------------- Queries de leitura ---------------

export function usePresetsPivo(pivo_id: string) {
  return useQuery({
    queryKey: ['presets', pivo_id],
    queryFn: () => presetsService.listarPorPivo(pivo_id),
    enabled: !!pivo_id,
  });
}

// * --------------- Queries de escrita ---------------

export function useCriarPreset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dados: CriarPresetDTO) => presetsService.criar(dados),
    onSuccess: (_, variaveis) => {
      queryClient.invalidateQueries({ queryKey: ['presets', variaveis.pivo_id] });
    },
  });
}

export function useExcluirPreset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => presetsService.deletar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['presets'] });
    },
  });
}