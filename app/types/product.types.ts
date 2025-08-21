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
}

export interface Category {
  id: number;
  name: string;
  image: string;
}
export interface ProductState {
  products: Product[];
  product: Product | null;
  trendingProducts: Product[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null | unknown; // ✅ allow string or null
}
