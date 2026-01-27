import axios, { AxiosError, type AxiosRequestConfig } from 'axios';

// --- Type Definitions ---

// Matches req.body of registerController
export interface RegisterPayload {
  email: string;
  pass: string; // Backend expects 'pass' in service, but controller extracts 'password'. 
                // CHECK: controller uses { email, password }. Service uses (email, pass).
                // We send { email, password } to match Controller.
  password: string; 
}

// Matches req.body of loginController
export interface LoginPayload {
  email: string;
  password: string;
}

// Matches req.body of verifyOtpController
export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

// Matches req.body of googleAuthController
export interface GoogleAuthPayload {
  idToken: string;
}

// Matches req.body of resendOtpController
export interface ResendOtpPayload {
  email: string;
}

// Matches req.body of onboardController
export interface OnboardingPayload {
  username: string;
  country: string;
  state: string;
  city: string;
}

// Generic Response wrapper
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  status?: number;
  message?: string;
  error?: unknown;
}

// Specific Data Responses based on your Backend Return types
interface AuthResponseData {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
  isOnboarded?: boolean; // Present in Login/Google response
  message: string;
}

// --- Helper Functions ---

function getAuthHeaders() {
  const token = window.localStorage.getItem("authToken");
  return {
    Authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json'
  };
}

// --- API Functions ---

// 1. Register User
export async function registerUser(payload: RegisterPayload): Promise<ApiResponse> {
  try {
    const config: AxiosRequestConfig = {
      method: "post",
      // Assuming gateway mounts authRoutes at /auth
      url: `${import.meta.env.VITE_SERVER_LINK}/api/auth/register`,
      data: payload,
      headers: { 'Content-Type': 'application/json' }
    };

    const response = await axios(config);

    if (response.status === 201 || response.status === 200) {
      return {
        success: true,
        data: response.data,
        status: response.status,
        message: response.data.message
      };
    }
    return { success: false, status: response.status, message: "Registration failed" };

  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    const msg = axiosError.response?.data?.message || axiosError.message;
    return {
      success: false,
      status: axiosError.response?.status || 500,
      message: msg
    };
  }
}

// 2. Login User
export async function loginUser(payload: LoginPayload): Promise<ApiResponse<AuthResponseData>> {
  try {
    const config: AxiosRequestConfig = {
      method: "post",
      url: `${import.meta.env.VITE_SERVER_LINK}/api/auth/login`,
      data: payload,
      headers: { 'Content-Type': 'application/json' }
    };

    const response = await axios(config);

    if (response.status === 200) {
      // Store Token
      if (response.data.token) {
        window.localStorage.setItem("authToken", response.data.token);
      }
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    }
    return { success: false, status: response.status };

  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    const msg = axiosError.response?.data?.message || axiosError.message;
    return {
      success: false,
      status: axiosError.response?.status || 500,
      message: msg
    };
  }
}

// 3. Verify OTP
export async function verifyOtp(payload: VerifyOtpPayload): Promise<ApiResponse<AuthResponseData>> {
  try {
    const config: AxiosRequestConfig = {
      method: "post",
      url: `${import.meta.env.VITE_SERVER_LINK}/api/auth/verify-otp`,
      data: payload,
      headers: { 'Content-Type': 'application/json' }
    };

    const response = await axios(config);

    if (response.status === 200) {
      if (response.data.token) {
        window.localStorage.setItem("authToken", response.data.token);
      }
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    }
    return { success: false, status: response.status };

  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    const msg = axiosError.response?.data?.message || axiosError.message;
    return {
      success: false,
      status: axiosError.response?.status || 500,
      message: msg
    };
  }
}

// 4. Resend OTP
export async function resendOtp(payload: ResendOtpPayload): Promise<ApiResponse> {
  try {
    const config: AxiosRequestConfig = {
      method: "post",
      url: `${import.meta.env.VITE_SERVER_LINK}/api/auth/resend-otp`,
      data: payload,
      headers: { 'Content-Type': 'application/json' }
    };

    const response = await axios(config);

    if (response.status === 200) {
      return {
        success: true,
        message: response.data.message,
        status: response.status
      };
    }
    return { success: false, status: response.status };

  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    const msg = axiosError.response?.data?.message || axiosError.message;
    return {
      success: false,
      status: axiosError.response?.status || 500,
      message: msg
    };
  }
}

// 5. Onboard User (Protected Route)
export async function onboardUser(payload: OnboardingPayload): Promise<ApiResponse> {
  try {
    const config: AxiosRequestConfig = {
      method: "post",
      url: `${import.meta.env.VITE_SERVER_LINK}/api/auth/onboard`,
      data: payload,
      headers: getAuthHeaders() // Needs Bearer token
    };

    const response = await axios(config);

    if (response.status === 200) {
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    }
    return { success: false, status: response.status };

  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    const msg = axiosError.response?.data?.message || axiosError.message;
    return {
      success: false,
      status: axiosError.response?.status || 500,
      message: msg
    };
  }
}

// 6. Google Auth
export async function googleAuth(payload: GoogleAuthPayload): Promise<ApiResponse<AuthResponseData>> {
  try {
    const config: AxiosRequestConfig = {
      method: "post",
      url: `${import.meta.env.VITE_SERVER_LINK}/api/auth/google`,
      data: payload,
      headers: { 'Content-Type': 'application/json' }
    };

    const response = await axios(config);

    if (response.status === 200) {
      if (response.data.token) {
        window.localStorage.setItem("authToken", response.data.token);
      }
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    }
    return { success: false, status: response.status };

  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    const msg = axiosError.response?.data?.message || axiosError.message;
    return {
      success: false,
      status: axiosError.response?.status || 500,
      message: msg
    };
  }
}