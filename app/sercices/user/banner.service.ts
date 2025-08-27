import axiosInstance from "@/app/utils/axiosinterceptor";

export const bannerService = {
  getAllBanners: async () => {
    const response = await axiosInstance.get("/banners");
    return response.data;
  },
  async getBannerById(id: number) {
    const res = await axiosInstance.get(`/banners/${id}`);
    return res.data;
  },

  async createBanner(data: any) {
    const res = await axiosInstance.post("/banners/create-banner", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  async updateBanner(id: number, data: any) {
    const res = await axiosInstance.put(`/banners/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  async deleteBanner(id: number) {
    const res = await axiosInstance.delete(`/banners/${id}`, {
      withCredentials: true,
    });
    return res.data;
  },
};
