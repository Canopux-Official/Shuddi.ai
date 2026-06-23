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

// =========================
// SEARCH TASKS
// =========================

interface SearchTasksParams {
  search?: string;
  page?: number;
  limit?: number;
  type?: string;
  isActive?: boolean;
}

export const searchTasksApi = async ({
  search = "",
  page = 1,
  limit = 10,
  type,
  isActive,
}: SearchTasksParams) => {
  const params = new URLSearchParams();

  if (search) {
    params.append("search", search);
  }

  params.append("page", String(page));

  params.append("limit", String(limit));

  if (type) {
    params.append("type", type);
  }

  if (isActive !== undefined) {
    params.append("isActive", String(isActive));
  }

  return api.get(
    `/admin/tasks?${params.toString()}`
  );
};

export const createTaskApi = async (payload: any) => {
  return api.post("/admin/tasks", payload);
};  

export const deactivateTaskApi = async (
  taskId: string
) => {
  return api.patch(
    `/admin/tasks/${taskId}/deactivate`
  );
};

export const reactivateTaskApi = async (
  taskId: string
) => {
  return api.patch(
    `/admin/tasks/${taskId}/reactivate`
  );
};

interface DeactivatedTasksParams {
  search?: string;
  page?: number;
  limit?: number;
}

export const getDeactivatedTasksApi = async ({
  search = "",
  page = 1,
  limit = 10,
}: DeactivatedTasksParams = {}) => {
  const params = new URLSearchParams();

  if (search) {
    params.append("search", search);
  }

  params.append("page", String(page));

  params.append("limit", String(limit));

  return api.get(
    `/admin/tasks/deactivated?${params.toString()}`
  );
};

export interface CreateRewardPayload {
  name: string;
  description: string;
  credits: number;
  icon: string;
}

export const createRewardApi = async (payload: CreateRewardPayload) => {
  const response = await api.post("/admin/rewards", payload);
  return response.data;
}

export const deleteRewardApi = async (rewardId: string) => {
  const response = await api.delete(`/admin/rewards/${rewardId}`);
  return response.data;
}

export const getPlatformStatsApi = async () => {
  const response = await api.get("/admin/stats");
  return response.data.data;
}

export const getActiveNGOs = async (
  page = 1,
  limit = 10,
  search = ""
) => {
  const response = await api.get(
    "/admin/ngos/active",
    {
      params: {
        page,
        limit,
        search,
      },
    }
  );

  return response.data;
};

export const getNGOMembers = async (
  ngoId: string,
  page = 1,
  limit = 10
) => {
  const response = await api.get(
    `/admin/ngos/${ngoId}/members`,
    {
      params: {
        page,
        limit,
      },
    }
  );

  return response.data;
};

export const suspendNGO = async (
  ngoId: string
) => {
  const response = await api.patch(
    `/admin/ngos/${ngoId}/status`,
    {
      status: "SUSPENDED",
    }
  );

  return response.data;
};

export const suspendMember = async (
  memberId: string
) => {
  const response = await api.patch(
    `/admin/members/${memberId}/suspend`
  );

  return response.data;
};

export const reactivateMember = async (
  memberId: string
) => {
  const response = await api.patch(
    `/admin/members/${memberId}/reactivate`
  );

  return response.data;
};