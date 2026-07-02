import type {
  OverviewData,
  ImpactData,
  BadgesData,
  ActivityData,
  LeaderboardData,
} from '../../features/dashboard/types/types';

import axios from "axios"


// Creating a Axios instance.
export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" }
})


// Attach auth token to every request
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

export const fetchOverview = async (): Promise<OverviewData> => {
  const res = await api.get('/dashboard/overview');
  return res.data.data;
};

export const fetchImpact = async (): Promise<ImpactData> => {
  const res = await api.get('/dashboard/impact');
  return res.data.data;
};

export const fetchBadges = async (): Promise<BadgesData> => {
  const res = await api.get('/dashboard/badges');
  return res.data.data;
};

export const fetchActivity = async (): Promise<ActivityData> => {
  const res = await api.get('/dashboard/activity');
  return res.data.data;
};

export const fetchLeaderboard = async (
  type: 'global' | 'regional'
): Promise<LeaderboardData> => {
  const res = await api.get(`/dashboard/leaderboard?type=${type}`);
  return res.data.data;
};

export const fetchBalance = async (): Promise<number> => {
  const res = await api.get('/dashboard/balance');
  return res.data.rewardPoints;
};