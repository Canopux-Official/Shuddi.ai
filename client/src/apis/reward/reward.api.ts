import axios from "axios";
import { type Reward, type HistoryResponse } from "../../utils/reward.type";

export const api = axios.create({
    baseURL: `${import.meta.env.VITE_SERVER_LINK}/api`,
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

export type Balance = {
    rewardPoints: number
}

export const getBalance = async (): Promise<Balance> => {
    const {data} = await api.get<Balance>("/dashboard/balance")
    return data
}

export const getAllRewards = async(): Promise<Reward[]> => {
  const response = await api.get<Reward[]>("rewards/all");
  return response.data;
}

export const getUserHistory = async() => {
  const {data} = await api.get<HistoryResponse>("rewards/history");
  return data;
}

export const redeemReward = async (rewardId: string, amount: number) => {
  const response = await api.post("/rewards/redeem", { rewardId, amount });
  return response.data;
}