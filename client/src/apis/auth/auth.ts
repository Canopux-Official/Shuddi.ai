import axios, { AxiosError, type AxiosRequestConfig } from 'axios';

// --- Type Definitions ---

// Updated to match Backend Controller expectation
export interface RegisterPayload {
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface GoogleAuthPayload {
  idToken: string;
}

export interface ResendOtpPayload {
  email: string;
}

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

// Updated to match the backend Auth Service return shape
interface AuthResponseData {
  token: string;
  isOnboarded: boolean;
  user: {
    id: string;
    email: string;
    role: 'CITIZEN' | 'ADMIN';
  };
  message?: string;
}

// 1. Login
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
      // Store token immediately if successful
      if (response.data.token) {
        window.localStorage.setItem("authToken", response.data.token);
      }
      return {
        success: true,
        data: response.data, // This now includes isOnboarded
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

// 2. Register
export async function registerUser(payload: RegisterPayload): Promise<ApiResponse<{ message: string }>> {
  try {
    const config: AxiosRequestConfig = {
      method: "post",
      url: `${import.meta.env.VITE_SERVER_LINK}/api/auth/register`,
      data: payload,
      headers: { 'Content-Type': 'application/json' }
    };

    const response = await axios(config);

    if (response.status === 201 || response.status === 200) {
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

// 4. Onboard User
export async function onboardUser(payload: OnboardingPayload): Promise<ApiResponse<{ message: string }>> {
  const token = window.localStorage.getItem("authToken");
  try {
    const config: AxiosRequestConfig = {
      method: "post",
      url: `${import.meta.env.VITE_SERVER_LINK}/api/auth/onboard`,
      data: payload,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      }
    };

    const response = await axios(config);

    if (response.status === 200 || response.status === 201) {
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

// 5. Resend OTP
export async function resendOtp(payload: ResendOtpPayload): Promise<ApiResponse<{ message: string }>> {
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