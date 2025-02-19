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
import { Producto } from "@/entities/Producto";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Pencil, Trash } from "lucide-react";

const columnHelper = createColumnHelper<Producto>();

interface ProductTableProps {
  productos: Producto[];
  isLoading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function ProductTable({
  productos,
  isLoading,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const columns = [
    columnHelper.accessor("nombre", {
      cell: (info) => (
        <div className="truncate max-w-full" title={info.getValue()}>
          {info.getValue()}
        </div>
      ),
      header: () => <span>Nombre</span>,
      size: 20,
      minSize: 100,
    }),
    columnHelper.accessor("precio", {
      cell: (info) => `$${info.getValue()}`,
      header: () => <span>Precio</span>,
      size: 15,
      minSize: 70,
    }),
    columnHelper.accessor("detalle", {
      cell: (info) => (
        <div className="truncate max-w-full" title={info.getValue()}>
          {info.getValue()}
        </div>
      ),
      header: () => <div>Detalle</div>,
      size: 50,
      minSize: 200,
    }),
    columnHelper.accessor("id", {
      cell: (info) => (
        <div className="flex justify-center">
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
      header: () => <span className="flex justify-center">Acciones</span>,
      size: 15,
      minSize: 70,
    }),
  ];

  const table = useReactTable({
    data: productos,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <div className="rounded-md border">
        <Table className="table-fixed w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{
                      width: `${header.column.columnDef.size}%`,
                    }}
                    className="truncate"
                  >
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
              ? Array.from({ length: 10 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell style={{ width: "20%" }}>
                      <Skeleton className="h-4 my-2 w-full" />
                    </TableCell>
                    <TableCell style={{ width: "15%" }}>
                      <Skeleton className="h-4 my-2 w-full" />
                    </TableCell>
                    <TableCell style={{ width: "50%" }}>
                      <Skeleton className="h-4 my-2 w-full" />
                    </TableCell>
                    <TableCell style={{ width: "15%" }}>
                      <Skeleton className="h-4 my-2 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              : table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} style={{ height: "3rem" }}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{
                          width: `${cell.column.columnDef.size}%`,
                        }}
                        className="overflow-hidden"
                      >
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
    </>
  );
}
