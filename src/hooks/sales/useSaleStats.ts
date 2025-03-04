// src/hooks/sales/useSaleStats.ts
import { baseApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

interface DateRangeParams {
  startDate: string;
  endDate: string;
}

// Hook for getting sales by date range
export function useSalesByDateRange(params: DateRangeParams) {
  return useQuery({
    queryKey: ['ventas', 'by-date', params],
    queryFn: async () => {
      const response = await baseApi.get('/sale/reports/by-date', {
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

// Hook for getting top selling products
export function useTopSellingProducts(limit: number = 5) {
  return useQuery({
    queryKey: ['ventas', 'top-products', limit],
    queryFn: async () => {
      const response = await baseApi.get('/sale/reports/top-products', {
        params: { limit }
      });
      return response.data;
    },
  });
}

// Hook for getting top clients
export function useTopClients(limit: number = 5) {
  return useQuery({
    queryKey: ['ventas', 'top-clients', limit],
    queryFn: async () => {
      const response = await baseApi.get('/sale/reports/top-clients', {
        params: { limit }
      });
      return response.data;
    },
  });
}

// Hook for getting product sales by date
export function useProductSalesByDate(params: DateRangeParams) {
  return useQuery({
    queryKey: ['ventas', 'product-sales-by-date', params],
    queryFn: async () => {
      const response = await baseApi.get('/sale/reports/product-sales-by-date', {
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