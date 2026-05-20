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

export interface CreateAreaInput {
  name: string
  code?: string
}

export const createArea = async (data: CreateAreaInput) => {
  const response = await api.post("/ngo/areas", data)
  return response.data
}

export const getAdminPermissions = async () => {
  const response = await api.get("/admin/permissions")
  return response.data
}

export const getNGOModerationData = async () => {
  const response = await api.get("/ngo/moderation")

  return response.data
}

export const getNGODetails = async (ngoId: string) => {
  const response = await api.get(`/ngo/${ngoId}/details`)
  return response
}

//id will come from params and status will come from body
export const updateNGOStatus = async (
  ngoId: string,
  status: "APPROVED" | "SUSPENDED"
) => {
  const response = await api.patch(
    `/admin/ngos/${ngoId}/status`,
    { status }
  );

  return response.data;
};

export const updateApplicationStatus = async (
  applicationId: string,
  status: "APPROVED" | "REJECTED"
) => {
  const response = await api.patch(
    `/admin/applications/${applicationId}/status`,
    { status }
  );

  return response.data;
};
