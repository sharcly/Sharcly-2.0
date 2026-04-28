"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";

export interface DashboardStats {
  metrics: {
    totalRevenue: number;
    activeCustomers: number;
    totalOrders: number;
    activeNow: number;
  };
  chartData: {
    day: string;
    revenue: number;
  }[];
  recentTransactions: {
    id: string;
    name: string;
    email: string;
    amount: number;
    date: string;
    status: string;
    type: string;
  }[];
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/stats");
      if (response.data.success) {
        setStats(response.data.data);
      } else {
        setError("Failed to fetch statistics");
      }
    } catch (err: any) {
      console.error("Fetch stats error:", err);
      setError(err.response?.data?.message || "An error occurred while fetching stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Polling for "Real-time" effect every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return { stats, loading, error, refetch: fetchStats };
}
