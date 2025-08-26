import axiosInstance from "@/app/utils/axiosinterceptor";

export const categoryService = {
  // Place a new order
  getCategory: async () => {
    const response = await axiosInstance.get("/category");
    return response.data;
  },

  // Get all orders for a user
};
