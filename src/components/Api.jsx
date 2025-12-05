import axios from "axios";

const backendURL = import.meta.env.VITE_BACKEND_API_URL;

// Create a reusable Axios instance
const api = axios.create({
  baseURL: backendURL,
  withCredentials: true, // send cookies with every request
});

// Add a response interceptor to handle expired tokens
api.interceptors.response.use(
  (response) => response, // ✅ if success, just return it
  async (error) => {
    const originalRequest = error.config;

    // If token expired and we haven’t retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 🔁 Request a new token
        await api.get("/refresh-token");
        // Retry the failed request
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed", refreshError);
        // ❌ If refresh also fails, log the user out
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
