// app/services/user/cart.service.ts
import { serverurl } from "@/app/contants";
import axiosInstance from "@/app/utils/axiosinterceptor";

export const cartService = {
  // Add item to server cart (logged-in users)
  addToCart: async (item: { productId: number; quantity: number }) => {
    const res = await axiosInstance.post(serverurl, item);
    return res.data.cartItem;
  },

  getCart: async () => {
    const res = await axiosInstance.get(serverurl);
    return res.data.cartItems;
  },

  updateCartItem: async (id: number, quantity: number) => {
    const res = await axiosInstance.put(`${serverurl}/${id}`, { quantity });
    return res.data.cartItem;
  },

  removeFromCart: async (id: number) => {
    const res = await axiosInstance.delete(`${serverurl}/${id}`);
    return res.data;
  },
};
