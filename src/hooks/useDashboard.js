import { useState, useEffect, useCallback } from "react";
import dashboardService from "../services/dashboard.service";

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getDashboardData();
      setDashboardData(data);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return {
    dashboard: dashboardData,
    summary: dashboardData?.summary || null,
    salesTrend: dashboardData?.salesTrend || [],
    weeklyStats: dashboardData?.weeklyStats || null,
    paymentSplit: dashboardData?.paymentSplit || null,
    orderStatus: dashboardData?.orderStatus || null,
    topProducts: dashboardData?.topProducts || [],
    recentOrders: dashboardData?.recentOrders || [],
    isLoading,
    error,
    refetch: fetchDashboard,
  };
};

export default useDashboard;
