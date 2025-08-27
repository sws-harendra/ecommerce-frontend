import { Banner, updateBanner } from "@/app/lib/store/features/bannerSlice";
import { useAppDispatch } from "@/app/lib/store/store";
import { categoryService } from "@/app/sercices/category.service";
import { Category } from "@/app/types/product.types";
import { getImageUrl } from "@/app/utils/getImageUrl";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const EditBannerForm = ({
  banner,
  onSuccess,
}: {
  banner: Banner;
  onSuccess: () => void;
}) => {
  const dispatch = useAppDispatch();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<Partial<Banner>>({});
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    // Pre-fill form with banner data
    setForm({
      title: banner.title,
      subtitle: banner.subtitle,
      link: banner.link,
      ctaText: banner.ctaText,
      categoryId: banner.categoryId,
    });
  }, [banner]);

  const fetchCategories = async () => {
    try {
      const res = await categoryService.getCategory();
      setCategories(res.categories);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleSave = async () => {
    setLoading(true);
    const fd = new FormData();
    if (file) fd.append("image", file);
    if (form.title) fd.append("title", form.title);
    if (form.subtitle) fd.append("subtitle", form.subtitle);
    if (form.link) fd.append("link", form.link);
    if (form.ctaText) fd.append("ctaText", form.ctaText);
    if (form.categoryId) fd.append("categoryId", String(form.categoryId));

    try {
      await dispatch(updateBanner({ id: banner.id, data: fd })).unwrap();
      toast.success("Banner updated successfully");
      onSuccess();
    } catch (error) {
      toast.error("Failed to update banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Image Preview */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Current Image
        </label>
        <div className="relative">
          <img
            src={`${getImageUrl(banner.imageUrl)}`}
            alt={banner.title}
            className="w-full h-32 object-cover rounded-xl border"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <span className="text-white text-sm">Current Banner Image</span>
          </div>
        </div>
      </div>

      {/* New Image Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Upload New Image (Optional)
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            id="edit-image-upload"
          />
          <label
            htmlFor="edit-image-upload"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Plus className="w-6 h-6 text-gray-400" />
            </div>
            <span className="text-sm text-gray-600">
              {file ? file.name : "Click to upload new image"}
            </span>
          </label>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Title *</label>
        <input
          name="title"
          value={form.title || ""}
          onChange={handleChange}
          placeholder="Enter banner title"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Subtitle */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Subtitle</label>
        <textarea
          name="subtitle"
          value={form.subtitle || ""}
          onChange={handleChange}
          placeholder="Enter banner subtitle"
          rows={3}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
        />
      </div>

      {/* Link */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Link URL</label>
        <input
          name="link"
          value={form.link || ""}
          onChange={handleChange}
          placeholder="https://example.com"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
      </div>

      {/* CTA Text */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          CTA Button Text
        </label>
        <input
          name="ctaText"
          value={form.ctaText || ""}
          onChange={handleChange}
          placeholder="Learn More"
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Category</label>
        <select
          name="categoryId"
          value={form.categoryId?.toString() || ""}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSave}
        disabled={loading || !form.title}
        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-600/25"
      >
        {loading ? "Updating..." : "Update Banner"}
      </button>
    </div>
  );
};

export default EditBannerForm;
