import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Producto } from "@/entities/Producto";
import type { ProductFormValues } from "@/schemas/product.shema";
import { ProductForm } from "./ProductForm";

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface AddProductDialogProps extends ProductDialogProps {
  onSubmit: (data: ProductFormValues) => void;
}

export function AddProductDialog({
  open,
  onOpenChange,
  onSubmit,
}: AddProductDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Añadir Producto</DialogTitle>
        </DialogHeader>
        <ProductForm onSubmit={onSubmit} submitText="Añadir" />
      </DialogContent>
    </Dialog>
  );
}

interface EditProductDialogProps extends ProductDialogProps {
  product: Producto | null;
  onSubmit: (data: ProductFormValues) => void;
}

export function EditProductDialog({
  open,
  onOpenChange,
  product,
  onSubmit,
}: EditProductDialogProps) {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Producto</DialogTitle>
        </DialogHeader>
        <ProductForm
          defaultValues={product}
          onSubmit={onSubmit}
          submitText="Actualizar"
        />
      </DialogContent>
    </Dialog>
  );
}

interface DeleteProductDialogProps extends ProductDialogProps {
  onConfirm: () => void;
  productName?: string;
}

export function DeleteProductDialog({
  open,
  onOpenChange,
  onConfirm,
  productName,
}: DeleteProductDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Se eliminará permanentemente{" "}
            {productName ? `el producto "${productName}"` : "el producto"} y
            todos sus datos asociados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Eliminar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
