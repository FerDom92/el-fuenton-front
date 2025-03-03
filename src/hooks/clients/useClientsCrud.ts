import { PaginationParams } from '@/types/entity.types';
import { useCreateEntity } from '../crud/useCreateEntity';
import { useDeleteEntity } from '../crud/useDeleteEntity';
import { useFetchEntities } from '../crud/useFetchEntities';
import { useUpdateEntity } from '../crud/useUpdateEntity';
import { Client, ClientDTO } from '@/types/client.types';

const ENDPOINT = '/client';
const QUERY_KEY = 'clients';
const ENTITY_NAME = 'Client';


export function useClientCrud(params: PaginationParams) {
  const config = {
    entityName: ENTITY_NAME,
    endpoint: ENDPOINT,
    queryKey: QUERY_KEY,
  };

  const {
    entities: clients,
    totalPages,
    isLoading,
    isError
  } = useFetchEntities<Client>({
    endpoint: ENDPOINT,
    queryKey: QUERY_KEY,
    params,
  });

  const {
    createEntity: createClient,
    isCreating,
  } = useCreateEntity<Client, ClientDTO>({
    ...config,
  });

  const {
    updateEntity: updateClient,
    isUpdating,
  } = useUpdateEntity<Client, ClientDTO>({
    ...config,
  });

  const {
    deleteEntity: deleteClient,
    isDeleting,
  } = useDeleteEntity<Client>({
    ...config,
  });

  return {
    clients,
    totalPages,
    isLoading: isLoading || isCreating || isUpdating || isDeleting,
    isError,
    createClient,
    updateClient,
    deleteClient,
  };
}