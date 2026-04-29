"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import Cookies from "js-cookie";

export type Role = "admin" | "manager" | "content_manager" | "user";

type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (accessToken: string, refreshToken: string, user: { id: string; email: string; name: string; role: any }) => void;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // On mount: restore session from the httpOnly cookie via /auth/me
  // This is secure because the cookie is httpOnly and cannot be read by JS
  useEffect(() => {
    const restoreSession = async () => {
      try {
        // First try localStorage for fast hydration (kept for backward compat)
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }

        // Then verify with backend via httpOnly cookie (source of truth)
        const response = await apiClient.get("/auth/me");
        if (response.data.success) {
          const backendUser = response.data.user;
          const roleSlug =
            typeof backendUser.userRole === "object"
              ? backendUser.userRole?.slug
              : backendUser.role || "user";

          const verifiedUser: User = {
            id: backendUser.id,
            email: backendUser.email,
            name: backendUser.name,
            role: roleSlug as Role,
          };
          setUser(verifiedUser);
          // Keep localStorage in sync for fast hydration on next reload
          localStorage.setItem("user", JSON.stringify(verifiedUser));
          
          // Sync role cookie for middleware
          Cookies.set("role", verifiedUser.role, { expires: 1, path: "/" });
        }
      } catch {
        // Session is invalid — clear everything
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = (
    newAccessToken: string,
    newRefreshToken: string,
    backendUser: { id: string; email: string; name: string; role: any }
  ) => {
    const roleSlug =
      typeof backendUser.role === "string"
        ? backendUser.role.toLowerCase()
        : backendUser.role?.slug || "user";

    const newUser: User = {
      id: backendUser.id,
      email: backendUser.email,
      name: backendUser.name,
      role: roleSlug as Role,
    };

    setToken(newAccessToken);
    setUser(newUser);

    // Keep localStorage for fast hydration only (not as auth source of truth)
    localStorage.setItem("token", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    localStorage.setItem("user", JSON.stringify(newUser));

    // Set JS-accessible cookies for Next.js middleware route protection
    // (The real auth token is in the httpOnly cookie set by the backend)
    Cookies.set("token", newAccessToken, { expires: 1, path: "/" });
    Cookies.set("refreshToken", newRefreshToken, { expires: 7, path: "/" });
    Cookies.set("role", newUser.role, { expires: 1, path: "/" });

    // Redirect based on role
    if (["admin", "manager", "content_manager"].includes(newUser.role)) {
      router.push("/dashboard");
    } else {
      router.push("/account");
    }
  };

  const logout = async () => {
    try {
      // Clear local state immediately for instant feedback
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      // Remove cookies with explicit path
      Cookies.remove("token", { path: "/" });
      Cookies.remove("refreshToken", { path: "/" });
      Cookies.remove("role", { path: "/" });

      // Call backend logout — clears httpOnly cookie and invalidates refresh token in DB
      apiClient
        .post("/auth/logout")
        .catch((err) => console.error("Backend logout failed:", err));

      // Hard redirect to clear all in-memory state
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
