"use client";

import { CrudPageLayout } from "@/components/crud/CrudPageLayout";
import { DeleteConfirmDialog } from "@/components/crud/DeleteConfirmDialog";
import { GenericDialog } from "@/components/crud/GenericDialog";
import { ColumnConfig, GenericTable } from "@/components/crud/GenericTable";
import { useProductCrud } from "@/hooks/products/useProductCrud";
import { useDebounce } from "@/hooks/useDebounce";
import { Product, ProductDTO } from "@/types/product.types";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { ProductForm } from "../../components/pages/productos/ProductForm";

const ITEMS_PER_PAGE = 10;

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const debouncedSearch = useDebounce(search, 1000);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    products,
    totalPages,
    isLoading,
    isError,
    createProduct,
    updateProduct,
    deleteProduct,
  } = useProductCrud({
    page,
    limit: ITEMS_PER_PAGE,
    search: debouncedSearch,
  });

  if (isError) return <div>Ha ocurrido un error</div>;

  const productColumns: ColumnConfig<Product>[] = [
    {
      accessor: "nombre",
      header: "Nombre",
      size: 20,
    },
    {
      accessor: "precio",
      header: "Precio",
      cell: (value) => `$${value}`,
      size: 15,
    },
    {
      accessor: "detalle",
      header: "Detalle",
      size: 50,
    },
  ];

  const handleAdd = () => setIsAddDialogOpen(true);

  const handleEdit = (id: number) => {
    const productToEdit = products.find((p: ProductDTO) => p.id === id);
    if (productToEdit) {
      setSelectedProduct(productToEdit);
      setIsEditDialogOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    const productToDelete = products.find((p: ProductDTO) => p.id === id);
    if (productToDelete) {
      setSelectedProduct(productToDelete);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleAddSubmit = (data: ProductDTO) => {
    createProduct(data);
    setIsAddDialogOpen(false);
  };

  const handleEditSubmit = (data: ProductDTO) => {
    if (selectedProduct) {
      updateProduct({ ...data, id: selectedProduct.id });
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedProduct) {
      deleteProduct(selectedProduct);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <CrudPageLayout
      title="Productos"
      entities={products}
      isLoading={isLoading}
      currentPage={page}
      totalPages={totalPages}
      searchValue={search}
      onAddClick={handleAdd}
      onEditClick={handleEdit}
      onDeleteClick={handleDelete}
      searchPlaceholder="Buscar productos..."
      renderTable={({ entities, isLoading, onEdit, onDelete }) => (
        <GenericTable
          data={entities}
          columns={productColumns}
          isLoading={isLoading}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    >
      <GenericDialog
        title="Añadir Producto"
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      >
        <ProductForm
          onSubmit={handleAddSubmit}
          onCancel={() => setIsAddDialogOpen(false)}
        />
      </GenericDialog>

      <GenericDialog
        title="Editar Producto"
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      >
        <ProductForm
          initialValues={
            selectedProduct
              ? {
                  nombre: selectedProduct.nombre,
                  precio: selectedProduct.precio,
                  detalle: selectedProduct.detalle,
                }
              : undefined
          }
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditDialogOpen(false)}
        />
      </GenericDialog>

      <DeleteConfirmDialog
        entityName="Producto"
        entityDisplayName={selectedProduct?.nombre}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </CrudPageLayout>
  );
}
