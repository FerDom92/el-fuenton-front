"use client";

import AddSaleDialog from "@/components/pages/ventas/AddSaleDialog";
import SalesTable from "@/components/pages/ventas/SalesTable";
import { Venta } from "@/entities/Venta";
import { toast } from "@/hooks/useToast";
import { faker } from "@faker-js/faker";
import { useState } from "react";

// Datos de ejemplo
const ventasIniciales: Venta[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  fecha: faker.date.recent().toISOString(),
  cliente: `${faker.person.firstName()} ${faker.person.lastName()}`,
  total: Math.round(Math.random() * 1000 + 50),
}));

export default function Ventas() {
  const [ventas, setVentas] = useState<Venta[]>(ventasIniciales);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newVenta, setNewVenta] = useState<Omit<Venta, "id">>({
    fecha: "",
    cliente: "",
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = () => {
    setIsAddDialogOpen(true);
  };

  const handleAddConfirm = () => {
    setVentas([...ventas, { id: ventas.length + 1, ...newVenta }]);
    setNewVenta({
      fecha: "",
      cliente: "",
      total: 0,
    });
    setIsAddDialogOpen(false);
    toast({
      title: "Venta añadida",
      description: "La nueva venta ha sido añadida con éxito.",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ventas</h1>
      </div>
      <SalesTable
        ventas={ventas}
        isLoading={isLoading}
        onOpenDialog={handleAdd}
      />

      {/* Add Sale Dialog */}
      <AddSaleDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        newVenta={newVenta}
        setNewVenta={setNewVenta}
        onConfirm={handleAddConfirm}
      />
    </div>
  );
}
