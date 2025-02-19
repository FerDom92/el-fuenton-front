import { Producto } from "@/entities/Producto";
import { baseApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface UseProductosParams {
  page: number;
  limit: number;
  search?: string;
}

const useProductos = (params: UseProductosParams) => {
  const { page, limit, search } = params;

  const { data, isLoading, isError } = useQuery<Producto[]>({
    queryKey: ["productos", page, limit, search],
    queryFn: async () => {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) {
        searchParams.append("search", search);
      }

      const response = await baseApi.get(
        `/producto?${searchParams.toString()}`
      );
      return response.data;
    },
  });

  return {
    productos: data ?? [],
    isLoading,
    isError,
  };
};

export default useProductos;
