export interface BaseEntity {
  id: number;
}

export interface CrudHooksConfig {
  entityName: string;
  endpoint: string;
  useToastOnSuccess?: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  totalPages: number;
}

