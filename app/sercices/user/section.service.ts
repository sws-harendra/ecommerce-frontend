import axiosInstance from "@/app/utils/axiosinterceptor";

export const sectionService = {
  async getAllSections() {
    const res = await axiosInstance.get("/section");
    return res.data;
  },

  async getSectionById(id: number) {
    const res = await axiosInstance.get(`/section/${id}`);
    return res.data;
  },

  async createSection(data: any) {
    const res = await axiosInstance.post("/section", data, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  },

  async updateSection(id: number, data: any) {
    const res = await axiosInstance.put(`/section/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  },

  async deleteSection(id: number) {
    const res = await axiosInstance.delete(`/section/${id}`, {
      withCredentials: true,
    });
    return res.data;
  },
};
