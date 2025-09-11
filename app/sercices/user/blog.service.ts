import axiosInstance from "@/app/utils/axiosinterceptor";

export const blogService = {
  // Get all blog posts
  getAllBlogs: async () => {
    const response = await axiosInstance.get("/admin/blogs");
    return response.data;
  },

  // Get single blog post by ID
  getBlogById: async (id: string) => {
    const response = await axiosInstance.get(`/admin/blogs/${id}`);
    return response.data;
  },

  // Create a new blog post
  createBlog: async (data: FormData) => {
    const response = await axiosInstance.post("/admin/blogs", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Update an existing blog post
  updateBlog: async (id: string, data: FormData) => {
    const response = await axiosInstance.put(`/admin/blogs/${id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // Delete a blog post
  deleteBlog: async (id: string) => {
    const response = await axiosInstance.delete(`/admin/blogs/${id}`, {
      withCredentials: true,
    });
    return response.data;
  },

  // Upload blog image
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post("/upload-media", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};
