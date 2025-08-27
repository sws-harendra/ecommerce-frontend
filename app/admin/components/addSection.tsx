"use client";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import { fetchProducts } from "@/app/lib/store/features/productSlice";
import { Search, Plus, Trash2 } from "lucide-react";
import { createSection } from "@/app/lib/store/features/sectionSlice";

export default function AddSectionForm() {
  const dispatch = useAppDispatch();
  const { products, status } = useAppSelector((state) => state.product);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("manual");
  const [order, setOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const loading = status == "loading";
  // Fetch products when search changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      dispatch(fetchProducts({ search }));
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [search, dispatch]);

  const toggleProduct = (productId: number) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      createSection({
        title,
        description,
        type,
        order,
        isActive,
        productIds: selectedProducts,
      })
    );
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-4">Add Section</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            className="w-full border p-2 rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            className="w-full border p-2 rounded-lg"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Type */}

        {/* Order */}
        <div>
          <label className="block text-sm font-medium">Order</label>
          <input
            type="number"
            className="w-full border p-2 rounded-lg"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
          />
        </div>

        {/* Active */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          <span className="text-sm">Active</span>
        </div>

        {/* Product Search */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Search Products
          </label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 text-gray-400 h-5 w-5" />
            <input
              type="text"
              className="w-full pl-10 border p-2 rounded-lg"
              placeholder="Search by product name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Product List */}
        <div className="max-h-56 overflow-y-auto border rounded-lg p-2">
          {loading && <p className="text-gray-500">Loading...</p>}
          {!loading &&
            Array.isArray(products?.products) &&
            products.products.length === 0 && (
              <p className="text-gray-500">No products found.</p>
            )}
          {!loading &&
          Array.isArray(products?.products) &&
          products.products.length > 0 ? (
            products.products?.map((product: any) => (
              <div
                key={product.id}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                  selectedProducts.includes(product.id)
                    ? "bg-green-50 border border-green-400"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => toggleProduct(product.id)}
              >
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-xs text-gray-500">
                    ₹{product.discountPrice}
                  </p>
                </div>
                {selectedProducts.includes(product.id) ? (
                  <Trash2 className="text-red-500 h-5 w-5" />
                ) : (
                  <Plus className="text-gray-400 h-5 w-5" />
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">No products found.</p>
          )}
        </div>

        {/* Selected Products */}
        {selectedProducts.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">
              Selected Products ({selectedProducts.length})
            </h4>
            <ul className="flex flex-wrap gap-2">
              {selectedProducts.map((id) => {
                const product = products.products.find((p: any) => p.id === id);
                return (
                  <li
                    key={id}
                    className="bg-blue-100 px-3 py-1 rounded-full text-sm"
                  >
                    {product?.title || `Product #${id}`}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Save Section
        </button>
      </form>
    </div>
  );
}
