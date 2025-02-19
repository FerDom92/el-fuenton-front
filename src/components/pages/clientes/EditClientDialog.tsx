"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Cliente } from "@/entities/Cliente";

interface EditClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingClient: Cliente | null;
  setEditingClient: (client: Cliente | null) => void;
  onConfirm: () => void;
}

export default function EditClientDialog({
  open,
  onOpenChange,
  editingClient,
  setEditingClient,
  onConfirm,
}: EditClientDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>
            Modifique los detalles del cliente aquí.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-nombre" className="text-right">
              Nombre
            </Label>
            <Input
              id="edit-nombre"
              value={editingClient?.nombre || ""}
              onChange={(e) =>
                setEditingClient(
                  editingClient
                    ? { ...editingClient, nombre: e.target.value }
                    : null
                )
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-email" className="text-right">
              Email
            </Label>
            <Input
              id="edit-email"
              type="email"
              value={editingClient?.email || ""}
              onChange={(e) =>
                setEditingClient(
                  editingClient
                    ? { ...editingClient, email: e.target.value }
                    : null
                )
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-telefono" className="text-right">
              Teléfono
            </Label>
            <Input
              id="edit-telefono"
              value={editingClient?.telefono || ""}
              onChange={(e) =>
                setEditingClient(
                  editingClient
                    ? { ...editingClient, telefono: e.target.value }
                    : null
                )
              }
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={onConfirm}>
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
