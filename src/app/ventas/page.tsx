"use client";

import { CrudPageLayout } from "@/components/crud/CrudPageLayout";
import { DeleteConfirmDialog } from "@/components/crud/DeleteConfirmDialog";
import { GenericDialog } from "@/components/crud/GenericDialog";
import { ColumnConfig, GenericTable } from "@/components/crud/GenericTable";
import { SaleForm } from "@/components/pages/ventas/SaleForm";
import { useSaleCrud } from "@/hooks/sales/useSaleCrud";
import { useDebounce } from "@/hooks/useDebounce";
import { Sale, SaleDTO } from "@/types/sale.types";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const ITEMS_PER_PAGE = 10;

export default function SalesPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const debouncedSearch = useDebounce(search, 1000);

  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { sales, totalPages, isLoading, isError, createSale, deleteSale } =
    useSaleCrud({
      page,
      limit: ITEMS_PER_PAGE,
      search: debouncedSearch,
    });

  if (isError) return <div>Ha ocurrido un error</div>;

  const saleColumns: ColumnConfig<Sale>[] = [
    {
      accessor: "id",
      header: "Nº",
      size: 10,
    },
    {
      accessor: "date",
      header: "Fecha",
      cell: (value) => format(new Date(value as string), "dd/MM/yyyy HH:mm"),
      size: 20,
    },
    {
      accessor: "client",
      header: "Cliente",
      cell: (_, row) => {
        const client = row?.client;
        if (!client) return "Cliente no disponible";
        return `${client.name} ${client.lastName}`;
      },
      size: 25,
    },
    {
      accessor: "items",
      header: "Items",
      cell: (value) => {
        const items = value as any[];
        return items ? items.length : 0;
      },
      size: 10,
    },
    {
      accessor: "total",
      header: "Total",
      cell: (value) => `$${Number(value).toFixed(2)}`,
      size: 15,
    },
  ];

  const handleAdd = () => setIsAddDialogOpen(true);

  const handleEdit = (id: number) => {
    console.log("Editando venta con ID:", id);
    const saleToEdit = sales.find((s: Sale) => s.id === id);
    if (saleToEdit) {
      setSelectedSale(saleToEdit);
      setIsEditDialogOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    const saleToDelete = sales.find((s: Sale) => s.id === id);
    if (saleToDelete) {
      setSelectedSale(saleToDelete);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleAddSubmit = (data: SaleDTO) => {
    try {
      // Asegurarnos que clientId sea un número
      const saleData = {
        ...data,
        clientId: Number(data.clientId) || 1,
      };

      console.log("Creando venta:", saleData);
      createSale(saleData);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error al crear venta:", error);
    }
  };

  const handleEditSubmit = (data: SaleDTO) => {
    try {
      // Para la edición, podríamos implementar esto más adelante
      console.log("Editando venta:", data);
      // Por ahora, solo cerramos el diálogo
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error al editar venta:", error);
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedSale) {
      deleteSale(selectedSale);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <CrudPageLayout
      title="Ventas"
      entities={sales}
      isLoading={isLoading}
      currentPage={page}
      totalPages={totalPages}
      searchValue={search}
      onAddClick={handleAdd}
      onEditClick={handleEdit}
      onDeleteClick={handleDelete}
      searchPlaceholder="Buscar ventas..."
      renderTable={({ entities, isLoading, onEdit, onDelete }) => (
        <GenericTable
          data={entities}
          columns={saleColumns}
          isLoading={isLoading}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    >
      <GenericDialog
        title="Nueva Venta"
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      >
        <SaleForm
          onSubmit={handleAddSubmit}
          onCancel={() => setIsAddDialogOpen(false)}
        />
      </GenericDialog>

      <GenericDialog
        title="Ver Detalles de Venta"
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      >
        {selectedSale && (
          <div className="py-4">
            <h3 className="font-medium mb-2">Venta #{selectedSale.id}</h3>
            <p>
              <strong>Fecha:</strong>{" "}
              {format(new Date(selectedSale.date), "dd/MM/yyyy HH:mm")}
            </p>
            <p>
              <strong>Cliente:</strong> {selectedSale.client?.name}{" "}
              {selectedSale.client?.lastName}
            </p>
            <p>
              <strong>Total:</strong> ${Number(selectedSale.total).toFixed(2)}
            </p>

            <h4 className="font-medium mt-4 mb-2">Productos:</h4>
            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-2 text-left">Producto</th>
                    <th className="p-2 text-right">Precio</th>
                    <th className="p-2 text-right">Cantidad</th>
                    <th className="p-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedSale.items.map((item, index) => (
                    <tr key={`sale_item_${index}`} className="border-t">
                      <td className="p-2">
                        {item.product?.name || `Producto #${item.productId}`}
                      </td>
                      <td className="p-2 text-right">
                        ${Number(item.unitPrice).toFixed(2)}
                      </td>
                      <td className="p-2 text-right">{item.quantity}</td>
                      <td className="p-2 text-right">
                        ${Number(item.total).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t font-medium">
                    <td className="p-2" colSpan={3}>
                      Total
                    </td>
                    <td className="p-2 text-right">
                      ${Number(selectedSale.total).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="mt-4"
              >
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </GenericDialog>

      <DeleteConfirmDialog
        entityName="Venta"
        entityDisplayName={`Venta #${selectedSale?.id}`}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </CrudPageLayout>
  );
}

// Definición de Button para el modal de detalles
function Button({
  children,
  variant = "default",
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  variant?: "default" | "outline";
  onClick?: () => void;
  className?: string;
}) {
  const baseClasses = "px-4 py-2 rounded-md text-sm font-medium";
  const variantClasses =
    variant === "outline"
      ? "border border-gray-300 text-gray-700 hover:bg-gray-50"
      : "bg-primary text-primary-foreground hover:bg-primary/90";

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
