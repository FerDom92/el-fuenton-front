"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Cliente } from "@/entities/Cliente";
import { createColumnHelper, flexRender } from "@tanstack/react-table";
import { Pencil, Plus, Trash } from "lucide-react";
import { useClientesTable } from "../../../hooks/useClientesTable";

const columnHelper = createColumnHelper<Cliente>();

interface ClientTableProps {
  clientes: Cliente[];
  isLoading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onOpenDialog: (value: boolean) => void;
}

export default function ClientTable({
  clientes,
  isLoading,
  onEdit,
  onDelete,
  onOpenDialog,
}: ClientTableProps) {
  const handleAdd = () => onOpenDialog(true);

  const columns = [
    columnHelper.accessor("nombre", {
      cell: (info) => info.getValue(),
      header: () => <span>Nombre</span>,
    }),
    columnHelper.accessor("email", {
      cell: (info) => info.getValue(),
      header: () => <span>Email</span>,
    }),
    columnHelper.accessor("telefono", {
      cell: (info) => info.getValue(),
      header: () => <span>Teléfono</span>,
    }),
    columnHelper.accessor("id", {
      cell: (info) => (
        <div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(info.getValue())}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(info.getValue())}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
      header: () => <span>Acciones</span>,
    }),
  ];

  const clientesTable = useClientesTable(clientes, columns);

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {clientesTable.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="h-4 w-full bg-gray-200 rounded-md animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-full bg-gray-200 rounded-md animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-full bg-gray-200 rounded-md animate-pulse" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-full bg-gray-200 rounded-md animate-pulse" />
                    </TableCell>
                  </TableRow>
                ))
              : clientesTable.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} style={{ height: "3rem" }}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center space-x-2 justify-between">
        <Button size="sm" onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Añadir Cliente
        </Button>

        <div className="flex gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => clientesTable.previousPage()}
            disabled={!clientesTable.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => clientesTable.nextPage()}
            disabled={!clientesTable.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </>
  );
}
