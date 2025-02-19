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
import { Producto } from "@/entities/Producto";

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newProduct: Omit<Producto, "id">;
  setNewProduct: (product: Omit<Producto, "id">) => void;
  onConfirm: () => void;
}

export default function AddProductDialog({
  open,
  onOpenChange,
  newProduct,
  setNewProduct,
  onConfirm,
}: AddProductDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Añadir Producto</DialogTitle>
          <DialogDescription>
            Ingrese los detalles del nuevo producto aquí.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nombre" className="text-right">
              Nombre
            </Label>
            <Input
              id="nombre"
              value={newProduct.nombre}
              onChange={(e) =>
                setNewProduct({ ...newProduct, nombre: e.target.value })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="precio" className="text-right">
              Precio
            </Label>
            <Input
              id="precio"
              type="number"
              value={newProduct.precio}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  precio: Number.parseFloat(e.target.value),
                })
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="detalle" className="text-right">
              Detalle
            </Label>
            <Input
              id="detalle"
              type="string"
              value={newProduct.detalle}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  detalle: e.target.value,
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
