"use client";
import React, { useState } from "react";
import {
  Home,
  ShoppingBag,
  Package,
  Users,
  BarChart2,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import Link from "next/link";
const menuItems = [
  { name: "Dashboard", icon: Home, href: "/admin/dashboard" },
  { name: "Products", icon: Package, href: "/admin/dashboard/products" },
  { name: "Orders", icon: ShoppingBag, href: "/admin/dashboard/orders" },
  { name: "Customers", icon: Users, href: "/admin/dashboard/customers" },
  //   { name: "Analytics", icon: BarChart2, href: "/admin/dashboard/analytics" },
  { name: "Settings", icon: Settings, href: "/admin/dashboard/settings" },
  { name: "Logout", icon: LogOut, href: "/authentication/login" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`${
          open ? "w-64" : "w-20"
        } bg-gray-900 text-gray-100 h-screen p-4 pt-6 relative duration-300`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setOpen(!open)}
          className="absolute -right-3 top-8 w-7 h-7 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center"
        >
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>

        {/* Logo */}
        <h1
          className={`text-xl font-bold mb-8 text-center duration-300 ${
            !open && "scale-0"
          }`}
        >
          ShopAdmin
        </h1>

        {/* Menu Items */}
        <ul className="space-y-4">
          {menuItems.map((item, idx) => (
            <li key={idx}>
              <Link
                href={item.href}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-800 transition"
              >
                <item.icon size={20} />
                <span
                  className={`${!open && "hidden"} origin-left duration-200`}
                >
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
