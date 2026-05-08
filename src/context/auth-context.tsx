"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import Cookies from "js-cookie";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser, clearUser, setLoading } from "@/store/slices/authSlice";

export type Role = "admin" | "super_admin" | "manager" | "content_manager" | "user";

type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
  permissions: string[];
};

type AuthContextType = {
  user: User | null;
  login: (user: { id: string; email: string; name: string; role: any; permissions?: string[] }) => void;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { user, loading: isLoading } = useAppSelector((state) => state.auth);
  const router = useRouter();

  // On mount: restore session from the httpOnly cookie via /auth/me
  useEffect(() => {
    const restoreSession = async () => {
      try {
        dispatch(setLoading(true));
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
            permissions: response.data.permissions || backendUser.permissions || [],
          };
          
          dispatch(setUser(verifiedUser));
          Cookies.set("role", verifiedUser.role, { expires: 1, path: "/" });
        } else {
          dispatch(clearUser());
          Cookies.remove("role", { path: "/" });
        }
      } catch (error) {
        dispatch(clearUser());
        Cookies.remove("role", { path: "/" });
      } finally {
        dispatch(setLoading(false));
      }
    };

    restoreSession();
  }, [dispatch]);

  const login = (
    backendUser: { id: string; email: string; name: string; role: any; permissions?: string[] }
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
      permissions: backendUser.permissions || [],
    };
    
    dispatch(setUser(newUser));
    Cookies.set("role", newUser.role, { expires: 1, path: "/" });

    if (newUser.role === "user") {
      router.push("/account");
    } else {
      router.push("/dashboard");
    }
  };

  const logout = React.useCallback(async () => {
    const toastId = (await import("sonner")).toast.loading("Signing out...");
    try {
      // 1. Call backend logout (clears httpOnly cookies on server)
      await apiClient.post("/auth/logout").catch((err) => {
        console.error("Backend logout failed:", err);
      });

      // 2. Clear Redux state
      dispatch(clearUser());

      // 3. Remove client-side role cookie
      Cookies.remove("role", { path: "/" });

      (await import("sonner")).toast.success("Logged out successfully", { id: toastId });

      // 4. Hard redirect to clear all in-memory state and reset the app
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
    } catch (error) {
      console.error("Logout process failed:", error);
      (await import("sonner")).toast.error("Logout failed, clearing session...", { id: toastId });
      dispatch(clearUser());
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    }
  }, [dispatch]);

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
