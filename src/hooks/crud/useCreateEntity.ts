
import { useToast } from '@/hooks/useToast';
import { baseApi } from '@/lib/api';
import { queryClient } from '@/lib/query-client';
import { BaseEntity, CrudHooksConfig } from '@/types/entity.types';
import { useMutation } from '@tanstack/react-query';

export function useCreateEntity<T extends BaseEntity, FormValues>({
  entityName,
  endpoint,
  queryKey,
  useToastOnSuccess = true,
}: CrudHooksConfig & { queryKey: string }) {
  const { toast } = useToast();

  const createEntity = async (data: FormValues): Promise<T> => {
    const response = await baseApi.post(endpoint, data);
    return response.data;
  };

  const mutation = useMutation<T, Error, FormValues>({
    mutationFn: createEntity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });

      if (useToastOnSuccess) {
        toast({
          title: `${entityName} creado`,
          description: `El ${entityName.toLowerCase()} ha sido creado con éxito.`,
          duration: 2000,
        });
      }
    },
  });

  return {
    createEntity: mutation.mutate,
    isCreating: mutation.isPending,
    createError: mutation.error,
  };
}