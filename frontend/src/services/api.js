import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach the JWT (if we have one) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the backend says our token is no good, clear it and bounce to /login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("auth_user");
      if (!window.location.pathname.startsWith("/pages/Login")) {
        window.location.href = "/pages/Login";
      }
    }
    return Promise.reject(error);
  }
);

// ---- Reviews ----
export const getReviews = () => api.get("/reviews");
export const getReviewById = (id) => api.get(`/reviews/${id}`);
export const createReview = (reviewData) => api.post("/reviews", reviewData);
export const updateReview = (id, reviewData) => api.put(`/reviews/${id}`, reviewData);
export const deleteReview = (id) => api.delete(`/reviews/${id}`);
export const searchReviews = (query) => api.get(`/reviews/search?q=${encodeURIComponent(query)}`);

// ---- Dashboard ----
export const getDashboardSummary = () => api.get("/dashboard/summary");

// ---- Auth ----
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const getCurrentUser = () => api.get("/auth/me");
export const logoutUser = () => api.post("/auth/logout");

export const googleLoginUrl = `${import.meta.env.VITE_API_URL}/auth/google/login`;

export default api;
