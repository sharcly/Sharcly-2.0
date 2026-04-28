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

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (newAccessToken: string, newRefreshToken: string, backendUser: { id: string; email: string; name: string; role: any }) => {
    // backendUser.role might be a string (old) or an object with slug (new)
    const roleSlug = typeof backendUser.role === 'string' 
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
    localStorage.setItem("token", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    
    // Set cookies for middleware
    Cookies.set("token", newAccessToken, { expires: 7 });
    Cookies.set("refreshToken", newRefreshToken, { expires: 30 });
    Cookies.set("role", newUser.role, { expires: 7 });
    
    // Redirect based on role
    if (["admin", "manager", "content_manager"].includes(newUser.role)) {
      router.push("/dashboard");
    } else {
      router.push("/account");
    }
  };

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Backend logout failed:", error);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      Cookies.remove("token");
      Cookies.remove("refreshToken");
      Cookies.remove("role");
      router.push("/login");
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
