import { useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import { usuariosService } from '@/services/api/usuarios.service';


export function useUsuarios() {
  return useQuery({
    queryKey: ['usuarios'],
    queryFn: usuariosService.listarTodos,
    staleTime: 1000 * 60 * 5, // * Define que os dados de usuários demoram  5 minutos a ficar obsoletos
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

export function useDeletarUsuario() {
  const queryClient = useQueryClient();

  return useMutation({
    // 👇 Certifique-se de que no seu usuarios.service.ts exista a função deletarUsuario(id)
    mutationFn: (id: string) => usuariosService.deletar(id), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });
}