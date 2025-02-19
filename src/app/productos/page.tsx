"use client";

import {
  AddProductDialog,
  DeleteProductDialog,
  EditProductDialog,
} from "@/components/pages/productos/ProductDialogs";
import ProductTable from "@/components/pages/productos/ProductTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { Producto } from "@/entities/Producto";
import useCreateProducto from "@/hooks/productos/useCreateProducto";
import useDeleteProducto from "@/hooks/productos/useDeleteProducto";
import useEditProducto from "@/hooks/productos/useEditProducto";
import useProductos from "@/hooks/productos/useProductos";
import { useDebounce } from "@/hooks/useDebounce";
import { useToast } from "@/hooks/useToast";
import type { ProductFormValues } from "@/schemas/product.shema";
import { Plus, SearchX } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

const ITEMS_PER_PAGE = 10;

export default function Productos() {
  const { toast } = useToast();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";

  const debouncedSearch = useDebounce(search, 1000);

  const [editingProduct, setEditingProduct] = useState<Producto | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { productos, isLoading, isError } = useProductos({
    page,
    limit: ITEMS_PER_PAGE,
    search: debouncedSearch,
  });

  const { onEditProducto } = useEditProducto();
  const { onDeleteProducto } = useDeleteProducto();
  const { onCreateProducto } = useCreateProducto();

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          current.delete(key);
        } else {
          current.set(key, String(value));
        }
      }

      return current.toString();
    },
    [searchParams]
  );

  if (isError) return <div>Ha ocurrido un error</div>;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value;
    const queryString = createQueryString({
      search: newSearch || null,
      page: 1, // Reset a la primera página al buscar
    });
    router.push(`${pathname}?${queryString}`);
  };

  const handlePageChange = (newPage: number) => {
    const queryString = createQueryString({ page: newPage });
    router.push(`${pathname}?${queryString}`);
  };

  const handleAdd = () => setIsAddDialogOpen(true);

  const handleClearFlilter = () => {
    const queryString = createQueryString({
      search: null,
      page: 1, // Reset a la primera página al limpiar
    });
    router.push(`${pathname}?${queryString}`);
  };

  const handleAddSubmit = (data: ProductFormValues) => {
    onCreateProducto(data);
    setIsAddDialogOpen(false);
    toast({
      title: "Producto añadido",
      description: "El nuevo producto ha sido añadido con éxito.",
      duration: 2000,
    });
  };

  const handleEdit = (id: number) => {
    const productToEdit = productos.find((p) => p.id === id);
    if (productToEdit) {
      setEditingProduct(productToEdit);
      setIsEditDialogOpen(true);
    }
  };

  const handleEditSubmit = (data: ProductFormValues) => {
    if (editingProduct) {
      onEditProducto({ ...data, id: editingProduct.id });
      setIsEditDialogOpen(false);
      toast({
        title: "Producto actualizado",
        description: "El producto ha sido actualizado con éxito.",
        duration: 2000,
      });
    }
  };

  const handleDelete = (id: number) => {
    const productToDelete = productos.find((p) => p.id === id);
    if (productToDelete) {
      setEditingProduct(productToDelete);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleDeleteConfirm = () => {
    if (editingProduct) {
      onDeleteProducto(editingProduct);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado con éxito.",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Productos</h1>
      </div>

      <div className="flex justify-between">
        <div className="flex gap-4 items-center">
          <Input
            placeholder="Buscar productos..."
            value={search}
            onChange={handleSearchChange}
            className="w-96"
          />

          <Button onClick={handleClearFlilter} variant="outline">
            <SearchX /> Limpiar filtro
          </Button>
        </div>
        <div className="flex items-centerspace-x-2 justify-between">
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" /> Añadir Producto
          </Button>
        </div>
      </div>

      <ProductTable
        productos={productos}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {productos.length > 0 && (
        <div className="mt-4">
          <Pagination
            currentPage={page}
            totalPages={10} //TODO: cambiar cuando venga del backend
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <AddProductDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleAddSubmit}
      />

      <EditProductDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        product={editingProduct}
        onSubmit={handleEditSubmit}
      />

      <DeleteProductDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        productName={editingProduct?.nombre}
      />
    </div>
  );
}
