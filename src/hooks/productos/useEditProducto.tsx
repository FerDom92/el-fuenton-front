import { Producto } from "@/entities/Producto";
import { baseApi } from "@/lib/api";
import { queryClient } from "@/lib/query-client";
import { useMutation } from "@tanstack/react-query";

const useEditProducto = () => {
  const { data, isSuccess, isError, mutate } = useMutation<
    Producto,
    Error,
    Producto
  >({
    mutationFn: async (data) => {
      const response = await baseApi.put(`/producto/${data.id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productos"] });
    },
  });

  return {
    onEditProducto: mutate,
    data,
    isSuccess,
    isError,
  };
};

export default useEditProducto;
