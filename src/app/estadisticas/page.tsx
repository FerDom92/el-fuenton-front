"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  useProductSalesByDate,
  useSalesByDateRange,
  useTopClients,
  useTopSellingProducts,
} from "@/hooks/sales/useSaleStats";
import { ProductSaleByDate } from "@/types/product.types";
import { Sale, SalesByDay } from "@/types/sale.types";
import { format, subDays } from "date-fns";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function StatisticsPage() {
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  // Consultar los datos
  const { data: topProducts, isLoading: isLoadingTopProducts } =
    useTopSellingProducts(5);

  const { data: topClients, isLoading: isLoadingTopClients } = useTopClients(5);

  const { data: salesByDate, isLoading: isLoadingSales } = useSalesByDateRange({
    startDate: dateRange.from.toISOString(),
    endDate: dateRange.to.toISOString(),
  });

  const { data: productSalesByDate, isLoading: isLoadingProductSales } =
    useProductSalesByDate({
      startDate: dateRange.from.toISOString(),
      endDate: dateRange.to.toISOString(),
    });

  // Preparar datos para gráficos
  const prepareDailySales = () => {
    if (!salesByDate) return [];

    const salesByDay: SalesByDay = salesByDate.reduce(
      (acc: number, sale: Sale) => {
        const day = format(new Date(sale.date), "yyyy-MM-dd");
        if (!acc[day]) {
          acc[day] = { day, total: 0, count: 0 };
        }
        acc[day].total += sale.total;
        acc[day].count += 1;
        return acc;
      },
      {}
    );

    return Object.values(salesByDay).map((item: SalesByDay) => ({
      ...item,
      day: format(new Date(item.day), "dd/MM"),
      total: Number(item.total.toFixed(2)),
    }));
  };

  // Preparar datos para gráfico de productos vendidos por día
  const prepareProductSalesByDay = () => {
    if (!productSalesByDate) return [];

    return productSalesByDate.map((item: ProductSaleByDate) => ({
      day: format(new Date(item.date), "dd/MM"),
      quantity: item.totalQuantity,
    }));
  };

  const dailySalesData = prepareDailySales();
  const productSalesByDayData = prepareProductSalesByDay();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Estadísticas</h1>

      {/* Selector de rango de fechas mejorado */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-center">Rango de Fechas</CardTitle>
        </CardHeader>
        <CardContent>
          <DateRangePicker
            from={dateRange.from}
            to={dateRange.to}
            onFromChange={(date) =>
              setDateRange((prev) => ({ ...prev, from: date }))
            }
            onToChange={(date) =>
              setDateRange((prev) => ({ ...prev, to: date }))
            }
          />
        </CardContent>
      </Card>

      {/* Gráfico de ventas diarias */}
      <Card>
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
              <AreaChart
                data={dailySalesData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="total"
                  name="Monto Total"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p>No hay datos disponibles para este período</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Gráfico de cantidad de productos vendidos por día */}
      <Card>
        <CardHeader>
          <CardTitle>Productos Vendidos por Día</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          {isLoadingProductSales ? (
            <div className="flex items-center justify-center h-full">
              <p>Cargando datos...</p>
            </div>
          ) : productSalesByDayData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={productSalesByDayData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="quantity"
                  name="Cantidad de Productos"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p>No hay datos disponibles para este período</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grid para Top 5 productos y Top 5 clientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Productos */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Productos Vendidos</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {isLoadingTopProducts ? (
              <div className="flex items-center justify-center h-full">
                <p>Cargando datos...</p>
              </div>
            ) : topProducts && topProducts.length > 0 ? (
              <ResponsiveContainer width="110%" height="100%">
                <BarChart
                  data={topProducts}
                  margin={{ top: 5, right: 25, left: -20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis
                    dataKey="productName"
                    type="category"
                    width={150}
                    tick={{ fontSize: 12 }}
                  />
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

        {/* Top Clientes */}
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Clientes</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {isLoadingTopClients ? (
              <div className="flex items-center justify-center h-full">
                <p>Cargando datos...</p>
              </div>
            ) : topClients && topClients.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topClients}
                  margin={{ top: 5, right: 25, left: -20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis
                    dataKey="clientName"
                    type="category"
                    width={150}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value) => [`$${value}`, "Total Comprado"]}
                  />
                  <Legend />
                  <Bar
                    dataKey="totalSpent"
                    name="Total Comprado"
                    fill="#82ca9d"
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
      </div>
    </div>
  );
}
