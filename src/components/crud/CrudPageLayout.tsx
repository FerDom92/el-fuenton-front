import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { BaseEntity } from "@/types/entity.types";
import { Plus, SearchX } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback } from "react";

interface CrudPageLayoutProps<T extends BaseEntity> {
  title: string;
  entities: T[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  searchValue: string;
  children: React.ReactNode;
  onAddClick: () => void;
  onEditClick: (id: number) => void;
  onDeleteClick: (id: number) => void;
  renderTable: (props: {
    entities: T[];
    isLoading: boolean;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
  }) => React.ReactNode;
  searchPlaceholder?: string;
}

export function CrudPageLayout<T extends BaseEntity>({
  title,
  entities,
  isLoading,
  currentPage,
  totalPages,
  searchValue,
  children,
  onAddClick,
  onEditClick,
  onDeleteClick,
  renderTable,
  searchPlaceholder = "Buscar...",
}: CrudPageLayoutProps<T>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          current.delete(key);
        } else {
          current.set(key, String(value));
        }
      }

      return current.toString();
    },
    [searchParams]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = e.target.value;
    const queryString = createQueryString({
      search: newSearch || null,
      page: 1,
    });
    router.push(`${pathname}?${queryString}`);
  };

  const handlePageChange = (newPage: number) => {
    const queryString = createQueryString({ page: newPage });
    router.push(`${pathname}?${queryString}`);
  };

  const handleClearFilter = () => {
    const queryString = createQueryString({
      search: null,
      page: 1,
    });
    router.push(`${pathname}?${queryString}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>

      <div className="flex justify-between">
        <div className="flex gap-4 items-center">
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={handleSearchChange}
            className="w-96"
          />

          <Button onClick={handleClearFilter} variant="outline">
            <SearchX className="mr-2 h-4 w-4" /> Limpiar filtro
          </Button>
        </div>
        <div className="flex items-center space-x-2 justify-between">
          <Button onClick={onAddClick}>
            <Plus className="mr-2 h-4 w-4" /> Añadir {title.slice(0, -1)}
          </Button>
        </div>
      </div>

      {renderTable({
        entities,
        isLoading,
        onEdit: onEditClick,
        onDelete: onDeleteClick,
      })}

      {entities.length > 0 && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {children}
    </div>
  );
}
