"use client";
import React, { useState } from "react";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  Star,
  Gift,
  Zap,
  Crown,
} from "lucide-react";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "@/app/lib/store/store";
import Link from "next/link";
import { logout } from "@/app/lib/store/features/authSlice";
import { useRouter } from "next/navigation";
import { selectCartItemsCount } from "@/app/lib/store/features/cartSlice";
import { brandName } from "@/app/contants";

export default function EcommerceNavbar() {
  const dispatch = useAppDispatch(); // ✅ typed dispatch
  const { isAuthenticated, user, status } = useAppSelector(
    (state: RootState) => state.auth // ✅ typed state
  );
  const cartCount = useAppSelector(selectCartItemsCount);

  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [wishlistCount] = useState(7);
  const [searchInput, setSearchInput] = useState("");
  const handleSearch = () => {
    if (searchInput.trim() !== "") {
      router.push(`/products?search=${encodeURIComponent(searchInput)}`);
    }
  };

  const categories = [
    { name: "Electronics", icon: Zap, color: "text-blue-500" },
    { name: "Fashion", icon: Crown, color: "text-purple-500" },
    { name: "Home & Garden", icon: Gift, color: "text-green-500" },
    { name: "Sports", icon: Star, color: "text-orange-500" },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm py-2">
        <div className=" mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Zap className="w-4 h-4" />
              <span>Free shipping on orders 5000+</span>
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <span>Help & Support</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className=" mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <Link href="/">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  {brandName}
                </h1>
              </Link>
            </div>

            {/* Desktop Categories */}
            <div className="hidden lg:flex items-center space-x-8">
              {categories.map((category) => (
                <div key={category.name} className="relative group">
                  <button className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 transition-colors duration-200 py-2">
                    <category.icon className={`w-4 h-4 ${category.color}`} />
                    <span className="font-medium">{category.name}</span>
                    <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
                  </button>

                  {/* Dropdown Preview */}
                  <div className="absolute top-full left-0 w-64 bg-white shadow-xl rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 border border-gray-100">
                    <div className="p-4">
                      <p className="text-sm text-gray-500 mb-2">
                        Popular in {category.name}
                      </p>
                      <div className="space-y-2">
                        <a
                          href="#"
                          className="block text-gray-700 hover:text-purple-600 transition-colors"
                        >
                          Trending Items
                        </a>
                        <a
                          href="#"
                          className="block text-gray-700 hover:text-purple-600 transition-colors"
                        >
                          Best Sellers
                        </a>
                        <a
                          href="#"
                          className="block text-gray-700 hover:text-purple-600 transition-colors"
                        >
                          New Arrivals
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8 hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for products, brands, categories..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-200 text-sm font-medium"
              >
                Search
              </button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-6">
            {/* Mobile Search */}
            <button className="md:hidden text-gray-600 hover:text-purple-600 transition-colors">
              <Search className="w-6 h-6" />
            </button>

            {/* Wishlist */}
            {/* <div className="relative hidden sm:block">
              <button className="text-gray-600 hover:text-red-500 transition-colors duration-200 group">
                <Heart className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {wishlistCount}
                  </span>
                )}
              </button>
            </div> */}

            {/* Cart */}
            <div className="relative">
              <Link href={"/cart"}>
                <button className="text-gray-600 hover:text-purple-600 transition-colors duration-200 group">
                  <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                      {cartCount}
                    </span>
                  )}
                </button>
              </Link>
            </div>

            {/* Profile Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden lg:block font-medium">
                    {user?.fullname}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 hidden lg:block transition-transform duration-200 ${
                      isProfileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2">
                    <a
                      href="#"
                      className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                    >
                      My Account
                    </a>
                    <Link
                      href="/orderhistory"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                    >
                      Order History
                    </Link>
                    <a
                      href="#"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                    >
                      Settings
                    </a>
                    <hr className="my-2" />
                    <button
                      onClick={() => dispatch(logout())}
                      className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {" "}
                <Link href="/authentication/login">
                  <button className="px-5 py-2 text-white bg-gradient-to-r from-purple-500 to-blue-500 rounded-full">
                    Login
                  </button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gray-600 hover:text-purple-600 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-6 space-y-4">
            {/* Mobile Search */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>

            {/* Mobile Categories */}
            {categories.map((category) => (
              <a
                key={category.name}
                href="#"
                className="flex items-center space-x-3 py-3 text-gray-700 hover:text-purple-600 transition-colors border-b border-gray-100"
              >
                <category.icon className={`w-5 h-5 ${category.color}`} />
                <span className="font-medium">{category.name}</span>
              </a>
            ))}

            {/* Mobile Wishlist */}
            <a
              href="#"
              className="flex items-center space-x-3 py-3 text-gray-700 hover:text-red-500 transition-colors"
            >
              <Heart className="w-5 h-5" />
              <span>Wishlist ({wishlistCount})</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
