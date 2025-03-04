// src/app/page.tsx
"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import {
  BarChart2,
  CalendarDays,
  Calendar as CalendarIcon,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";

export default function Home() {
  const {
    yesterdaySales,
    todaySales,
    lastMonthSales,
    currentMonthSales,
    totalClients,
    totalProducts,
    isLoading,
  } = useDashboardStats();

  return (
    <ProtectedRoute>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        <div className="grid grid-cols-[1fr_auto] gap-4">
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3 grid-rows-2 h-full">
            {/* Yesterday's Sales */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ventas de Ayer
                </CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : `$${yesterdaySales.toFixed(2)}`}
                </div>
              </CardContent>
            </Card>

            {/* Today's Sales */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ventas de Hoy
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : `$${todaySales.toFixed(2)}`}
                </div>
              </CardContent>
            </Card>

            {/* Total Clients */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Clientes
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : totalClients}
                </div>
              </CardContent>
            </Card>

            {/* Last Month Sales */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ventas del Mes Pasado
                </CardTitle>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : `$${lastMonthSales.toFixed(2)}`}
                </div>
              </CardContent>
            </Card>

            {/* Current Month Sales */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ventas de Este Mes
                </CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : `$${currentMonthSales.toFixed(2)}`}
                </div>
              </CardContent>
            </Card>

            {/* Total Products */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Productos
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "..." : totalProducts}
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <Calendar
              mode="single"
              selected={new Date()}
              className="rounded-md border"
            />
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
