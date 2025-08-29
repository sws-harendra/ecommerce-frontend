// services/pageService.ts
import axiosInstance from "@/app/utils/axiosinterceptor";

export const pageService = {
  async getAllPages() {
    const res = await axiosInstance.get("/static-pages");
    return res.data;
  },

  async getPageBySlug(slug: string) {
    const res = await axiosInstance.get(`/static-pages/${slug}`);
    return res.data;
  },

  async createOrUpdatePage(data: {
    title: string;
    slug: string;
    content: string;
  }) {
    const res = await axiosInstance.post("/static-pages", data, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  },
};
