export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
}