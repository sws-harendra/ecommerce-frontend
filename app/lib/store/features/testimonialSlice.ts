import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { testimonialService } from "@/app/sercices/user/testimonial.service";

export interface Testimonial {
  id: number;
  name: string;
  designation?: string;
  message: string;
  image?: string;
  isActive: boolean;
  createdAt?: string;
}

interface TestimonialState {
  testimonials: Testimonial[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: TestimonialState = {
  testimonials: [],
  status: "idle",
  error: null,
};

// ✅ Fetch All
export const fetchTestimonials = createAsyncThunk(
  "testimonials/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await testimonialService.getAllTestimonials();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ✅ Create
export const createTestimonial = createAsyncThunk(
  "testimonials/create",
  async (data: FormData, { rejectWithValue }) => {
    try {
      return await testimonialService.createTestimonial(data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// ✅ Update
export const updateTestimonial = createAsyncThunk(
  "testimonials/update",
  async (
    { id, data }: { id: number; data: FormData | Partial<Testimonial> },
    { rejectWithValue }
  ) => {
    try {
      return await testimonialService.updateTestimonial(id, data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

// ✅ Delete
export const deleteTestimonial = createAsyncThunk(
  "testimonials/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      return await testimonialService.deleteTestimonial(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || err.message);
    }
  }
);

const testimonialSlice = createSlice({
  name: "testimonials",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTestimonials.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTestimonials.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.status = "succeeded";
        state.testimonials = action.payload.data; // <-- pick the array
      })
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })
      // Create
      .addCase(createTestimonial.fulfilled, (state, action) => {
        state.testimonials.push(action.payload.data);
      })
      // Update
      .addCase(updateTestimonial.fulfilled, (state, action) => {
        const index = state.testimonials.findIndex(
          (t) => t.id === action.payload.data.id
        );
        if (index !== -1) state.testimonials[index] = action.payload.data;
      })
      // Delete
      .addCase(deleteTestimonial.fulfilled, (state, action) => {
        state.testimonials = state.testimonials.filter(
          (t) => t.id !== action.meta.arg
        );
      });
  },
});

export default testimonialSlice.reducer;
