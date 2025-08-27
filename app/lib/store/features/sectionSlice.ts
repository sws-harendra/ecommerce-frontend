import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { sectionService } from "@/app/sercices/user/section.service";

// Types
export interface Section {
  id: number;
  title: string;
  description?: string;
  type: "manual" | "auto";
  isActive: boolean;
  order: number;
  products?: any[];
}

interface SectionState {
  sections: Section[];
  currentSection: Section | null;
  loading: boolean;
  error: string | null;
}

const initialState: SectionState = {
  sections: [],
  currentSection: null,
  loading: false,
  error: null,
};

// Thunks
export const fetchSections = createAsyncThunk(
  "sections/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await sectionService.getAllSections();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchSectionById = createAsyncThunk(
  "sections/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      return await sectionService.getSectionById(id);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const createSection = createAsyncThunk(
  "sections/create",
  async (data: any, { rejectWithValue }) => {
    try {
      return await sectionService.createSection(data);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateSection = createAsyncThunk(
  "sections/update",
  async ({ id, data }: { id: number; data: any }, { rejectWithValue }) => {
    try {
      return await sectionService.updateSection(id, data);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteSection = createAsyncThunk(
  "sections/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      return await sectionService.deleteSection(id);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const sectionSlice = createSlice({
  name: "sections",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchSections
      .addCase(fetchSections.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSections.fulfilled, (state, action) => {
        state.loading = false;
        state.sections = action.payload.sections || [];
      })
      .addCase(fetchSections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // createSection
      .addCase(createSection.fulfilled, (state, action) => {
        state.sections.push(action.payload.section);
      })
      // updateSection
      .addCase(updateSection.fulfilled, (state, action) => {
        const index = state.sections.findIndex(
          (s) => s.id === action.payload.section.id
        );
        if (index >= 0) {
          state.sections[index] = action.payload.section;
        }
      })
      // deleteSection
      .addCase(deleteSection.fulfilled, (state, action) => {
        state.sections = state.sections.filter((s) => s.id !== action.meta.arg);
      });
  },
});

export default sectionSlice.reducer;
