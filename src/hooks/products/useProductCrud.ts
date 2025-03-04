import { PaginationParams } from '@/types/entity.types';
import { Product, ProductDTO } from '@/types/product.types';
import { useCreateEntity } from '../crud/useCreateEntity';
import { useDeleteEntity } from '../crud/useDeleteEntity';
import { useFetchEntities } from '../crud/useFetchEntities';
import { useUpdateEntity } from '../crud/useUpdateEntity';

const ENDPOINT = '/product';
const QUERY_KEY = 'productos';
const ENTITY_NAME = 'Producto';

export function useProductCrud(params: PaginationParams) {
  const config = {
    entityName: ENTITY_NAME,
    endpoint: ENDPOINT,
    queryKey: QUERY_KEY,
  };

  const {
    entities: products,
    totalPages,
    isLoading,
    isError
  } = useFetchEntities<Product>({
    endpoint: ENDPOINT,
    queryKey: QUERY_KEY,
    params,
  });

  const {
    createEntity: createProduct,
    isCreating,
  } = useCreateEntity<Product, ProductDTO>({
    ...config,
  });

  const {
    updateEntity: updateProduct,
    isUpdating,
  } = useUpdateEntity<Product, ProductDTO>({
    ...config,
  });

  const {
    deleteEntity: deleteProduct,
    isDeleting,
  } = useDeleteEntity<Product>({
    ...config,
  });

  return {
    products,
    totalPages,
    isLoading: isLoading || isCreating || isUpdating || isDeleting,
    isError,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}