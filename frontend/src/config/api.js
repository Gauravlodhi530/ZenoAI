import axios from "axios";

export const API_URL = "http://localhost:3000";
// export const API_URL = "https://zenoai-uy9e.onrender.com";

export const SOCKET_URL = "http://localhost:3000";
// export const SOCKET_URL = "https://zenoai-uy9e.onrender.com";

// Create axios instance with credentials enabled
export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // This ensures cookies are sent with every request
  headers: {
    'Content-Type': 'application/json',
  },
});