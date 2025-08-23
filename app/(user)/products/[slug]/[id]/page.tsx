// app/(user)/products/[slug]/[id]/page.tsx
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { productService } from "@/app/sercices/user/product.service";
import { Product } from "@/app/types/product.types";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { discountPercentage } from "@/app/utils/discountCalculator";
import ProductDetailClient from "./productDetailClientSide";

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
    id: string;
  }>;
}

// Server-side data fetching
async function getProduct(id: string): Promise<Product | null> {
  try {
    console.log("Fetching product with ID:", id);
    const response = await productService.getProductById(id);
    console.log("API Response:", response);

    if (response && response.product) {
      console.log("Product found:", response.product.name);
      return response.product;
    }

    console.log("No product found in response");
    return null;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }
  return {
    title: `${product.name} - Shop Now`,
    description: product.description.substring(0, 160),
    keywords: product.tags.join(", "),
    openGraph: {
      title: product.name,
      description: product.description.substring(0, 160),
      images: [getImageUrl(product.images[0])],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description.substring(0, 160),
      images: [getImageUrl(product.images[0])],
    },
  };
}

// Server Component for Product Detail Page
export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug, id } = await params;
  console.log("Params received:", { slug, id });

  if (!id || id === "undefined") {
    console.error("Invalid product ID");
    notFound();
  }

  const product = await getProduct(id);

  if (!product) {
    console.error("Product not found for ID:", id);
    notFound();
  }

  const formattedTags = Array.isArray(product.tags)
    ? product.tags.map((tag) => {
        if (tag.startsWith('["') || tag.endsWith('"]')) {
          return tag.replace(/\[|\]|"/g, "").trim();
        }
        return tag;
      })
    : [];

  return (
    <ProductDetailClient product={product} formattedTags={formattedTags} />
  );
}
