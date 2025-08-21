import { EmailLoginRequest, RegisterUserRequest } from "@/app/types/auth.types";
import axiosInstance from "@/app/utils/axiosinterceptor";

export const authService = {
  // Email login
  emailLogin: async (credentials: EmailLoginRequest) => {
    const response = await axiosInstance.post("/user/login-user", credentials);
    return response.data;
  },

  // Send OTP to phone
  sendOtpToPhone: async (phoneNumber: string) => {
    const response = await axiosInstance.post("/user/auth/send-otp", {
      phoneNumber,
    });
    return response.data;
  },

  // Verify phone OTP
  verifyPhoneOtp: async (phoneNumber: string, otp: string) => {
    const response = await axiosInstance.post("/user/auth/verify-otp", {
      phoneNumber,
      otp,
    });
    return response.data;
  },

  // Resend OTP
  resendOtp: async (phoneNumber: string) => {
    const response = await axiosInstance.post("/user/auth/resend-otp", {
      phone: phoneNumber,
    });
    return response.data;
  },

  // Get user details
  getUserDetails: async () => {
    const response = await axiosInstance.get("/user/getuser");
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await axiosInstance.post("/user/logout");
    return response.data;
  },

  // Refresh token
  refreshToken: async () => {
    const response = await axiosInstance.post("/user/refreshtoken");
    return response.data;
  },

  registerUser: async (userData: RegisterUserRequest) => {
    const response = await axiosInstance.post("user/create-user", userData);
    return response.data;
  },
};
