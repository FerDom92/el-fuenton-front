import { Producto, ProductoDTO } from "@/entities/Producto";
import { baseApi } from "@/lib/api";
import { queryClient } from "@/lib/query-client";
import { useMutation } from "@tanstack/react-query";

const useCreateProducto = () => {
  const { data, isSuccess, isError, mutate } = useMutation<
    Producto,
    Error,
    ProductoDTO
  >({
    mutationFn: async (data) => {
      const response = await baseApi.post(`/producto/`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });

  return {
    onCreateProducto: mutate,
    data,
    isSuccess,
    isError,
  };
};

export default useCreateProducto;
