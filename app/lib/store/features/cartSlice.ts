// app/lib/store/features/cartSlice.ts
import { cartService } from "@/app/sercices/user/cart.service";
import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { toast } from "sonner";

export interface CartItem {
  id: number; // product id
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  paymentMethods: string;
}

interface CartState {
  items: CartItem[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const localCart =
  typeof window !== "undefined" ? localStorage.getItem("cart") : null;

const initialState: CartState = {
  items: localCart ? JSON.parse(localCart) : [],
  status: "idle",
  error: null,
};

// Sync cart from server (optional)
export const fetchServerCart = createAsyncThunk(
  "cart/fetchServerCart",
  async (_, { rejectWithValue }) => {
    try {
      return await cartService.getCart();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        existing.quantity += action.payload.quantity;
        toast.success(`${action.payload.name} added in cart!`);
      } else {
        state.items.push(action.payload);
        toast.success(`${action.payload.name} added in cart!`);
      }
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((i) => i.id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) item.quantity = action.payload.quantity;
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cart");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServerCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchServerCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        localStorage.setItem("cart", JSON.stringify(state.items));
      })
      .addCase(fetchServerCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload as string;
      });
  },
});
export const selectCartItemsCount = (state: RootState) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export const selectCart = (state: RootState) => state.cart;
export default cartSlice.reducer;
