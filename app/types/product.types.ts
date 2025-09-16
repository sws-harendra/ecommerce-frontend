export interface ProductVariantOption {
  id: number;
  name: string;
  value: string;
  hexCode?: string | null;
  imageUrl?: string | null;
  category: {
    id: number;
    name: string;
  };
}

export interface ProductVariant {
  id: number;
  sku?: string | null;
  price: string;
  stock: number;
  image?: string | null;
  isActive: boolean;
  options: ProductVariantOption[];
}

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
  ProductVariants?: ProductVariant[]; // 👈 add this
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
  products: ProductApiResponse | []; // whole API response
  product: Product | null;
  trendingProducts: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null | unknown;
}
