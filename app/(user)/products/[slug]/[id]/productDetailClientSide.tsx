"use client";

import Image from "next/image";
import { Product } from "@/app/types/product.types";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { discountPercentage } from "@/app/utils/discountCalculator";
import { useState, useEffect } from "react";
import Link from "next/link";
import Heading from "@/app/commonComponents/heading";
import Loader from "@/app/commonComponents/loader";
import { BugPlayIcon, ShoppingBag, ShoppingCart, Wallet } from "lucide-react";
import { addToCart } from "@/app/lib/store/features/cartSlice";
import { useAppDispatch } from "@/app/lib/store/store";

interface ProductDetailClientProps {
  product: Product;
  formattedTags: string[];
}

export default function ProductDetailClient({
  product,
  formattedTags,
}: ProductDetailClientProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const dispatch = useAppDispatch(); // ✅ typed dispatch

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-200 to-blue-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-4">
        {/* Breadcrumb with Animation */}
        <div className="mb-8 animate-fade-in-up">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link
              href={"/"}
              className="hover:text-blue-600 cursor-pointer transition-colors"
            >
              <Heading title="Home" />
            </Link>
            <Heading title="/" />
            <Link
              href={"/products"}
              className="hover:text-blue-600 cursor-pointer transition-colors"
            >
              <Heading title="Products" />
            </Link>{" "}
            <Heading title="/" />
            <Link
              href={`/products?search=${product?.categoryId}`}
              className="hover:text-blue-600 cursor-pointer transition-colors"
            >
              <Heading title={product?.Category?.name} />
            </Link>
            <Heading title="/" />
            <span className="text-gray-900 font-medium">
              <Heading title={product.name} />
            </span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Product Images Section */}
          <div className="space-y-6 animate-fade-in-left">
            {/* Main Image with Hover Effect */}
            <div className="group relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 group-hover:to-black/10 transition-all duration-500"></div>
              {product.images && product.images.length > 0 ? (
                <Image
                  src={getImageUrl(product.images[selectedImage])}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <p>No Image Available</p>
                  </div>
                </div>
              )}

              {/* Floating Discount Badge */}
              <div className="absolute top-4 right-4 transform rotate-12">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse">
                  {discountPercentage(
                    parseFloat(product.originalPrice),
                    parseFloat(product.discountPrice)
                  )}
                  % OFF
                </div>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.slice(0, 4).map((image, index) => (
                  <div
                    key={index}
                    className={`group aspect-square relative overflow-hidden rounded-xl bg-gray-100 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg animate-fade-in-up ${
                      selectedImage === index ? "ring-2 ring-blue-500" : ""
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={getImageUrl(image)}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Information Section */}
          <div className="space-y-5 animate-fade-in-right">
            {/* Header */}
            <div className="space-y-4">
              <div className="inline-block">
                <span className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full">
                  {product.Category?.name || "Uncategorized"}
                </span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Price Section with Animation */}
            <div className="space-y-1 ">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  ₹{product.discountPrice}
                </span>
                <span className="text-2xl text-gray-400 line-through">
                  ₹{product.originalPrice}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <span className="text-orange-500 ">You save: </span>
                  <span className="text-orange-500 font-bold ml-1">
                    ₹
                    {(
                      parseFloat(product.originalPrice) -
                      parseFloat(product.discountPrice)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <h3 className="text-xl font-semibold text-gray-900">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed text-base">
                {product.description}
              </p>
            </div>

            {/* Product Details Grid */}
            {product?.stock < 10 && (
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm hover:shadow-md transition-all duration-300">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Stock Available
                  </h4>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-gray-700 font-medium">
                      {product.stock} units
                    </span>
                  </div>
                </div>

                {/* <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-sm hover:shadow-md transition-all duration-300">
                <h4 className="font-semibold text-gray-900 mb-2">Max Order</h4>
                <span className="text-gray-700 font-medium">
                  {product.max_quantity_to_order} units
                </span>
              </div> */}
              </div>
            )}

            {/* Tags Section */}
            {/* {formattedTags.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Tags</h3>
                <div className="flex flex-wrap gap-3">
                  {formattedTags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 text-blue-800 text-sm font-medium px-4 py-2 rounded-full transition-all duration-300 cursor-pointer transform hover:scale-105 animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )} */}

            {/* Action Buttons */}
            <div className="space-y-4 pt-8">
              <button className="w-full group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl overflow-hidden">
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                <div className="relative flex items-center justify-center space-x-2">
                  <Wallet />
                  <span>Buy Now</span>
                </div>
              </button>

              <button
                onClick={() => {
                  console.log("clicked");
                  dispatch(
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: parseFloat(product.discountPrice),
                      quantity: 1,
                      imageUrl: product.images?.[0] || "",
                    })
                  );
                }}
                className="w-full group bg-white/80 backdrop-blur-sm hover:bg-white border-2 border-gray-200 hover:border-pink-300 text-gray-700 hover:text-pink-600 font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <div className="flex items-center justify-center space-x-2">
                  <ShoppingCart /> <span>Add to cart</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animate-fade-in-left {
          animation: fade-in-left 0.8s ease-out forwards;
        }

        .animate-fade-in-right {
          animation: fade-in-right 0.8s ease-out forwards;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
