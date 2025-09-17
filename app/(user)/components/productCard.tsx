"use client";
import React from "react";
import { Star, Heart, ShoppingCart, Eye, Zap, Truck } from "lucide-react";
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
  const discountAmount = (
    parseFloat(originalPrice) - parseFloat(price)
  ).toFixed(0);

  return (
    <Link href={`/products/${slugify(name)}/${id}`}>
      <div className="group relative bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 hover:border-blue-200/50 hover:bg-gradient-to-br hover:from-white hover:to-blue-50/30">
        {/* Enhanced Discount Badge */}
        <div className="absolute top-4 left-4 z-20">
          <div className="relative">
            <div className="bg-gradient-to-r from-red-500 via-red-600 to-pink-600 text-white px-3 py-1.5 rounded-2xl text-xs font-bold shadow-lg transform -rotate-2 group-hover:rotate-0 transition-transform duration-500">
              <span className="flex items-center gap-1">
                <Zap size={10} className="text-yellow-300" />
                {discount}% OFF
              </span>
            </div>
            {/* Glowing effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-red-600 to-pink-600 rounded-2xl blur-sm opacity-50 -z-10" />
          </div>
        </div>

        {/* Enhanced Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite?.(id);
          }}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-2xl bg-white/90 backdrop-blur-md transition-all duration-300 hover:bg-white hover:scale-110 shadow-lg border border-gray-100/50 group/heart"
        >
          <Heart
            size={18}
            className={`transition-all duration-300 group-hover/heart:scale-110 ${
              isFavorite
                ? "text-red-500 fill-red-500 drop-shadow-sm"
                : "text-gray-400 group-hover/heart:text-red-400"
            }`}
          />
        </button>

        {/* Enhanced Product Image */}
        <div className="relative h-64 overflow-hidden bg-gray-50">
          <img
            src={getImageUrl(image)}
            alt={name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
          />

          {/* Enhanced overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Premium Badge */}
          {rating >= 4.5 && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
              ⭐ Premium Choice
            </div>
          )}

          {/* Enhanced Quick Action Buttons */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
            <button className="bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 border border-gray-100/50 group/quick">
              <Eye
                size={18}
                className="text-gray-700 group-hover/quick:text-blue-600 transition-colors"
              />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
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
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-3 rounded-2xl shadow-xl hover:from-blue-700 hover:to-blue-800 hover:scale-110 transition-all duration-300 group/add"
            >
              <ShoppingCart
                size={18}
                className="group-hover/add:rotate-12 transition-transform"
              />
            </button>
          </div>
        </div>

        {/* Enhanced Product Info */}
        <div className="p-5 space-y-4">
          {/* Product Name */}
          <div className="space-y-2">
            <h3 className="text-gray-900 group-hover:text-blue-700 transition-colors duration-300 truncate text-base leading-snug tracking-tight">
              {name}
            </h3>

            {/* Free shipping indicator */}
          </div>

          {/* Enhanced Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={`transition-all duration-300 ${
                      i < Math.floor(rating)
                        ? "text-yellow-500 fill-yellow-500 drop-shadow-sm"
                        : i === Math.floor(rating) && rating % 1 >= 0.5
                        ? "text-yellow-500 fill-yellow-500/50"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-700 font-medium">
                {rating.toFixed(1)}
              </span>
            </div>

            {/* Enhanced Stock Status */}
          </div>

          {/* Enhanced Price Section */}
          <div className="flex items-end justify-between ">
            <div className="">
              <div className="flex items-baseline space-x-2">
                <span className="text-xl font-bold text-gray-900 tracking-tight">
                  ₹{price}
                </span>
                <span className="text-sm text-gray-500 line-through font-medium">
                  ₹{originalPrice}
                </span>
              </div>
              {/* <div className="text-xs text-green-600 font-semibold">
                You save ₹{discountAmount}
              </div> */}
            </div>

            {/* Enhanced Add to Cart Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
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
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl group/cart transform hover:scale-105"
            >
              <ShoppingCart
                size={18}
                className="group-hover/cart:rotate-12 transition-transform duration-300"
              />
            </button>
          </div>

          {/* Payment Methods Indicator */}
          {/* <div className="pt-2 border-t border-gray-100">
            <div className="text-xs text-gray-500 font-medium">
              💳 {paymentMethods} accepted
            </div>
          </div> */}
        </div>

        {/* Enhanced Shimmer Effect */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-1200 ease-out" />

        {/* Subtle border glow on hover */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-xl -z-10" />
      </div>
    </Link>
  );
};

export default ProductCard;
