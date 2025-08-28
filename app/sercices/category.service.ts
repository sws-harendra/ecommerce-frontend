import axiosInstance from "@/app/utils/axiosinterceptor";

export const categoryService = {
  // Get all categories
  getAllCategories: async () => {
    const response = await axiosInstance.get("/category");
    return response.data;
  },

  // Get category by ID
  getCategoryById: async (id: number) => {
    const response = await axiosInstance.get(`/category/${id}`);
    return response.data;
  },

  // Create category
  createCategory: async (data: { name: string; description: string }) => {
    const response = await axiosInstance.post("/category", data);
    return response.data;
  },

  // Update category
  updateCategory: async (
    id: number,
    data: { name: string; description: string }
  ) => {
    const response = await axiosInstance.put(`/category/${id}`, data);
    return response.data;
  },

  // Delete category
  deleteCategory: async (id: number) => {
    const response = await axiosInstance.delete(`/category/${id}`);
    return response.data;
  },
};
