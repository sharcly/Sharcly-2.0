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

import Cookies from "js-cookie";

// Add a request interceptor to attach the CSRF token from cookies
apiClient.interceptors.request.use(
  (config) => {
    // Try to get token from XSRF-TOKEN (new) or csrf-token (old)
    const csrfToken = Cookies.get("XSRF-TOKEN") || Cookies.get("csrf-token");
    if (csrfToken) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to capture CSRF token from body if present
apiClient.interceptors.response.use(
  (response) => {
    // If the response contains a csrfToken in the body, set it in the cookie manually
    // This is a fallback for when the browser blocks the Set-Cookie header
    if (response.data?.csrfToken) {
      Cookies.set("XSRF-TOKEN", response.data.csrfToken, { 
        expires: 1, 
        sameSite: "lax", 
        secure: typeof window !== "undefined" && window.location.protocol === "https:" 
      });
    }
    return response;
  },
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
          .then(() => {
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call the refresh endpoint to rotate HttpOnly cookies
        await axios.post(
          `${API_URL}/auth/refresh-token`,
          {}, // Body is empty because backend reads refresh_token from cookie
          { withCredentials: true }
        );

        // Resolve all queued requests
        processQueue(null);

        // RETRY the original request
        return apiClient.request(originalRequest);
      } catch (refreshError) {
        // Refresh failed — clean up
        if (typeof window !== "undefined") {
          localStorage.removeItem("user");

          // ONLY redirect to login if the user is on a protected route (dashboard or account)
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
