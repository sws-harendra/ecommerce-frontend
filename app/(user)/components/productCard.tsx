"use client";
import React from "react";
import { Star, Heart, ShoppingCart, Eye } from "lucide-react";
import Link from "next/link";
import { slugify } from "@/app/utils/slugify";
import { useAppDispatch } from "@/app/lib/store/store";
import { addToCart } from "@/app/lib/store/features/cartSlice";
import { getImageUrl } from "@/app/utils/getImageUrl";

interface ProductCardProps {
  id: number;
  name: string;
  image: string;
  price: string;
  originalPrice: string;
  rating: number;
  discount: number;
  isFavorite?: boolean;
  onToggleFavorite?: (id: number) => void;
  paymentMethods: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  image,
  price,
  originalPrice,
  rating,
  discount,
  isFavorite,
  paymentMethods,
  onToggleFavorite,
}) => {
  const dispatch = useAppDispatch();
  return (
    <Link href={`/products/${slugify(name)}/${id}`}>
      <div className="group relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
        {/* Discount Badge */}

        <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-md">
          {discount}% OFF
        </div>

        {/* Favorite Button */}
        {/* <button
          // onClick={() => onToggleFavorite(id)}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:scale-110 shadow-sm"
        >
          <Heart
            size={18}
            className={`transition-colors duration-300 ${
              isFavorite ? "text-red-500 fill-red-500" : "text-gray-400"
            }`}
          />
        </button> */}

        {/* Product Image */}
        <div className="relative h-60 overflow-hidden">
          <img
            src={getImageUrl(image)}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Quick Action Buttons */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white hover:scale-105 transition-all duration-200">
              <Eye size={16} className="text-gray-700" />
            </button>
            <button className="bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 hover:scale-105 transition-all duration-200 flex items-center justify-center">
              <ShoppingCart size={16} />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          <h3 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2 text-sm leading-tight">
            {name}
          </h3>

          {/* Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={`${
                    i < Math.floor(rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-xs text-gray-600 ml-1">
                {rating.toFixed(1)}
              </span>
            </div>

            {/* Stock Status */}
            <span className="text-xs text-green-600 font-medium">In Stock</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-baseline space-x-2">
              <span className="text-lg font-bold text-gray-900">{price}</span>
              <span className="text-sm text-gray-500 line-through">
                {originalPrice}
              </span>
            </div>

            {/* Add to Cart Button - Compact Version */}
            <button
              onClick={(e) => {
                e.preventDefault(); // prevent navigation
                e.stopPropagation(); // stop bubbling
                dispatch(
                  addToCart({
                    id: id,
                    name: name,
                    price: parseFloat(price),
                    quantity: 1,
                    imageUrl: image || "",
                    paymentMethods: paymentMethods,
                  })
                );
              }}
              className="bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-200 transition-colors duration-200 group/cart"
            >
              <ShoppingCart
                size={16}
                className="group-hover/cart:scale-110 transition-transform"
              />
            </button>
          </div>
        </div>

        {/* Shimmer Effect */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-1000" />
      </div>
    </Link>
  );
};

export default ProductCard;
