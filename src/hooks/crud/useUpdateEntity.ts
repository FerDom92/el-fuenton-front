import { useToast } from '@/hooks/useToast';
import { baseApi } from '@/lib/api';
import { queryClient } from '@/lib/query-client';
import { BaseEntity, CrudHooksConfig } from '@/types/entity.types';
import { useMutation } from '@tanstack/react-query';

export function useUpdateEntity<T extends BaseEntity, FormValues>({
  entityName,
  endpoint,
  queryKey,
  useToastOnSuccess = true,
}: CrudHooksConfig & { queryKey: string }) {
  const { toast } = useToast();

  const updateEntity = async (data: FormValues & { id: number }): Promise<T> => {
    const { id, ...rest } = data;
    const response = await baseApi.put(`${endpoint}/${id}`, rest);
    return response.data;
  };

  const mutation = useMutation<T, Error, FormValues & { id: number }>({
    mutationFn: updateEntity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });

      if (useToastOnSuccess) {
        toast({
          title: `${entityName} actualizado`,
          description: `El ${entityName.toLowerCase()} ha sido actualizado con éxito.`,
          duration: 2000,
        });
      }
    },
  });

  return {
    updateEntity: mutation.mutate,
    isUpdating: mutation.isPending,
    updateError: mutation.error,
  };
}