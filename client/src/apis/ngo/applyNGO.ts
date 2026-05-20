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

const convertFileToDummyUrl = (file: File) => {
  return `https://dummy-storage.local/${Date.now()}-${file.name}`;
};

interface ApplyNGOInput {
  name: string;
  description?: string;
  areaId: string;
  documents: {
    registration?: File | null;
    pan?: File | null;
    address?: File | null;
  };
}

export const applyForNGO = async (data: ApplyNGOInput) => {

  const documentsPayload: any[] = [];

  if (data.documents.registration) {
    documentsPayload.push({
      type: "REGISTRATION_CERTIFICATE",
      url: convertFileToDummyUrl(data.documents.registration)
    });
  }

  if (data.documents.pan) {
    documentsPayload.push({
      type: "PAN_CARD",
      url: convertFileToDummyUrl(data.documents.pan)
    });
  }

  if (data.documents.address) {
    documentsPayload.push({
      type: "ADDRESS_PROOF",
      url: convertFileToDummyUrl(data.documents.address)
    });
  }

  const payload = {
    name: data.name,
    description: data.description,
    areaId: data.areaId,
    documents: documentsPayload
  };

  const response = await api.post("/ngo/apply", payload);

  return response.data;
};

export const getAreas = async () => {
  const response = await api.get("/ngo/areas");
  return response.data.data;
}