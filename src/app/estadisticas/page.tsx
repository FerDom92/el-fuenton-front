"use client";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useSalesByDateRange,
  useTopSellingProducts,
} from "@/hooks/sales/useSaleCrud";
import { format, subDays } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function StatisticsPage() {
  // Estado para el rango de fechas
  const [startDate, setStartDate] = useState<Date>(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState<Date>(new Date());

  // Consultar los datos
  const { data: topProducts, isLoading: isLoadingTopProducts } =
    useTopSellingProducts(5);
  const { data: salesByDate, isLoading: isLoadingSales } = useSalesByDateRange({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });

  // Colores para los gráficos
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  // Preparar datos para gráfico de ventas diarias
  const prepareDailySales = () => {
    if (!salesByDate) return [];

    const salesByDay = salesByDate.reduce((acc: any, sale: any) => {
      const day = format(new Date(sale.date), "yyyy-MM-dd");
      if (!acc[day]) {
        acc[day] = { day, total: 0, count: 0 };
      }
      acc[day].total += sale.total;
      acc[day].count += 1;
      return acc;
    }, {});

    return Object.values(salesByDay).map((item: any) => ({
      ...item,
      day: format(new Date(item.day), "dd/MM"),
      total: Number(item.total.toFixed(2)),
    }));
  };

  const dailySalesData = prepareDailySales();

  // Calcular estadísticas generales
  const calculateStats = () => {
    if (!salesByDate) return { totalSales: 0, totalAmount: 0, avgAmount: 0 };

    const totalSales = salesByDate.length;
    const totalAmount = salesByDate.reduce(
      (sum: number, sale: any) => sum + sale.total,
      0
    );
    const avgAmount = totalSales > 0 ? totalAmount / totalSales : 0;

    return {
      totalSales,
      totalAmount: totalAmount.toFixed(2),
      avgAmount: avgAmount.toFixed(2),
    };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Estadísticas</h1>

      {/* Filtros de fecha */}
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="text-lg">Fecha Inicio</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(date) => date && setStartDate(date)}
              locale={es}
              className="border rounded-md"
            />
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="text-lg">Fecha Fin</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={(date) => date && setEndDate(date)}
              locale={es}
              className="border rounded-md"
            />
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Ventas Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSales}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monto Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalAmount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Venta Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.avgAmount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de ventas diarias */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Ventas Diarias</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {isLoadingSales ? (
              <div className="flex items-center justify-center h-full">
                <p>Cargando datos...</p>
              </div>
            ) : dailySalesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dailySalesData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#8884d8"
                    name="Monto Total"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#82ca9d"
                    name="Cantidad de Ventas"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p>No hay datos disponibles para este período</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Productos */}
        <Card>
          <CardHeader>
            <CardTitle>Top Productos Vendidos</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {isLoadingTopProducts ? (
              <div className="flex items-center justify-center h-full">
                <p>Cargando datos...</p>
              </div>
            ) : topProducts && topProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topProducts}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="productName" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="totalSold"
                    name="Cantidad Vendida"
                    fill="#8884d8"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p>No hay datos disponibles</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Distribución de Ventas */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Ventas</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {isLoadingTopProducts ? (
              <div className="flex items-center justify-center h-full">
                <p>Cargando datos...</p>
              </div>
            ) : topProducts && topProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topProducts}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="totalSold"
                    nameKey="productName"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {topProducts.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p>No hay datos disponibles</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
