export interface Product {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  tags: string[];
  originalPrice: string;
  discountPrice: string;
  stock: number;
  images: string[];
  reviews: null;
  ratings: null;
  sold_out: number;
  max_quantity_to_order: number;
  createdAt: Date;
  updatedAt: Date;
  Category: Category;
  paymentMethods: string;
}

export interface Category {
  id: number;
  name: string;
  image: string;
}
export interface ProductApiResponse {
  success: boolean;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  products: Product[];
}

export interface ProductState {
  products: ProductApiResponse | null; // whole API response
  product: Product | null;
  trendingProducts: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null | unknown;
}
