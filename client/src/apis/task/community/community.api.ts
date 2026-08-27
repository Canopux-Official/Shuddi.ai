import axios from "axios";
import { type CommunityTaskDetail, type CommunityTaskFormData, communityTaskDetailSchema} from "../../../utils/community.validation";

export const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
    headers: {"Content-Type": "application/json"}
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Global error normalization. Handles errors in one place, instead of repeating try/catch everywhere.
api.interceptors.response.use(
  (response) => response,

  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data ||
      error.message ||
      "Something went wrong";

    error.normalizedMessage = message;

    return Promise.reject(error);
  }
);
export interface CommunityTaskListItem {
  communityTaskId: string;
  taskId: string;
  title: string;
  description: string;
  baseScore: number;
  locationName?: string;
  startAt?: string;
  endAt?: string;
  maxParticipants?: number;
  registeredCount: number;
  isFull: boolean;
}
  

export const createCommunityTask = async (taskData: CommunityTaskFormData) => {
  // Pass the data directly; interceptors handle the auth token and error normalization
  const response = await api.post("/tasks/community", taskData);
  return response.data;
};

export const getCommunityTaskById = async (communityTaskId: string): Promise<CommunityTaskDetail> => {
  const response = await api.get(`/tasks/community/${communityTaskId}`);
  return communityTaskDetailSchema.parse(response.data);
};

// Register for task
export const registerForCommunityTask = async (taskId: string) => {
  const response = await api.post(`/tasks/community/${taskId}/register`);
  return response.data;
};

export interface CheckInResponse {
  message: string;
  distanceMeters: number;
}

// Check in to a community task on-site. Requires the caller's current
// GPS coordinates, which the backend compares against the task's
// registered location + radiusMeters.
export const checkInToCommunityTask = async (
  taskId: string,
  latitude: number,
  longitude: number
): Promise<CheckInResponse> => {
  const response = await api.post(`/tasks/community/${taskId}/check-in`, {
    latitude,
    longitude,
  });
  return response.data;
};

export const getAvailableCommunityTasks = async (): Promise<{ items: CommunityTaskListItem[] }> => {
  const response = await api.get("/tasks/community/all");
  return response.data;
};