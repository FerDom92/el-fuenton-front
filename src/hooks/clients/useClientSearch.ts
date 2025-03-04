import { baseApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export function useClientSearch(searchQuery: string, limit: number = 20) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['clients', 'search', searchQuery, limit],
    queryFn: async () => {
      const params: Record<string, string | number> = {
        page: 1,
        limit
      };

      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await baseApi.get('/client', { params });
      return response.data;
    },
    refetchOnWindowFocus: false,
    staleTime: 60000,
  });

  return {
    clients: data?.items || [],
    totalPages: data?.totalPages || 0,
    totalClients: data?.total || 0,
    isLoading,
    error
  };
}