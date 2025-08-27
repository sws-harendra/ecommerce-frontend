// for admin all user related slice
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "@/app/sercices/user/auth.service";

// ---------- Types ----------
export interface Address {
  id: number;
  addressType: string;
  address1: string;
  address2?: string;
  city: string;
  state?: string;
  country?: string;
  zipCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  fullname: string;
  email: string;
  role: string;
  phoneNumber?: string | null;
  avatar?: string | null;
  createdAt: string;
  updatedAt: string;
  addresses?: Address[];
}

interface UsersState {
  users: User[];
  totalUsers: number;
  totalPages: number;
  currentPage: number;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  selectedUser: User | null;
}

// ---------- Initial State ----------
const initialState: UsersState = {
  users: [],
  totalUsers: 0,
  totalPages: 0,
  currentPage: 1,
  status: "idle",
  error: null,
  selectedUser: null,
};

// ---------- Async Thunks ----------

// Fetch Users
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (
    {
      page = 1,
      limit = 10,
      search = "",
      role = "",
    }: { page?: number; limit?: number; search?: string; role?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await authService.getAllUsers({ page, limit, search, role });
      return res; // {success, users, totalUsers, currentPage, totalPages}
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch users");
    }
  }
);

// Get User By ID
// export const fetchUserById = createAsyncThunk(
//   "users/fetchUserById",
//   async (userId: number, { rejectWithValue }) => {
//     try {
//       const res = await authService.getUserById(userId);
//       return res.user;
//     } catch (err: any) {
//       return rejectWithValue(err.message || "Failed to fetch user details");
//     }
//   }
// );

// Delete User
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId: number, { rejectWithValue }) => {
    try {
      await authService.deleteUser(userId);
      return userId;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to delete user");
    }
  }
);

// Update User
// export const updateUser = createAsyncThunk(
//   "users/updateUser",
//   async (
//     { userId, data }: { userId: number; data: Partial<User> },
//     { rejectWithValue }
//   ) => {
//     try {
//       const res = await authService.updateUser(userId, data);
//       return res.user; // updated user
//     } catch (err: any) {
//       return rejectWithValue(err.message || "Failed to update user");
//     }
//   }
// );

// ---------- Slice ----------
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload.users || [];
        state.totalUsers = action.payload.totalUsers || 0;
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.currentPage || 1;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      })

      // Fetch user by id
      //   .addCase(fetchUserById.fulfilled, (state, action) => {
      //     state.selectedUser = action.payload;
      //   })

      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
        state.totalUsers -= 1;
      });

    // Update user
    //   .addCase(updateUser.fulfilled, (state, action) => {
    //     const idx = state.users.findIndex((u) => u.id === action.payload.id);
    //     if (idx !== -1) {
    //       state.users[idx] = action.payload;
    //     }
    //     if (state.selectedUser?.id === action.payload.id) {
    //       state.selectedUser = action.payload;
    //     }
    //   });
  },
});

export const { clearSelectedUser } = usersSlice.actions;
export default usersSlice.reducer;
