import { Artist } from "@/app/types/artist.types";
import axiosInstance from "@/app/utils/axiosinterceptor";

export const artistService = {
  getAllArtists: async (): Promise<Artist[]> => {
    const res = await axiosInstance.get("/artist");
    return res.data;
  },
  getArtistById: async (id: number, page = 1, limit = 10) => {
    const res = await axiosInstance.get(`/artist/${id}`, {
      params: { page, limit },
    });
    return res.data; // { artist, products, pagination }
  },

  createArtist: async (data: FormData): Promise<Artist> => {
    const res = await axiosInstance.post("/artist", data);
    return res.data;
  },

  updateArtist: async (id: number, data: FormData): Promise<Artist> => {
    const res = await axiosInstance.put(`/artist/${id}`, data);
    return res.data;
  },

  deleteArtist: async (id: number): Promise<{ message: string }> => {
    const res = await axiosInstance.delete(`/artist/${id}`);
    return res.data;
  },
};
