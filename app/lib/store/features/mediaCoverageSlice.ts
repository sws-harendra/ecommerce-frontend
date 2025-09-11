import { mediaCoverageService } from "@/app/sercices/user/mediaCoverage.service";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface MediaCoverage {
  id: number;
  title: string;
  imageUrl: string;
  url: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface MediaCoverageState {
  coverages: MediaCoverage[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  currentCoverage: MediaCoverage | null;
}

const initialState: MediaCoverageState = {
  coverages: [],
  status: "idle",
  error: null,
  currentCoverage: null,
};

// Fetch all media coverages
export const fetchMediaCoverages = createAsyncThunk(
  "mediaCoverages/fetchAll",
  async (isActive?: boolean, { rejectWithValue }) => {
    try {
      return await mediaCoverageService.getAllMediaCoverages(isActive);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Create new media coverage
export const createMediaCoverage = createAsyncThunk(
  "mediaCoverages/create",
  async (data: FormData, { rejectWithValue }) => {
    try {
      return await mediaCoverageService.createMediaCoverage(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Failed to create media coverage");
    }
  }
);

// Update media coverage
export const updateMediaCoverage = createAsyncThunk(
  "mediaCoverages/update",
  async (
    payload: {
      id: number;
      formData: { title?: string; url?: string; image?: File };
    },
    { rejectWithValue }
  ) => {
    try {
      return await mediaCoverageService.updateMediaCoverage(
        payload.id,
        payload.formData
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Failed to update media coverage");
    }
  }
);

// Delete media coverage
export const deleteMediaCoverage = createAsyncThunk(
  "mediaCoverages/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await mediaCoverageService.deleteMediaCoverage(id);
      return id;
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Failed to delete media coverage");
    }
  }
);

// Toggle media coverage status
export const toggleMediaCoverageStatus = createAsyncThunk(
  "mediaCoverages/toggleStatus",
  async (id: number, { rejectWithValue }) => {
    try {
      return await mediaCoverageService.toggleMediaCoverageStatus(id);
    } catch (err: unknown) {
      if (err instanceof Error) {
        return rejectWithValue(err.message);
      }
      return rejectWithValue("Failed to toggle media coverage status");
    }
  }
);

const mediaCoverageSlice = createSlice({
  name: "mediaCoverages",
  initialState,
  reducers: {
    setCurrentCoverage: (state, action) => {
      state.currentCoverage = action.payload;
    },
    clearCurrentCoverage: (state) => {
      state.currentCoverage = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all
    builder.addCase(fetchMediaCoverages.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchMediaCoverages.fulfilled, (state, action) => {
      state.status = "succeeded";
      console.log(action.payload);
      // Ensure payload is always an array
      state.coverages = action.payload.data;
    });
    builder.addCase(fetchMediaCoverages.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    // Create
    builder.addCase(createMediaCoverage.fulfilled, (state, action) => {
      state.coverages.push(action.payload);
    });

    // Update
    builder.addCase(updateMediaCoverage.fulfilled, (state, action) => {
      const index = state.coverages.findIndex(
        (c) => c.id === action.payload.id
      );
      if (index !== -1) {
        state.coverages[index] = action.payload;
      }
    });

    // Delete
    builder.addCase(deleteMediaCoverage.fulfilled, (state, action) => {
      state.coverages = state.coverages.filter((c) => c.id !== action.payload);
    });

    // Toggle status
    builder.addCase(toggleMediaCoverageStatus.fulfilled, (state, action) => {
      const index = state.coverages.findIndex(
        (c) => c.id === action.payload.id
      );
      if (index !== -1) {
        state.coverages[index] = action.payload;
      }
    });
  },
});

export const { setCurrentCoverage, clearCurrentCoverage } =
  mediaCoverageSlice.actions;
export default mediaCoverageSlice.reducer;
