import { dashboardService } from "@/app/sercices/user/dashboard.service";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface DashboardState {
  dashboardData: any;
  dashboardStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: DashboardState = {
  dashboardData: [],
  dashboardStatus: "idle",
  error: null,
};

// ✅ Fetch dashboard
export const fetchdashboard = createAsyncThunk(
  "dashboard/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardService.getAlldashboardData();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchdashboard.pending, (state) => {
        state.dashboardStatus = "loading";
        state.error = null;
      })
      .addCase(fetchdashboard.fulfilled, (state, action) => {
        state.dashboardStatus = "succeeded";
        state.dashboardData = action.payload.data;
      })
      .addCase(fetchdashboard.rejected, (state, action) => {
        state.dashboardStatus = "failed";
        state.error = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;
