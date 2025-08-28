import { categoryService } from "@/app/sercices/category.service";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface Category {
  id: number;
  name: string;
  description?: string;
}

interface CategoryState {
  categories: Category[];
  currentCategory: Category | null;
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  currentCategory: null,
  loading: false,
  error: null,
};

// Thunks
export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await categoryService.getAllCategories();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchCategoryById = createAsyncThunk(
  "categories/fetchById",
  async (id: number, { rejectWithValue }) => {
    try {
      return await categoryService.getCategoryById(id);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const createCategory = createAsyncThunk(
  "categories/create",
  async (data: any, { rejectWithValue }) => {
    try {
      return await categoryService.createCategory(data);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "categories/update",
  async ({ id, data }: { id: number; data: any }, { rejectWithValue }) => {
    try {
      return await categoryService.updateCategory(id, data);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      return await categoryService.deleteCategory(id);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchCategories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories || [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // createCategory
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload.category);
      })
      // updateCategory
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (c) => c.id === action.payload.category.id
        );
        if (index >= 0) {
          state.categories[index] = action.payload.category;
        }
      })
      // deleteCategory
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (c) => c.id !== action.meta.arg
        );
      });
  },
});

export default categorySlice.reducer;
