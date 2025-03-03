import { Button } from "@/components/ui/button";
import { GenericDialog } from "./GenericDialog";

interface DeleteConfirmDialogProps {
  entityName: string;
  entityDisplayName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DeleteConfirmDialog({
  entityName,
  entityDisplayName,
  open,
  onOpenChange,
  onConfirm,
}: DeleteConfirmDialogProps) {
  return (
    <GenericDialog
      title={`Eliminar ${entityName}`}
      open={open}
      onOpenChange={onOpenChange}
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Eliminar
          </Button>
        </>
      }
    >
      <div className="py-4">
        ¿Estás seguro de que deseas eliminar{" "}
        {entityDisplayName
          ? `"${entityDisplayName}"`
          : `este ${entityName.toLowerCase()}`}
        ? Esta acción no se puede deshacer.
      </div>
    </GenericDialog>
  );
}
