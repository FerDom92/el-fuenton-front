"use client";

import AddClientDialog from "@/components/pages/clientes/AddClientDialog";
import ClientTable from "@/components/pages/clientes/ClientTable";
import DeleteClientDialog from "@/components/pages/clientes/DeleteClientDialog";
import EditClientDialog from "@/components/pages/clientes/EditClientDialog";
import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Cliente } from "@/entities/Cliente";
import { useToast } from "@/hooks/useToast";
import { faker } from "@faker-js/faker";
import { isUndefined } from "lodash";
import { useEffect, useState } from "react";

// Datos de ejemplo
const clientesIniciales: Cliente[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  nombre: faker.person.fullName(),
  email: faker.internet.email(),
  telefono: faker.phone.number(),
}));

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>();
  const [editingClient, setEditingClient] = useState<Cliente | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [newClient, setNewClient] = useState<Omit<Cliente, "id">>({
    nombre: "",
    email: "",
    telefono: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    setClientes(clientesIniciales);
    setIsLoading(false);
  }, []);

  if (isUndefined(clientes)) return <ErrorMessage />;

  const handleAddConfirm = () => {
    toast.toast({
      title: "Cliente añadido",
      description: "El nuevo cliente ha sido añadido correctamente.",
    });
    setClientes([{ id: clientes.length + 1, ...newClient }, ...clientes]);
    setNewClient({ nombre: "", email: "", telefono: "" });
    setIsAddDialogOpen(false);
  };

  const handleEdit = (id: number) => {
    const clientToEdit = clientes.find((c) => c.id === id);
    if (clientToEdit) {
      setEditingClient(clientToEdit);
      setIsEditDialogOpen(true);
    }
  };

  const handleEditConfirm = () => {
    if (editingClient) {
      toast.toast({
        title: "Cliente actualizado",
        description: "Los cambios se han guardado correctamente.",
      });
      setClientes(
        clientes.map((c) => (c.id === editingClient.id ? editingClient : c))
      );
      setIsEditDialogOpen(false);
    }
  };

  const handleDelete = (id: number) => {
    setEditingClient(clientes.find((c) => c.id === id) || null);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (editingClient) {
      toast.toast({
        title: "Cliente eliminado",
        description: "El cliente ha sido eliminado correctamente.",
      });
      setClientes(clientes.filter((c) => c.id !== editingClient.id));
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clientes</h1>
      </div>
      <ClientTable
        clientes={clientes}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onOpenDialog={setIsAddDialogOpen}
      />

      {/* Add Client Dialog */}
      <AddClientDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        newClient={newClient}
        setNewClient={setNewClient}
        onConfirm={handleAddConfirm}
      />

      {/* Edit Client Dialog */}
      <EditClientDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        editingClient={editingClient}
        setEditingClient={setEditingClient}
        onConfirm={handleEditConfirm}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteClientDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
