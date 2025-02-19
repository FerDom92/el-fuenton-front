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

interface EditProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingProduct: Producto | null;
  setEditingProduct: (product: Producto | null) => void;
  onConfirm: () => void;
}

export default function EditProductDialog({
  open,
  onOpenChange,
  editingProduct,
  setEditingProduct,
  onConfirm,
}: EditProductDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Producto</DialogTitle>
          <DialogDescription>
            Modifique los detalles del producto aquí.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-nombre" className="text-right">
              Nombre
            </Label>
            <Input
              id="edit-nombre"
              value={editingProduct?.nombre || ""}
              onChange={(e) =>
                setEditingProduct(
                  editingProduct
                    ? { ...editingProduct, nombre: e.target.value }
                    : null
                )
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-precio" className="text-right">
              Precio
            </Label>
            <Input
              id="edit-precio"
              type="number"
              value={editingProduct?.precio || 0}
              onChange={(e) =>
                setEditingProduct(
                  editingProduct
                    ? {
                        ...editingProduct,
                        precio: Number.parseFloat(e.target.value),
                      }
                    : null
                )
              }
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-detalle" className="text-right">
              Detalle
            </Label>
            <Input
              id="edit-detalle"
              type="string"
              value={editingProduct?.detalle || ""}
              onChange={(e) =>
                setEditingProduct(
                  editingProduct
                    ? {
                        ...editingProduct,
                        detalle: e.target.value,
                      }
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
