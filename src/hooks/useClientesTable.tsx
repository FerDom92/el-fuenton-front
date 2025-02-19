import { Cliente } from "@/entities/Cliente";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

export const useClientesTable = (
  clientes: Cliente[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<Cliente, any>[]
) => {
  return useReactTable({
    data: clientes,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
};
