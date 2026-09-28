import { useState, useEffect, useCallback, useRef } from "react";
import googleAnalyticsService, {
  DEFAULT_GA4_DATA,
  DEFAULT_REALTIME_DATA,
} from "../services/googleAnalytics.service";

export const useGoogleAnalytics = () => {
  const [metrics, setMetrics] = useState(DEFAULT_GA4_DATA.data);
  const [metadata, setMetadata] = useState(DEFAULT_GA4_DATA.metadata);
  const [realtime, setRealtime] = useState(DEFAULT_REALTIME_DATA);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [realtimeLoading, setRealtimeLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);

  // Period / date filter state
  const [period, setPeriod] = useState("30d");
  const [customRange, setCustomRange] = useState({
    startDate: "",
    endDate: "",
  });

  const periodRef = useRef(period);
  periodRef.current = period;
  const customRangeRef = useRef(customRange);
  customRangeRef.current = customRange;

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (periodRef.current === "custom") {
        if (customRangeRef.current.startDate) {
          params.startDate = customRangeRef.current.startDate;
        }
        if (customRangeRef.current.endDate) {
          params.endDate = customRangeRef.current.endDate;
        }
      } else {
        params.period = periodRef.current;
      }

      const [dashRes, trendsRes] = await Promise.allSettled([
        googleAnalyticsService.getDashboardMetrics(params),
        googleAnalyticsService.getDailyTrends(params),
      ]);

      if (dashRes.status === "fulfilled" && dashRes.value?.success) {
        setMetrics(dashRes.value.data || DEFAULT_GA4_DATA.data);
        if (dashRes.value.metadata) {
          setMetadata(dashRes.value.metadata);
        }
        setIsFallback(Boolean(dashRes.value.isOfflineFallback));
      }

      if (trendsRes.status === "fulfilled" && trendsRes.value?.success) {
        setTrends(trendsRes.value.data || []);
      }
    } catch (err) {
      console.error("Google Analytics fetch error:", err);
      setError(err.message || "Failed to fetch GA4 metrics");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRealtime = useCallback(async () => {
    try {
      setRealtimeLoading(true);
      const res = await googleAnalyticsService.getRealtimeMetrics();
      if (res?.success && res.data) {
        setRealtime(res.data);
      }
    } catch (err) {
      console.warn("GA4 Realtime fetch error:", err);
    } finally {
      setRealtimeLoading(false);
    }
  }, []);

  // Fetch when period or custom range changes
  useEffect(() => {
    fetchDashboardData();
  }, [period, customRange, fetchDashboardData]);

  // Initial fetch and poll realtime every 30 seconds
  useEffect(() => {
    fetchRealtime();
    const interval = setInterval(fetchRealtime, 30000);
    return () => clearInterval(interval);
  }, [fetchRealtime]);

  return {
    metrics,
    metadata,
    realtime,
    trends,
    loading,
    realtimeLoading,
    error,
    isFallback,
    period,
    setPeriod,
    customRange,
    setCustomRange,
    refetch: fetchDashboardData,
    refreshRealtime: fetchRealtime,
  };
};

export default useGoogleAnalytics;
