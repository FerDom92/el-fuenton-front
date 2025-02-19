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
import { Venta } from "@/entities/Venta";

interface AddSaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newVenta: Omit<Venta, "id">;
  setNewVenta: (venta: Omit<Venta, "id">) => void;
  onConfirm: () => void;
}

export default function AddSaleDialog({
  open,
  onOpenChange,
  newVenta,
  setNewVenta,
  onConfirm,
}: AddSaleDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Añadir Venta</DialogTitle>
          <DialogDescription>
            Ingrese los detalles de la nueva venta aquí.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fecha" className="text-right">
              Fecha
            </Label>
            <Input
              id="fecha"
              type="date"
              value={newVenta.fecha}
              onChange={(e) =>
                setNewVenta({ ...newVenta, fecha: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cliente" className="text-right">
              Cliente
            </Label>
            <Input
              id="cliente"
              value={newVenta.cliente}
              onChange={(e) =>
                setNewVenta({ ...newVenta, cliente: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="total" className="text-right">
              Total
            </Label>
            <Input
              id="total"
              type="number"
              value={newVenta.total}
              onChange={(e) =>
                setNewVenta({
                  ...newVenta,
                  total: Number.parseFloat(e.target.value),
                })
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
