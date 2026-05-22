import { useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import { usuariosService } from '@/services/api/usuarios.service';


export function useUsuarios() {
  return useQuery({
    queryKey: ['usuarios'],
    queryFn: usuariosService.listarTodos,
    // Define que os dados de usuários demoram a ficar obsoletos (5 minutos),
    // reduzindo requisições desnecessárias ao backend.
    staleTime: 1000 * 60 * 5, 
  });
}

export function useCriarUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dados: any) => usuariosService.criarUsuario(dados),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });
}