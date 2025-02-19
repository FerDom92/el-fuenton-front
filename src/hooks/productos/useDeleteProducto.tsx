import { Producto } from "@/entities/Producto";
import { baseApi } from "@/lib/api";
import { queryClient } from "@/lib/query-client";
import { useMutation } from "@tanstack/react-query";

const useDeleteProducto = () => {
  const { data, isSuccess, isError, mutate } = useMutation<
    Producto,
    Error,
    Producto
  >({
    mutationFn: async (data) => {
      const response = await baseApi.delete(`/producto/${data.id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });

  return {
    onDeleteProducto: mutate,
    data,
    isSuccess,
    isError,
  };
};

export default useDeleteProducto;
