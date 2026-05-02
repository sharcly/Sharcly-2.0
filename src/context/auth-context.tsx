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
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        // If no token in storage, don't bother the backend (prevents 401 loop on login page)
        if (!storedToken) {
          setIsLoading(false);
          return;
        }

        if (storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }

        // Verify with backend via httpOnly cookie (source of truth)
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
          localStorage.setItem("user", JSON.stringify(verifiedUser));
          Cookies.set("role", verifiedUser.role, { expires: 1, path: "/" });
        }
      } catch (error) {
        // Only clear if we actually had a session that is now invalid
        if (localStorage.getItem("token")) {
          setUser(null);
          setToken(null);
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          Cookies.remove("token", { path: "/" });
          Cookies.remove("refreshToken", { path: "/" });
          Cookies.remove("role", { path: "/" });
        }
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
    const toastId = (await import("sonner")).toast.loading("Signing out...");
    try {
      // 1. Call backend logout first while we still have the token/session
      await apiClient.post("/auth/logout").catch((err) => {
        console.error("Backend logout failed:", err);
      });

      // 2. Clear local state and storage
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      // 3. Remove client-side cookies
      Cookies.remove("token", { path: "/" });
      Cookies.remove("refreshToken", { path: "/" });
      Cookies.remove("role", { path: "/" });

      (await import("sonner")).toast.success("Logged out successfully", { id: toastId });

      // 4. Hard redirect to clear all in-memory state and reset the app
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    } catch (error) {
      console.error("Logout process failed:", error);
      (await import("sonner")).toast.error("Logout failed, clearing local session...", { id: toastId });
      // Fallback: clear what we can and redirect
      localStorage.clear();
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
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
