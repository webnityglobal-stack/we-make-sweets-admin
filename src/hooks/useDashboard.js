import { useState, useEffect, useCallback } from "react";
import dashboardService from "../services/dashboard.service";
import reelService from "../services/reel.service";

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [reelsCount, setReelsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [data, reelsRes] = await Promise.allSettled([
        dashboardService.getDashboardData(),
        reelService.getReels(),
      ]);
      if (data.status === "fulfilled") {
        setDashboardData(data.value);
      }
      if (reelsRes.status === "fulfilled" && reelsRes.value) {
        const count =
          typeof reelsRes.value.count === "number"
            ? reelsRes.value.count
            : Array.isArray(reelsRes.value.reels)
            ? reelsRes.value.reels.length
            : 0;
        setReelsCount(count);
      }
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
    reelsCount,
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
