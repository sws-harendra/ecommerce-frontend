import axiosInstance from "@/app/utils/axiosinterceptor";

export const orderService = {
  // Place a new order
  placeOrder: async (orderData: {
    userId: string;
    addressId: number;
    items: { productId: number; quantity: number }[];
    paymentMethod: string;
    paymentProvider?: string;
    transactionId?: string;
  }) => {
    const response = await axiosInstance.post("/order/place", orderData);
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

  getAllOrders: async (queryParams?: string) => {
    const url = queryParams ? `/order${queryParams}` : "/order";
    const response = await axiosInstance.get(url);
    return response.data;
  },
  updateOrder: async (orderId: string, orderData: any) => {
    const response = await axiosInstance.put(`/order/${orderId}`, orderData);
    return response.data;
  },
  deleteOrder: async (orderId: string) => {
    const response = await axiosInstance.delete(`/order/${orderId}`);
    return response.data;
  },
};
