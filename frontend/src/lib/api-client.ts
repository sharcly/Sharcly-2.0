import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8181/api";

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Send httpOnly cookies automatically with every request
});

// Add a request interceptor to add the JWT token to headers (for backward compat)
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors and silent refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        // Attempt to get new access token
        const response = await axios.post(
          `${API_URL}/auth/refresh-token`,
          { refreshToken },
          { withCredentials: true } // Also send httpOnly cookie
        );
        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Update storage
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        if (newRefreshToken) localStorage.setItem("refreshToken", newRefreshToken);
        
        // Retry the original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed — clean up
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");

          // ONLY redirect to login if the user is on a protected route (dashboard or account)
          // and if the request wasn't the session restoration check itself
          const isProtectedRoute = 
            window.location.pathname.startsWith("/dashboard") || 
            window.location.pathname.startsWith("/account");
          
          const isAuthMeRequest = originalRequest.url?.includes("/auth/me");

          if (isProtectedRoute && !isAuthMeRequest) {
            window.location.href = "/login";
          }
        }
      }
    }

    return Promise.reject(error);
  }
);
