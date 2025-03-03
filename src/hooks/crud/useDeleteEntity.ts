import { useToast } from '@/hooks/useToast';
import { baseApi } from '@/lib/api';
import { queryClient } from '@/lib/query-client';

import { BaseEntity, CrudHooksConfig } from '@/types/entity.types';
import { useMutation } from '@tanstack/react-query';

export function useDeleteEntity<T extends BaseEntity>({
  entityName,
  endpoint,
  queryKey,
  useToastOnSuccess = true,
}: CrudHooksConfig & { queryKey: string }) {
  const { toast } = useToast();

  const deleteEntity = async (entity: T): Promise<void> => {
    await baseApi.delete(`${endpoint}/${entity.id}`);
  };

  const mutation = useMutation<void, Error, T>({
    mutationFn: deleteEntity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });

      if (useToastOnSuccess) {
        toast({
          title: `${entityName} eliminado`,
          description: `El ${entityName.toLowerCase()} ha sido eliminado con éxito.`,
          duration: 2000,
        });
      }
    },
  });

  return {
    deleteEntity: mutation.mutate,
    isDeleting: mutation.isPending,
    deleteError: mutation.error,
  };
}