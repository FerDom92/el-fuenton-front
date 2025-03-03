/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { BaseEntity } from "@/types/entity.types";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Pencil, Trash } from "lucide-react";

export interface ColumnConfig<T> {
  accessor: any;
  header: string;
  cell?: (value: unknown) => React.ReactNode;
  size?: number;
}

interface GenericTableProps<T extends BaseEntity> {
  data: T[];
  columns: ColumnConfig<T>[];
  isLoading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function GenericTable<T extends BaseEntity>({
  data,
  columns,
  isLoading,
  onEdit,
  onDelete,
}: GenericTableProps<T>) {
  const columnHelper = createColumnHelper<T>();

  const tableColumns = [
    ...columns.map((col) =>
      columnHelper.accessor(col.accessor as any, {
        cell: (info) =>
          col.cell ? (
            col.cell(info.getValue())
          ) : (
            <div
              className="truncate max-w-full"
              title={String(info.getValue())}
            >
              {String(info.getValue())}
            </div>
          ),
        header: () => <span>{col.header}</span>,
        size: col.size,
      })
    ),
    columnHelper.accessor("id" as any, {
      cell: (info) => (
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(info.getValue() as number)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(info.getValue() as number)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
      header: () => <span>Acciones</span>,
      size: 15,
    }),
  ];

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
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
                  {columns.map((_, colIndex) => (
                    <TableCell
                      key={colIndex}
                      style={{ width: `${_.size || 20}%` }}
                    >
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                  <TableCell style={{ width: "15%" }}>
                    <Skeleton className="h-4 w-full" />
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
  );
}
