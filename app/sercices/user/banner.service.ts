import axiosInstance from "@/app/utils/axiosinterceptor";

export const bannerService = {
  getAllBanners: async () => {
    const response = await axiosInstance.get("/banners");
    return response.data;
  },
};
