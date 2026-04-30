import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8181/api";

export const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// For handling multiple concurrent 401s
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Add a request interceptor to add the JWT token to headers
apiClient.interceptors.request.use(
  (config) => {
    // Never send Authorization header for login or register
    const authUrls = ["/auth/login", "/auth/register", "/auth/refresh-token"];
    const isAuthRequest = authUrls.some(url => config.url?.includes(url));

    if (typeof window !== "undefined" && !isAuthRequest) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors and silent refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh logic for auth-related endpoints to prevent infinite loops
    const authUrls = ["/auth/login", "/auth/register", "/auth/refresh-token", "/auth/logout"];
    const isAuthRequest = authUrls.some(url => originalRequest.url?.includes(url));

    // If error is 401 and it's not an auth request and we haven't retried yet
    if (error.response?.status === 401 && !isAuthRequest && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        // Call the refresh endpoint
        const response = await axios.post(
          `${API_URL}/auth/refresh-token`,
          { refreshToken },
          { withCredentials: true }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Update local storage
        if (typeof window !== "undefined") {
          localStorage.setItem("token", accessToken);
          if (newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken);
          }
        }

        // Update current request header
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Resolve all queued requests
        processQueue(null, accessToken);

        // RETRY with a clean axios call to avoid request interceptor overwriting
        return apiClient.request(originalRequest);
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
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
