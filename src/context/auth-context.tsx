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
  login: (accessToken: string, refreshToken: string, user: { id: string; email: string; name: string; role: any }) => void;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // On mount: restore session from the httpOnly cookie via /auth/me
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        
        // On mount, we always check /auth/me to verify the session
        // (HttpOnly cookie is the source of truth)

        if (storedUser) {
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
        // If session is invalid, clear local user state
        setUser(null);
        localStorage.removeItem("user");
        Cookies.remove("role", { path: "/" });
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

    setUser(newUser);

    // Keep user in localStorage for fast UI hydration only
    localStorage.setItem("user", JSON.stringify(newUser));

    // Role cookie for Next.js middleware routing
    Cookies.set("role", newUser.role, { expires: 1, path: "/" });

    // Redirect based on role
    if (["admin", "manager", "content_manager"].includes(newUser.role)) {
      router.push("/dashboard");
    } else {
      router.push("/account");
    }
  };

  const logout = React.useCallback(async () => {
    const toastId = (await import("sonner")).toast.loading("Signing out...");
    try {
      // 1. Call backend logout first while we still have the token/session
      await apiClient.post("/auth/logout").catch((err) => {
        console.error("Backend logout failed:", err);
      });

      // 2. Clear local state and storage
      setUser(null);
      localStorage.removeItem("user");

      // 3. Remove client-side role cookie
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
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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
