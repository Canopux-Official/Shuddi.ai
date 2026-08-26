import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import { api } from '../super-admin/admin.api';

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

export interface Area {
  id: string;
  name: string;
  code: string;
  createdAt: string;
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
  hasPassword: boolean;
  user: {
    id: string;
    email: string;
    role: 'CITIZEN' | 'ADMIN' | 'SUPER_ADMIN';
  };
  message?: string;
}

export interface PermissionsResponse {
  success: boolean;
  data: {
    role: string;
    permissions: string[];
  };
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

export async function getAreas(): Promise<ApiResponse<Area[]>> {
  try {
    const config: AxiosRequestConfig = {
      method: "get",
      // NOTE: assuming this sits under /api like your other routes.
      // Adjust if `/areas` is actually mounted elsewhere (e.g. no /api prefix).
      url: `${import.meta.env.VITE_SERVER_LINK}/api/ngo/areas`,
    };
    const response = await axios(config);

    if (response.status === 200) {
      return { success: true, data: response.data.data, status: response.status };
    }
    return { success: false, status: response.status };
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    return {
      success: false,
      status: axiosError.response?.status || 500,
      message: axiosError.response?.data?.message || axiosError.message,
    };
  }
}

// Later, when you want to debounce/paginate instead of loading everything up front,
// this is the only function that needs to change — the component below just calls it.

export const getUserPermissions = async (ngoId?: string): Promise<PermissionsResponse> => {
  const params = ngoId ? { ngoId } : {};
  const response = await api.get("/auth/permissions", { params });
  return response.data;
};

// example call from the frontend
// // 1. You get this from your UI state/context when the user selects their NGO
// const currentNgoId = "cuid_12345_example_ngo_id";

// // 2. Call the function
// try {
//   const response = await getUserPermissions(currentNgoId);
//   console.log(response.data.permissions); 
//   // Output: ["CREATE_COMMUNITY_TASK", "REVIEW_SUBMISSIONS", ...]
// } catch (error) {
//   console.error(error);
// }