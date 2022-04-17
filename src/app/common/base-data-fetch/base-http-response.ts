export interface Pagination {
  page: number;
  pages: number;
  per_page: number;
  items: number;
  urls: {
    last: string;
    next: string;
  }
}

export interface BaseHttpResponse<T> {
  pagination: Pagination;
  results: T[];
}
