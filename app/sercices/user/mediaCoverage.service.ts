import axiosInstance from "@/app/utils/axiosinterceptor";

export const mediaCoverageService = {
  // Get all media coverages
  getAllMediaCoverages: async (isActive?: boolean) => {
    try {
      const params =
        isActive !== undefined ? { isActive: String(isActive) } : {};
      const response = await axiosInstance.get("/media-coverage", { params });
      // Ensure we always return an array

      return response.data;
    } catch (error) {
      console.error("Error fetching media coverages:", error);
      return [];
    }
  },

  // Get single media coverage by ID
  getMediaCoverageById: async (id: number) => {
    const response = await axiosInstance.get(`/media-coverage/${id}`);
    return response.data;
  },

  // Create new media coverage
  createMediaCoverage: async (data: any) => {
    const response = await axiosInstance.post("/media-coverage", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Update media coverage
  updateMediaCoverage: async (
    id: number,
    formData: { title?: string; url?: string; image?: File }
  ) => {
    const data = new FormData();
    if (formData.title) data.append("title", formData.title);
    if (formData.url) data.append("url", formData.url);
    if (formData.image) data.append("image", formData.image);

    const response = await axiosInstance.put(`/media-coverage/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Delete media coverage
  deleteMediaCoverage: async (id: number) => {
    const response = await axiosInstance.delete(`/media-coverage/${id}`);
    return response.data;
  },

  // Toggle media coverage status
  toggleMediaCoverageStatus: async (id: number) => {
    const response = await axiosInstance.patch(
      `/media-coverage/${id}/toggle-status`
    );
    return response.data;
  },
};
