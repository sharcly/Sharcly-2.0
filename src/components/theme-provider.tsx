"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";

interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  buttonRadius: string;
  siteTheme: string;
  navbarStyle: string;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeContext = createContext<{ settings: ThemeSettings | null }>({ settings: null });

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [settings, setSettings] = useState<ThemeSettings | null>(null);

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const { data } = await apiClient.get("/settings");
        if (data.success) {
          const theme = {
            primaryColor: data.settings.primaryColor || "#062D1B",
            secondaryColor: data.settings.secondaryColor || "#F0FDF4",
            buttonRadius: data.settings.buttonRadius || "1.5rem",
            siteTheme: data.settings.siteTheme || "light",
            navbarStyle: data.settings.navbarStyle || "transparent",
          };
          setSettings(theme);
          applyTheme(theme);
        }
      } catch (error) {
        console.error("Failed to load theme:", error);
      }
    };
    fetchTheme();
  }, []);

  const applyTheme = (theme: ThemeSettings) => {
    const root = document.documentElement;
    root.style.setProperty("--primary-brand", theme.primaryColor);
    root.style.setProperty("--secondary-brand", theme.secondaryColor);
    root.style.setProperty("--radius-brand", theme.buttonRadius);
    
    // We can also override shadcn radius
    root.style.setProperty("--radius", theme.buttonRadius);
  };

  return (
    <ThemeContext.Provider value={{ settings }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeSettings = () => useContext(ThemeContext);
