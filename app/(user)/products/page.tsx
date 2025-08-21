"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import { fetchProducts, Product } from "@/app/lib/store/features/productSlice";
import { toast } from "sonner";
import {
  Search,
  Filter,
  Star,
  Heart,
  ShoppingCart,
  Grid,
  List,
  ChevronDown,
  X,
} from "lucide-react";

// Product Card Component
const ProductCard = ({ product, viewMode }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Calculate discount percentage
  const originalPrice = parseFloat(product.originalPrice);
  const discountPrice = parseFloat(product.discountPrice);
  const discountPercent = Math.round(
    ((originalPrice - discountPrice) / originalPrice) * 100
  );

  // Get first image from images array
  const productImage =
    product.images && product.images.length > 0
      ? `${
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        }/uploads/${product.images[0]}`
      : `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center`;

  return (
    <div
      className={`group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-gray-200 ${
        viewMode === "list" ? "flex items-center p-4" : "flex flex-col"
      }`}
    >
      {/* Discount Badge */}
      {discountPercent > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          -{discountPercent}%
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={() => setIsLiked(!isLiked)}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-lg hover:scale-110"
      >
        <Heart
          className={`w-4 h-4 transition-colors duration-300 ${
            isLiked
              ? "fill-red-500 text-red-500"
              : "text-gray-400 hover:text-red-400"
          }`}
        />
      </button>

      {/* Stock Badge */}
      {product.stock <= 5 && product.stock > 0 && (
        <div className="absolute top-12 left-3 z-10 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          Only {product.stock} left!
        </div>
      )}

      {product.sold_out === 1 && (
        <div className="absolute top-12 left-3 z-10 bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          Sold Out
        </div>
      )}

      {/* Product Image */}
      <div
        className={`relative overflow-hidden ${
          viewMode === "list"
            ? "w-32 h-32 rounded-xl mr-4 flex-shrink-0"
            : "aspect-square w-full"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-gray-100 to-gray-50 animate-pulse" />
        <img
          src={productImage}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.src = `https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&crop=center`;
          }}
        />

        {/* Quick Actions on Hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <button
              className={`p-3 bg-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 ${
                product.sold_out === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={product.sold_out === 1}
            >
              <ShoppingCart className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className={`${viewMode === "list" ? "flex-1" : "p-4"}`}>
        {/* Category Badge & Stock Info */}
        <div className="flex items-center justify-between mb-2">
          <span className="inline-block px-2 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full capitalize">
            {product.Category?.name || "General"}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-gray-700">4.5</span>
          </div>
        </div>

        {/* Product Name */}
        <h3
          className={`font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 capitalize ${
            viewMode === "list" ? "text-lg" : "text-base"
          }`}
        >
          {product.name}
        </h3>

        {/* Description */}
        <p
          className={`text-gray-600 mb-3 ${
            viewMode === "list"
              ? "line-clamp-2 text-sm"
              : "line-clamp-3 text-sm"
          }`}
        >
          {product.description}
        </p>

        {/* Price & Actions */}
        <div
          className={`flex items-center ${
            viewMode === "list" ? "justify-between" : "justify-between"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">
              ₹{discountPrice.toLocaleString()}
            </span>
            {originalPrice !== discountPrice && (
              <span className="text-sm text-gray-500 line-through">
                ₹{originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <button
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 hover:shadow-lg transform hover:scale-105 active:scale-95 ${
              product.sold_out === 1
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            disabled={product.sold_out === 1}
          >
            {product.sold_out === 1 ? "Sold Out" : "Add to Cart"}
          </button>
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {product.tags.slice(0, 2).map((tag, index) => {
              // Clean up the tag string (remove quotes and brackets)
              const cleanTag = tag.replace(/[\[\]"]/g, "");
              return (
                <span
                  key={index}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                >
                  {cleanTag}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Filter Sidebar Component
const FilterSidebar = ({
  isOpen,
  onClose,
  category,
  setCategory,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  rating,
  setRating,
}) => {
  const categories = [
    "All",
    "Electronics",
    "Fashion",
    "Books",
    "Home & Garden",
    "Sports",
    "Beauty",
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:sticky top-0 left-0 h-screen lg:h-auto w-80 bg-white z-50 transform transition-transform duration-300 overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 border-r border-gray-100">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <button
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Category</h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <label
                  key={cat}
                  className="flex items-center cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat === "All" ? "" : cat.toLowerCase()}
                    checked={
                      category === (cat === "All" ? "" : cat.toLowerCase())
                    }
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-gray-700 group-hover:text-blue-600 transition-colors">
                    {cat}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">
              Price Range (₹)
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Min Price
                </label>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="1000"
                  value={priceRange[0]}
                  onChange={(e) =>
                    setPriceRange([parseInt(e.target.value), priceRange[1]])
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-sm font-medium text-gray-900">
                  ₹{priceRange[0].toLocaleString()}
                </span>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Max Price
                </label>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="1000"
                  value={priceRange[1]}
                  onChange={(e) =>
                    setPriceRange([priceRange[0], parseInt(e.target.value)])
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-sm font-medium text-gray-900">
                  ₹{priceRange[1].toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Stock Filter */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Availability</h3>
            <div className="space-y-2">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 rounded"
                />
                <span className="ml-3 text-gray-700 group-hover:text-blue-600 transition-colors">
                  In Stock
                </span>
              </label>
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 rounded"
                />
                <span className="ml-3 text-gray-700 group-hover:text-blue-600 transition-colors">
                  On Sale
                </span>
              </label>
            </div>
          </div>

          {/* Rating Filter */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Minimum Rating</h3>
            <div className="space-y-2">
              {[4, 3, 2, 1].map((stars) => (
                <label
                  key={stars}
                  className="flex items-center cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="rating"
                    value={stars}
                    checked={rating === stars}
                    onChange={(e) => setRating(parseInt(e.target.value))}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <div className="ml-3 flex items-center">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < stars
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-gray-700 group-hover:text-blue-600 transition-colors">
                      & up
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Sort By</h3>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
              <option value="discount">Highest Discount</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export default function AllProducts() {
  const dispatch = useAppDispatch();
  const { products, status, error } = useAppSelector((state) => state.product);
  const isLoading = status === "loading";

  // State
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState("");
  const [rating, setRating] = useState(0);
  const [viewMode, setViewMode] = useState("grid");
  const [filterOpen, setFilterOpen] = useState(false);

  // Effects
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    const params: any = {
      page,
      limit,
      search,
    };

    if (category) {
      // Assuming you'll add categoryId mapping based on category name
      const categoryMap: { [key: string]: number } = {
        electronics: 1,
        fashion: 2,
        books: 3,
        // Add more category mappings as per your backend
      };
      params.categoryId = categoryMap[category];
    }

    if (priceRange[0] > 0) params.minPrice = priceRange[0];
    if (priceRange[1] < 100000) params.maxPrice = priceRange[1];

    dispatch(fetchProducts(params));
  }, [dispatch, page, limit, search, category, priceRange]);

  const handleSearch = (searchTerm: string) => {
    setPage(1);
    const params: any = {
      page: 1,
      limit,
      search: searchTerm,
    };

    if (category) {
      const categoryMap: { [key: string]: number } = {
        electronics: 1,
        fashion: 2,
        books: 3,
      };
      params.categoryId = categoryMap[category];
    }

    if (priceRange[0] > 0) params.minPrice = priceRange[0];
    if (priceRange[1] < 100000) params.maxPrice = priceRange[1];

    dispatch(fetchProducts(params));
  };

  // Filter and sort products locally (since backend might not support all filters yet)
  const filteredProducts = products?.products
    ? [...products.products]
        .filter((product) => {
          // Price filter
          const discountPrice = parseFloat(product.discountPrice);
          if (discountPrice < priceRange[0] || discountPrice > priceRange[1])
            return false;

          return true;
        })
        .sort((a, b) => {
          const priceA = parseFloat(a.discountPrice);
          const priceB = parseFloat(b.discountPrice);
          const originalPriceA = parseFloat(a.originalPrice);
          const originalPriceB = parseFloat(b.originalPrice);

          switch (sortBy) {
            case "price-low":
              return priceA - priceB;
            case "price-high":
              return priceB - priceA;
            case "newest":
              return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
              );
            case "discount":
              const discountA =
                ((originalPriceA - priceA) / originalPriceA) * 100;
              const discountB =
                ((originalPriceB - priceB) / originalPriceB) * 100;
              return discountB - discountA;
            default:
              return 0;
          }
        })
    : [];

  const totalProducts = products?.totalItems || 0;
  const totalPages = products?.totalPages || 1;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
              <p className="text-gray-600 mt-1">
                Discover our amazing collection of products
              </p>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSearch(search);
                    }
                  }}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar
            isOpen={filterOpen}
            onClose={() => setFilterOpen(false)}
            category={category}
            setCategory={setCategory}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            sortBy={sortBy}
            setSortBy={setSortBy}
            rating={rating}
            setRating={setRating}
          />

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-xl shadow-sm">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>

                <div className="text-sm text-gray-600">
                  {totalProducts} products found
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-white shadow-sm text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Products Grid/List */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading amazing products...</p>
                </div>
              </div>
            ) : (
              <div
                className={`${
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }`}
              >
                {filteredProducts.map((product: Product, index) => (
                  <div
                    key={product.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <ProductCard product={product} viewMode={viewMode} />
                  </div>
                ))}
              </div>
            )}

            {/* No Products Found */}
            {!isLoading && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                  <Search className="w-full h-full" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setCategory("");
                    setPriceRange([0, 100000]);
                    setRating(0);
                    setSortBy("");
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2 p-2 bg-white rounded-xl shadow-sm">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                        page === i + 1
                          ? "bg-blue-600 text-white shadow-md"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}
