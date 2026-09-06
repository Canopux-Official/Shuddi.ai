import axios from "axios"


// Creating a Axios instance.
export const api = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_LINK}/api`,
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




// Approving a feed post.
export type ApproveFeedPostResponse = {
  id:        string
  status:    "PUBLISHED"
  updatedAt: string
}

// API function to approve a feed post.    PATCH /api/feed/{postId}/approve
export async function approveFeedPost(postId: string) {
  const { data } = await api.patch <ApproveFeedPostResponse> (`/feed/${postId}/approve`)
  return data
}




// Creating a feed post.
export type CreateFeedPostResponse = {
  id:        string
  status:    "PUBLISHED"
  createdAt: string
}

// API function to create a feed post.      POST /api/feed
export async function createFeedPost(content: string) {
  const { data } = await api.post<CreateFeedPostResponse>("/feed",  {content})
  return data
}




// Fetching the global feed.
export type GlobalFeedItem = {
  id:        string
  authorId:  string
  author: {
    id:            string
    username:      string
    displayName?:  string
    avatarUrl?:    string
    level:         number
    xp:            number
    emailVerified: boolean
  }
  content:   string
  status:    "PUBLISHED"
  createdAt: string
  updatedAt: string
}

export type GlobalFeedResponse = {
  items:      GlobalFeedItem[]
  nextCursor: string | null
}

// API function to get the global feed.          GET /api/feed
export async function getGlobalFeed( limit = 10, cursor?: string ) {
  const { data } = await api.get <GlobalFeedResponse> ( "/feed", { params: { limit, cursor } })
  return data
}




// Fetching the pending feed posts for admin confirmation.
export type PendingFeedItem = {
  id:   string
  author: {
    id:            string
    username:      string
    displayName?:  string
    avatarUrl?:    string
    emailVerified: boolean
  }
  content:   string
  createdAt: string
}

export type PendingFeedResponse = {
  items:      PendingFeedItem[]
  nextCursor: string | null
}

// API function to get the pending feed posts.     GET /api/feed/pending
export async function getPendingFeed( limit = 10, cursor?: string ) {
  const { data } = await api.get <PendingFeedResponse> ( "/feed/pending",{ params: { limit, cursor } })
  return data
}




// Hiding a feed post.
export type HideFeedPostResponse = {
  id:       string
  status:   "HIDDEN"
  updatedAt: string
}

// API function to hide a feed post.               PATCH /api/feed/{postId}/hide
export async function hideFeedPost(postId: string) {
  const { data } = await api.patch<HideFeedPostResponse>( `/feed/${postId}/hide`)
  return data
}