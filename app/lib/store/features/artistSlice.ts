import { artistService } from "@/app/sercices/user/artist.service";
import { Artist } from "@/app/types/artist.types";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
interface ArtistState {
  artists: Artist[];
  selectedArtist: Artist | null;
  products: any[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: ArtistState = {
  artists: [],
  selectedArtist: null,
  products: [],
  pagination: null,
  status: "idle",
  error: null,
};

// Fetch all artists
export const fetchArtists = createAsyncThunk(
  "artists/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await artistService.getAllArtists();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);
export const fetchArtistById = createAsyncThunk(
  "artists/fetchById",
  async (
    { id, page, limit }: { id: number; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      return await artistService.getArtistById(id, page, limit);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Create artist
export const createArtist = createAsyncThunk(
  "artists/create",
  async (data: FormData, { rejectWithValue }) => {
    try {
      return await artistService.createArtist(data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Update artist
export const updateArtist = createAsyncThunk(
  "artists/update",
  async ({ id, data }: { id: number; data: FormData }, { rejectWithValue }) => {
    try {
      return await artistService.updateArtist(id, data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// Delete artist
export const deleteArtist = createAsyncThunk(
  "artists/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      return await artistService.deleteArtist(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const artistSlice = createSlice({
  name: "artists",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArtists.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchArtists.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.artists = action.payload;
      })
      .addCase(fetchArtists.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      .addCase(fetchArtistById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchArtistById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedArtist = action.payload.artist;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchArtistById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      .addCase(createArtist.fulfilled, (state, action) => {
        state.artists.push(action.payload);
      })
      .addCase(updateArtist.fulfilled, (state, action) => {
        const idx = state.artists.findIndex((a) => a.id === action.payload.id);
        if (idx !== -1) state.artists[idx] = action.payload;
      })
      .addCase(deleteArtist.fulfilled, (state, action) => {
        state.artists = state.artists.filter((a) => a.id !== action.meta.arg);
      });
  },
});

export default artistSlice.reducer;
