"use client";
import React from "react";
import { Star, Heart } from "lucide-react";
import { Product } from "@/app/types/product.types";
interface ProductCardProps {
  id: number;
  name: string;
  image: string; // ✅ derived from product.images[0]
  price: string; // ✅ derived from discountPrice
  originalPrice: string;
  rating: number; // ✅ derived from ratings ?? 0
  discount: number; // ✅ computed
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
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
  onToggleFavorite,
}) => {
  return (
    <div
      className="group relative bg-white rounded-2xl shadow-lg overflow-hidden 
      transition-all duration-700 hover:shadow-2xl hover:-translate-y-2"
    >
      {/* Discount Badge */}
      <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
        {discount}% discount
      </div>

      {/* Favorite Button */}
      <button
        onClick={() => onToggleFavorite(id)}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm 
        transition-all duration-300 hover:bg-white hover:scale-110"
      >
        <Heart
          size={18}
          className={`transition-colors duration-300 ${
            isFavorite ? "text-red-500 fill-red-500" : "text-gray-400"
          }`}
        />
      </button>

      {/* Product Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent 
        opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        <h3
          className="font-semibold text-gray-800 group-hover:text-blue-600 
        transition-colors duration-300 line-clamp-2"
        >
          {name}
        </h3>

        {/* Rating */}
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={`${
                i < Math.floor(rating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-sm text-gray-600 ml-2">{rating}</span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-green-600">{price}</span>
          <span className="text-sm text-gray-500 line-through">
            {originalPrice}
          </span>
        </div>

        {/* Add to Cart Button */}
        <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg transform hover:scale-105 active:scale-95">
          Add to Cart
        </button>
      </div>

      {/* Shimmer Effect */}
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-1000" />
    </div>
  );
};

export default ProductCard;
