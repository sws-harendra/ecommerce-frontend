"use client";
import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/store";
import { createProduct } from "@/app/lib/store/features/productSlice";
import { toast } from "sonner";
import {
  ImagePlus,
  Upload,
  X,
  Package,
  Tag,
  DollarSign,
  Archive,
  TrendingUpIcon,
  IndianRupee,
} from "lucide-react";
import { categoryService } from "@/app/sercices/category.service";
import { fetchArtists } from "@/app/lib/store/features/artistSlice";

interface Category {
  id: number;
  name: string;
}

const AddProducts = () => {
  const dispatch = useAppDispatch();

  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    tags: "",
    originalPrice: "",
    discountPrice: "",
    stock: "",
    trendingProduct: false, // ✅ added
    paymentMethods: "both", // ✅ default
    artistId: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const { artists, status } = useAppSelector((state) => state.artist);

  useEffect(() => {
    if (status === "idle") dispatch(fetchArtists());
  }, [dispatch, status]);

  // ✅ fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAllCategories();
        console.log(res);
        if (res.success) setCategories(res.categories);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const updatedFiles = [...images, ...newFiles];
      setImages(updatedFiles);

      // ✅ revoke old URLs to avoid memory leaks
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      const urls = updatedFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedFiles = images.filter((_, i) => i !== index);
    setImages(updatedFiles);

    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    const urls = updatedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("categoryId", formData.categoryId);
      data.append("tags", JSON.stringify(formData.tags.split(",")));
      data.append("originalPrice", formData.originalPrice);
      data.append("discountPrice", formData.discountPrice);
      data.append("stock", formData.stock);
      data.append("trending_product", String(formData.trendingProduct));
      data.append("artistId", formData.artistId);
      data.append("paymentMethods", formData.paymentMethods);
      images.forEach((file) => data.append("images", file));

      await dispatch(createProduct(data)).unwrap();
      toast.success("✅ Product added successfully!");

      setFormData({
        name: "",
        description: "",
        categoryId: "",
        tags: "",
        originalPrice: "",
        discountPrice: "",
        stock: "",
        trendingProduct: false,
        paymentMethods: "",
      });
      setImages([]);
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setPreviewUrls([]);
    } catch (error: any) {
      toast.error(`❌ Failed: ${error}`);
    }
  };

  return (
    <div className="min-h-screen  py-2 px-1">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        {/* <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4 shadow-lg">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Add New Product
          </h1>
          <p className="text-gray-600 text-lg">
            Create and manage your product inventory
          </p>
        </div> */}

        {/* Main Form Container */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit}>
            {/* Form Content */}
            <div className="p-8 space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Basic Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Product Name */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Name
                    </label>
                    <div className="relative">
                      <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter product name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      placeholder="Describe your product features and benefits"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
                      rows={4}
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        name="tags"
                        placeholder="smartphone, android, mobile"
                        value={formData.tags}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Pricing & Inventory Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-8 bg-gradient-to-b from-emerald-500 to-green-500 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Pricing & Inventory
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Original Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Original Price
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        name="originalPrice"
                        placeholder="0.00"
                        value={formData.originalPrice}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Discount Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sale Price
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
                      <input
                        type="number"
                        name="discountPrice"
                        placeholder="0.00"
                        value={formData.discountPrice}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 bg-emerald-50 hover:bg-white"
                        required
                      />
                    </div>
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stock Quantity
                    </label>
                    <div className="relative">
                      <Archive className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="number"
                        name="stock"
                        placeholder="0"
                        value={formData.stock}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Image Upload Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Product Images
                  </h3>
                </div>

                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 cursor-pointer group">
                  <label className="flex flex-col items-center space-y-4 cursor-pointer">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <ImagePlus className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <span className="text-xl font-medium text-gray-700 group-hover:text-blue-600">
                        Upload Product Images
                      </span>
                      <p className="text-gray-500 mt-1">
                        PNG, JPG, WEBP up to 10MB
                      </p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Image Preview */}
                {previewUrls.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-700">
                      Image Preview ({previewUrls.length})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                      {previewUrls.map((url, idx) => (
                        <div
                          key={idx}
                          className="relative group aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                        >
                          <img
                            src={url}
                            alt={`Preview ${idx + 1}`}
                            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transform hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>{" "}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Trending Product
                  </h3>
                </div>

                <div className="relative">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      name="trendingProduct"
                      checked={formData.trendingProduct}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          trendingProduct: e.target.checked,
                        })
                      }
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Mark as Trending</span>
                  </div>
                </div>
              </div>{" "}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Payment Mode
                  </h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Payment Mode
                  </label>
                  <select
                    name="paymentMethods"
                    value={formData.paymentMethods}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl 
               focus:ring-2 focus:ring-blue-500 focus:border-transparent 
               transition-all duration-200 bg-gray-50 hover:bg-white"
                    required
                  >
                    <option value="cod">Cash on Delivery (COD)</option>
                    <option value="online">Online Payment</option>
                    <option value="both">Both COD & Online</option>
                  </select>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Artist
                  </h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Artist
                  </label>
                  <select
                    name="artistId"
                    value={formData.artistId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl 
               focus:ring-2 focus:ring-blue-500 focus:border-transparent 
               transition-all duration-200 bg-gray-50 hover:bg-white"
                    required
                  >
                    <option value="">Select Artist</option>
                    {artists.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="bg-gray-50 px-8 py-6 border-t border-gray-100">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 px-8 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3"
              >
                <Upload className="w-6 h-6" />
                Add Product to Inventory
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProducts;
