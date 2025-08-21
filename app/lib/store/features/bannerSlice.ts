import { bannerService } from "@/app/sercices/user/banner.service";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface Banner {
  id: number;
  categoryId: number;
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
  ctaText: string;
  Category?: {
    id: number;
    name: string;
    description: string;
  };
}

interface BannerState {
  banners: Banner[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: BannerState = {
  banners: [],
  status: "idle",
  error: null,
};

// ✅ Fetch Banners
export const fetchBanners = createAsyncThunk(
  "banners/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await bannerService.getAllBanners();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const bannerSlice = createSlice({
  name: "banners",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.banners = action.payload;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});

export default bannerSlice.reducer;
