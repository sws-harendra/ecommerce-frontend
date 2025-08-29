"use client";
import { brandName } from "@/app/contants";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl text-center mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-xl font-bold text-white">{brandName}</h2>
          <p className="mt-3 text-sm">
            Your trusted destination for quality products at the best prices.
          </p>
        </div>

        {/* Shop Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Shop</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/products" className="hover:text-white">
                All Products
              </Link>
            </li>
            <li>
              <Link href="/categories" className="hover:text-white">
                Categories
              </Link>
            </li>
            <li>
              <Link href="/offers" className="hover:text-white">
                Offers
              </Link>
            </li>
            <li>
              <Link href="/new-arrivals" className="hover:text-white">
                New Arrivals
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Customer Service
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/refund-policy" className="hover:text-white">
                Refund Policy
              </Link>
            </li>
            <li>
              <Link href="/terms&conditions" className="hover:text-white">
                Terms & Condition
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-white">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 py-4 text-center text-sm">
        <p>
          © {new Date().getFullYear()} {brandName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
