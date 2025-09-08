import axiosInstance from "@/app/utils/axiosinterceptor";

export const videoService = {
  getAllVideos: async () => {
    const response = await axiosInstance.get("/videos");
    return response.data;
  },

  getVideoById: async (id: number) => {
    const res = await axiosInstance.get(`/videos/${id}`);
    return res.data;
  },

  createVideo: async (data: FormData) => {
    const res = await axiosInstance.post("/videos", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  updateVideo: async (id: number, data: FormData) => {
    const res = await axiosInstance.put(`/videos/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  deleteVideo: async (id: number) => {
    const res = await axiosInstance.delete(`/videos/${id}`);
    return res.data;
  },
};
