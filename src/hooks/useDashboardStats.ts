// src/hooks/useDashboardStats.ts
import { baseApi } from '@/lib/api';
import { useEffect, useState } from 'react';

interface DashboardStats {
  yesterdaySales: number;
  todaySales: number;
  lastMonthSales: number;
  currentMonthSales: number;
  totalClients: number;
  totalProducts: number;
  isLoading: boolean;
}

export function useDashboardStats(): DashboardStats {
  const [stats, setStats] = useState<DashboardStats>({
    yesterdaySales: 0,
    todaySales: 0,
    lastMonthSales: 0,
    currentMonthSales: 0,
    totalClients: 0,
    totalProducts: 0,
    isLoading: true
  });

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        // Get today's sales
        const today = new Date();
        const todayStart = new Date(today.setHours(0, 0, 0, 0)).toISOString();
        const todayEnd = new Date(today.setHours(23, 59, 59, 999)).toISOString();

        // Get yesterday's sales
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStart = new Date(yesterday.setHours(0, 0, 0, 0)).toISOString();
        const yesterdayEnd = new Date(yesterday.setHours(23, 59, 59, 999)).toISOString();

        // Current month
        const now = new Date();
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const currentMonthEnd = now.toISOString();

        // Last month
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999).toISOString();

        // Fetch all data concurrently
        const [
          todaySalesRes,
          yesterdaySalesRes,
          currentMonthSalesRes,
          lastMonthSalesRes,
          clientsRes,
          productsRes
        ] = await Promise.all([
          baseApi.get('/sale/reports/by-date', { params: { startDate: todayStart, endDate: todayEnd } }),
          baseApi.get('/sale/reports/by-date', { params: { startDate: yesterdayStart, endDate: yesterdayEnd } }),
          baseApi.get('/sale/reports/by-date', { params: { startDate: currentMonthStart, endDate: currentMonthEnd } }),
          baseApi.get('/sale/reports/by-date', { params: { startDate: lastMonthStart, endDate: lastMonthEnd } }),
          baseApi.get('/client', { params: { page: 1, limit: 1 } }),
          baseApi.get('/product', { params: { page: 1, limit: 1 } })
        ]);

        // Calculate totals
        const todayTotal = todaySalesRes.data.reduce((sum, sale) => sum + Number(sale.total), 0);
        const yesterdayTotal = yesterdaySalesRes.data.reduce((sum, sale) => sum + Number(sale.total), 0);
        const currentMonthTotal = currentMonthSalesRes.data.reduce((sum, sale) => sum + Number(sale.total), 0);
        const lastMonthTotal = lastMonthSalesRes.data.reduce((sum, sale) => sum + Number(sale.total), 0);

        setStats({
          todaySales: todayTotal,
          yesterdaySales: yesterdayTotal,
          currentMonthSales: currentMonthTotal,
          lastMonthSales: lastMonthTotal,
          totalClients: clientsRes.data.total,
          totalProducts: productsRes.data.total,
          isLoading: false
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setStats(prev => ({ ...prev, isLoading: false }));
      }
    }

    fetchDashboardStats();
  }, []);

  return stats;
}