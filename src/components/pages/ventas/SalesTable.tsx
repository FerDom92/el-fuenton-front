"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Venta } from "@/entities/Venta";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Plus } from "lucide-react";

const columnHelper = createColumnHelper<Venta>();

interface SalesTableProps {
  ventas: Venta[];
  isLoading: boolean;
  onOpenDialog: () => void;
}

export default function SalesTable({
  ventas,
  isLoading,
  onOpenDialog,
}: SalesTableProps) {
  const columns = [
    columnHelper.accessor("fecha", {
      cell: (info) => info.getValue(),
      header: () => <span>Fecha</span>,
    }),
    columnHelper.accessor("cliente", {
      cell: (info) => info.getValue(),
      header: () => <span>Cliente</span>,
    }),
    columnHelper.accessor("total", {
      cell: (info) => `$${info.getValue().toFixed(2)}`,
      header: () => <span>Total</span>,
    }),
  ];

  const table = useReactTable({
    data: ventas,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
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
                      <Skeleton className="h-4 w-auto" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-auto" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-auto" />
                    </TableCell>
                  </TableRow>
                ))
              : table.getRowModel().rows.map((row) => (
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
      <div className="flex items-center justify-between space-x-2">
        <Button size="sm" onClick={onOpenDialog}>
          <Plus className="mr-2 h-4 w-4" /> Añadir Venta
        </Button>
        <div className="flex gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </>
  );
}
