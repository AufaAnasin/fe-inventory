export interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
  description?: string | null;
  createdAt?: string;
}

export interface PaginationResponse {
  products: Product[];
  pagination: {
    totalPages: number;
    currentPage: number;
    totalItems: number;
  };
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
}