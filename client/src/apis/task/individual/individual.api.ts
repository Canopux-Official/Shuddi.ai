import axios from "axios";
import type { Task } from "../../../utils/individualTask.type";

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
    const message = error.response?.data?.message || error.response?.data || error.message || "Something went wrong"
    return Promise.reject(new Error(message))
  }
)

//can improve this because it is sending the whole task data, we can only fetch which is to be displayed
//there is a separate api for fetching task details.
export const getAllTasks = async (): Promise<Task[]> => {
    try {
        const response = await api.get<Task[]>("/tasks/all");
        return response.data;
    } catch (error) {
        console.error("Error fetching tasks:", error);
        throw error;
    }
}