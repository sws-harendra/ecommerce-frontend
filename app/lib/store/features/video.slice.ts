import { videoService } from "@/app/sercices/user/video.servvice";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface Video {
  id: number;
  videoUrl: string;
  productId: number;
  Product?: {
    id: number;
    name: string;
  };
}

interface VideoState {
  videos: Video[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: VideoState = {
  videos: [],
  status: "idle",
  error: null,
};

// ✅ Fetch
export const fetchVideos = createAsyncThunk(
  "videos/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await videoService.getAllVideos();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ✅ Create
export const createVideo = createAsyncThunk(
  "videos/create",
  async (data: FormData, { rejectWithValue }) => {
    try {
      return await videoService.createVideo(data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// ✅ Update
export const updateVideo = createAsyncThunk(
  "videos/update",
  async ({ id, data }: { id: number; data: FormData }, { rejectWithValue }) => {
    try {
      return await videoService.updateVideo(id, data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// ✅ Delete
export const deleteVideo = createAsyncThunk(
  "videos/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      return await videoService.deleteVideo(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const videoSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideos.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchVideos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.videos = action.payload;
      })
      .addCase(fetchVideos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(createVideo.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createVideo.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.videos.push(action.payload);
      })
      .addCase(createVideo.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(updateVideo.fulfilled, (state, action) => {
        const idx = state.videos.findIndex((v) => v.id === action.payload.id);
        if (idx !== -1) state.videos[idx] = action.payload;
      })
      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.videos = state.videos.filter((v) => v.id !== action.meta.arg);
      });
  },
});

export default videoSlice.reducer;
