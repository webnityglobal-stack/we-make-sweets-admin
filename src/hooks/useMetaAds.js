import { useState, useEffect, useCallback, useRef } from "react";
import metaAdsService from "../services/metaAds.service";

export const useMetaAds = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFallback, setIsFallback] = useState(false);

  // Filters supported by the API (matching query parameters specification)
  const [filters, setFilters] = useState({
    date_preset: "maximum",
    since: "",
    until: "",
    status: "ALL",
    search: "",
  });

  const activeFiltersRef = useRef(filters);
  activeFiltersRef.current = filters;

  const fetchCampaigns = useCallback(async (customFilters) => {
    const targetFilters = customFilters || activeFiltersRef.current;
    try {
      setLoading(true);
      setError(null);
      const res = await metaAdsService.getCampaignsReport(targetFilters);
      setData(res);
      setIsFallback(Boolean(res?.isOfflineFallback));
    } catch (err) {
      console.error("Meta Ads fetch error:", err);
      setError(err.message || "Failed to fetch Meta Ads campaign data");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch when filters change (debounced for search)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCampaigns(filters);
    }, filters.search ? 300 : 0);

    return () => clearTimeout(timer);
  }, [filters, fetchCampaigns]);

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  };

  const resetFilters = () => {
    const defaultFilters = {
      date_preset: "maximum",
      since: "",
      until: "",
      status: "ALL",
      search: "",
    };
    setFilters(defaultFilters);
  };

  return {
    report: data,
    account: data?.account || null,
    summary: data?.summary || null,
    campaigns: data?.data || [],
    count: data?.count || 0,
    loading,
    error,
    isFallback,
    filters,
    updateFilters,
    resetFilters,
    refetch: () => fetchCampaigns(filters),
  };
};

export default useMetaAds;
