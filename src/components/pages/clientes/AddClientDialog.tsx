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

interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newClient: Omit<Cliente, "id">;
  setNewClient: (client: Omit<Cliente, "id">) => void;
  onConfirm: () => void;
}

export default function AddClientDialog({
  open,
  onOpenChange,
  newClient,
  setNewClient,
  onConfirm,
}: AddClientDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Añadir Cliente</DialogTitle>
          <DialogDescription>
            Ingrese los detalles del nuevo cliente aquí.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nombre" className="text-right">
              Nombre
            </Label>
            <Input
              id="nombre"
              value={newClient.nombre}
              onChange={(e) =>
                setNewClient({ ...newClient, nombre: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={newClient.email}
              onChange={(e) =>
                setNewClient({ ...newClient, email: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="telefono" className="text-right">
              Teléfono
            </Label>
            <Input
              id="telefono"
              value={newClient.telefono}
              onChange={(e) =>
                setNewClient({ ...newClient, telefono: e.target.value })
              }
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={onConfirm}>
            Añadir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
