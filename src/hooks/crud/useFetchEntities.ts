import { baseApi } from '@/lib/api';
import { BaseEntity, PaginatedResponse, PaginationParams } from '@/types/entity.types';
import { useQuery } from "@tanstack/react-query";

export function useFetchEntities<T extends BaseEntity>({
  endpoint,
  queryKey,
  params,
}: {
  endpoint: string;
  queryKey: string;
  params: PaginationParams;
}) {
  const fetchEntities = async (): Promise<PaginatedResponse<T>> => {
    const response = await baseApi.get(endpoint, { params });
    return response.data;
  };

  const { data, isLoading, isError } = useQuery<PaginatedResponse<T>>({
    queryKey: [queryKey, params],
    queryFn: fetchEntities,
  });

  return {
    entities: data?.items ?? [],
    totalPages: data?.totalPages ?? 0,
    isLoading,
    isError,
  };
}