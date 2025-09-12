import axiosInstance from "@/app/utils/axiosinterceptor";

export const testimonialService = {
  getAllTestimonials: async () => {
    const res = await axiosInstance.get("/testimonials");
    return res.data;
  },

  async createTestimonial(data: FormData) {
    const res = await axiosInstance.post("/testimonials/create", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  async updateTestimonial(id: number, data: FormData | any) {
    const res = await axiosInstance.put(`/testimonials/update/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  async deleteTestimonial(id: number) {
    const res = await axiosInstance.delete(`/testimonials/delete/${id}`, {
      withCredentials: true,
    });
    return res.data;
  },
};
