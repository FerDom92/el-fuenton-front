import { useToast } from '@/hooks/useToast';
import { baseApi } from '@/lib/api';
import { queryClient } from '@/lib/query-client';
import { BaseEntity, CrudHooksConfig } from '@/types/entity.types';
import { useMutation } from '@tanstack/react-query';

interface CreateEntityOptions<T extends BaseEntity, FormValues> extends CrudHooksConfig {
  queryKey: string;
  customMutation?: (data: FormValues) => Promise<T>;
}

export function useCreateEntity<T extends BaseEntity, FormValues>({
  entityName,
  endpoint,
  queryKey,
  useToastOnSuccess = true,
  customMutation,
}: CreateEntityOptions<T, FormValues>) {
  const { toast } = useToast();

  const defaultCreateEntity = async (data: FormValues): Promise<T> => {
    console.log(`Creating ${entityName}:`, data);
    const response = await baseApi.post(endpoint, data);
    return response.data;
  };

  const createEntityFn = customMutation || defaultCreateEntity;

  const mutation = useMutation<T, Error, FormValues>({
    mutationFn: createEntityFn,
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
    onError: (error) => {
      toast({
        title: `Error al crear ${entityName.toLowerCase()}`,
        description: error.message || `Ha ocurrido un error al crear el ${entityName.toLowerCase()}.`,
        variant: 'destructive',
        duration: 3000,
      });
    },
  });

  return {
    createEntity: mutation.mutate,
    createEntityAsync: mutation.mutateAsync,
    isCreating: mutation.isPending,
    createError: mutation.error,
  };
}