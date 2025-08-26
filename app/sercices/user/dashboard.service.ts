import axiosInstance from "@/app/utils/axiosinterceptor";

export const dashboardService = {
  // Place a new order
  getAlldashboardData: async () => {
    const response = await axiosInstance.get("/dashboard/data");
    return response.data;
  },

  // Get all orders for a user

  getOrdersByUser: async () => {
    const response = await axiosInstance.get("/order/my-orders"); // make sure backend route matches
    return response.data;
  },

  getOrderById: async (orderId: string) => {
    const response = await axiosInstance.get(`/order/${orderId}`);
    return response.data;
  },
};
