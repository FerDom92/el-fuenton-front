"use client";

import { CrudPageLayout } from "@/components/crud/CrudPageLayout";
import { DeleteConfirmDialog } from "@/components/crud/DeleteConfirmDialog";
import { GenericDialog } from "@/components/crud/GenericDialog";
import { ColumnConfig, GenericTable } from "@/components/crud/GenericTable";
import { ClientForm } from "@/components/pages/ventas/ClientForm";
import { useClientCrud } from "@/hooks/clients/useClientsCrud";
import { useDebounce } from "@/hooks/useDebounce";
import { Client, ClientDTO } from "@/types/client.types";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const ITEMS_PER_PAGE = 10;

export default function ClientsPage() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const debouncedSearch = useDebounce(search, 1000);

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    clients,
    totalPages,
    isLoading,
    isError,
    createClient,
    updateClient,
    deleteClient,
  } = useClientCrud({
    page,
    limit: ITEMS_PER_PAGE,
    search: debouncedSearch,
  });

  if (isError) return <div>Ha ocurrido un error</div>;

  const clientColumns: ColumnConfig<Client>[] = [
    {
      accessor: "name",
      header: "Nombre",
      size: 20,
    },
    {
      accessor: "lastName",
      header: "Apellido",
      size: 15,
    },
    {
      accessor: "email",
      header: "Email",
      size: 50,
    },
  ];

  const handleAdd = () => setIsAddDialogOpen(true);

  const handleEdit = (id: number) => {
    const clientToEdit = clients.find((p: Client) => p.id === id);
    if (clientToEdit) {
      setSelectedClient(clientToEdit);
      setIsEditDialogOpen(true);
    }
  };

  const handleDelete = (id: number) => {
    const clientToDelete = clients.find((p: Client) => p.id === id);
    if (clientToDelete) {
      setSelectedClient(clientToDelete);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleAddSubmit = (data: ClientDTO) => {
    createClient(data);
    setIsAddDialogOpen(false);
  };

  const handleEditSubmit = (data: ClientDTO) => {
    if (selectedClient) {
      updateClient({ ...data, id: selectedClient.id });
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteConfirm = () => {
    if (selectedClient) {
      deleteClient(selectedClient);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <CrudPageLayout
      title="Clientes"
      entities={clients}
      isLoading={isLoading}
      currentPage={page}
      totalPages={totalPages}
      searchValue={search}
      onAddClick={handleAdd}
      onEditClick={handleEdit}
      onDeleteClick={handleDelete}
      searchPlaceholder="Buscar Clientes..."
      renderTable={({ entities, isLoading, onEdit, onDelete }) => (
        <GenericTable
          data={entities}
          columns={clientColumns}
          isLoading={isLoading}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    >
      <GenericDialog
        title="Añadir Cliente"
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      >
        <ClientForm
          onSubmit={handleAddSubmit}
          onCancel={() => setIsAddDialogOpen(false)}
        />
      </GenericDialog>

      <GenericDialog
        title="Editar Cliente"
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      >
        <ClientForm
          initialValues={
            selectedClient
              ? {
                  name: selectedClient.name,
                  lastName: selectedClient.lastName,
                  email: selectedClient.email,
                }
              : undefined
          }
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditDialogOpen(false)}
        />
      </GenericDialog>

      <DeleteConfirmDialog
        entityName="Cliente"
        entityDisplayName={selectedClient?.name}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </CrudPageLayout>
  );
}
