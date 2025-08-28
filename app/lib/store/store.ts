// /lib/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import authReducer from "./features/authSlice";
import productReducer from "./features/productSlice";
import bannerReducer from "./features/bannerSlice";
import cartReducer from "./features/cartSlice";
import orderReducer from "./features/orderSlice";
import dashboardReducer from "./features/dashboardSlice";
import userReducer from "./features/userSlice";
import sectionReducer from "./features/sectionSlice";
import categoryReducer from "./features/categorySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    banners: bannerReducer,
    cart: cartReducer,
    order: orderReducer,
    dashboard: dashboardReducer,
    users: userReducer, // all users (admin side)\
    section: sectionReducer,
    category: categoryReducer,
  },
  devTools: process.env.NEXT_PUBLIC_NODE_ENV !== "production", // ✅ disable in prod
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
