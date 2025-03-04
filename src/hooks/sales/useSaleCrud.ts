import { useToast } from '@/hooks/useToast';
import { baseApi } from '@/lib/api';
import { PaginationParams } from '@/types/entity.types';
import { Sale, SaleDTO } from '@/types/sale.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDeleteEntity } from '../crud/useDeleteEntity';
import { useFetchEntities } from '../crud/useFetchEntities';

const ENDPOINT = '/sale';
const QUERY_KEY = 'ventas';
const ENTITY_NAME = 'Venta';

export function useSaleCrud(params: PaginationParams) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    entities: sales,
    totalPages,
    isLoading: isFetching,
    isError,
  } = useFetchEntities<Sale>({
    endpoint: ENDPOINT,
    queryKey: QUERY_KEY,
    params,
  });

  // Implementar directamente la mutación para crear ventas
  const { mutate: createSale, isPending: isCreating } = useMutation({
    mutationFn: async (data: SaleDTO): Promise<Sale> => {
      // Formato específico que espera el backend
      const backendData = {
        clientId: data.clientId,
        items: data.items.map(item => ({
          productId: Number(item.productId),
          quantity: Number(item.quantity)
        })),
        total: Number(data.total || 0)
      };

      console.log("Enviando datos al backend (formato ajustado):", JSON.stringify(backendData, null, 2));

      // Intento directamente con Axios para tener más control
      const response = await baseApi.post(ENDPOINT, backendData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Venta creada",
        description: "La venta ha sido registrada exitosamente",
      });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
    onError: (error: any) => {
      toast({
        title: "Error al crear venta",
        description: error?.message || error?.response?.data?.message || "Ha ocurrido un error al registrar la venta",
        variant: "destructive",
      });
      console.error("Error detallado:", error);
      console.error("Respuesta del servidor:", error?.response?.data);
    }
  });

  const {
    deleteEntity: deleteSale,
    isDeleting,
  } = useDeleteEntity<Sale>({
    entityName: ENTITY_NAME,
    endpoint: ENDPOINT,
    queryKey: QUERY_KEY,
  });

  return {
    sales,
    totalPages,
    isLoading: isFetching || isCreating || isDeleting,
    isError,
    createSale,
    deleteSale,
  };
}

interface DateRangeParams {
  startDate: string;
  endDate: string;
}

export function useSalesByDateRange(params: DateRangeParams) {
  return useQuery({
    queryKey: ['ventas', 'by-date', params],
    queryFn: async () => {
      const response = await baseApi.get(`${ENDPOINT}/reports/by-date`, {
        params: {
          startDate: params.startDate,
          endDate: params.endDate
        }
      });
      return response.data;
    },
    enabled: !!params.startDate && !!params.endDate,
  });
}

export function useTopSellingProducts(limit: number = 10) {
  return useQuery({
    queryKey: ['ventas', 'top-products', limit],
    queryFn: async () => {
      const response = await baseApi.get(`${ENDPOINT}/reports/top-products`, {
        params: { limit }
      });
      return response.data;
    },
  });
}