// Request DTOs
export interface EmailLoginRequest {
  email: string;
  password: string;
}

export interface SendOtpRequest {
  phoneNumber: string;
}

export interface VerifyOtpRequest {
  phoneNumber: string;
  otp: string;
}

export interface RegisterUserRequest {
  email: string;
  password: string;
  fullname: string;
  file: string;
} // auth.types.ts

export interface AuthState {
  user: User | null; // replace 'any' with proper User type
  isAuthenticated: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null | unknown; // ✅ allow string or null
  loginMethod: "email" | "phone" | "otp";
  phoneNumber: string;
  otpSent: boolean;
  registerStatus?: "idle" | "loading" | "succeeded" | "failed";
  role: "user" | "admin";
}

// Response DTOs
export interface User {
  id: string;
  email: string;
  fullname: string;
  role: "user" | "admin";
  phoneNumber?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface OtpResponse {
  success: boolean;
  message: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}
