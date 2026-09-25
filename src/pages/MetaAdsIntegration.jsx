import React, { useState } from "react";
import useMetaAds from "@/hooks/useMetaAds";
import {
  Megaphone,
  Search,
  Calendar,
  RotateCcw,
  TrendingUp,
  Eye,
  Users,
  MousePointerClick,
  Percent,
  Layers,
  ExternalLink,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Loader2,
  X,
  RefreshCw,
  Download,
  Activity,
  ArrowUpRight,
  Info,
} from "lucide-react";

const MetaAdsIntegration = () => {
  const {
    account,
    summary,
    campaigns,
    count,
    loading,
    error,
    isFallback,
    filters,
    updateFilters,
    resetFilters,
    refetch,
  } = useMetaAds();

  const [copiedId, setCopiedId] = useState(null);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const handleCopy = (text, id) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCsv = () => {
    if (!campaigns.length) return;
    const headers = [
      "Campaign ID",
      "Campaign Name",
      "Status",
      "Objective",
      "Spend (INR)",
      "Impressions",
      "Reach",
      "Clicks",
      "CTR",
      "CPC",
      "CPM",
      "Start Date",
      "Stop Date",
    ];

    const rows = campaigns.map((c) => [
      `"${c.id}"`,
      `"${c.campaign?.replace(/"/g, '""')}"`,
      c.status,
      c.objective,
      c.spend,
      c.impressions,
      c.reach,
      c.clicks,
      `"${c.ctr}"`,
      c.cpc,
      c.cpm,
      c.dateStart,
      c.dateStop,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `meta_ads_campaigns_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-pink-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Meta Ads & Campaigns Report
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time Facebook & Instagram ad campaigns, spending metrics, audience reach, and conversion analytics
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => refetch()}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-400" : ""}`}
            />
            <span>Sync Live</span>
          </button>

          <button
            onClick={handleExportCsv}
            disabled={!campaigns.length}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <a
            href="https://adsmanager.facebook.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition"
          >
            <span>Meta Ads Manager</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Account Info Banner */}
      {account && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-900/60 border border-blue-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-sm font-bold text-white">
                  {account.name || "Meta Ad Account"}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>{account.status || "ACTIVE"}</span>
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  Currency: {account.currency || "INR"} (₹)
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  Timezone: {account.timezone || "Asia/Kolkata"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                <span>Account ID:</span>
                <span className="font-mono text-slate-200">{account.id}</span>
                <button
                  onClick={() => handleCopy(account.id, "account")}
                  className="p-1 text-slate-400 hover:text-white transition cursor-pointer"
                  title="Copy Account ID"
                >
                  {copiedId === "account" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Tracked Endpoint</span>
              <span className="font-mono text-blue-400 font-semibold text-[11px]">
                GET /api/meta-ads/campaigns
              </span>
            </div>
          </div>
        </div>
      )}

      {/* KPI Performance Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Total Spend */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all duration-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="font-medium">Total Spend</span>
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-white">
              ₹{parseFloat(summary.totalSpend || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Budget spent across active ads
            </span>
          </div>

          {/* Total Impressions */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all duration-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="font-medium">Impressions</span>
              <div className="w-7 h-7 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center">
                <Eye className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-pink-400">
              {Number(summary.totalImpressions || 0).toLocaleString("en-IN")}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Times ads appeared on feeds
            </span>
          </div>

          {/* Total Reach */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all duration-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="font-medium">Unique Reach</span>
              <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-purple-400">
              {Number(summary.totalReach || 0).toLocaleString("en-IN")}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Unique individuals who saw ads
            </span>
          </div>

          {/* Total Clicks */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all duration-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="font-medium">Total Clicks</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <MousePointerClick className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-emerald-400">
              {Number(summary.totalClicks || 0).toLocaleString("en-IN")}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Storefront link navigations
            </span>
          </div>

          {/* Average CTR */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all duration-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="font-medium">Average CTR</span>
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Percent className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-indigo-400">
              {summary.averageCtr}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Click-Through Rate efficiency
            </span>
          </div>

          {/* Average CPC */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all duration-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="font-medium">Average CPC</span>
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-amber-400">
              ₹{summary.averageCpc}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Cost Per Storefront Click
            </span>
          </div>

          {/* Average CPM */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all duration-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="font-medium">Average CPM</span>
              <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-cyan-400">
              ₹{summary.averageCpm}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Cost Per 1,000 Impressions
            </span>
          </div>

          {/* Total Campaigns */}
          <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all duration-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="font-medium">Total Campaigns</span>
              <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-rose-400">
              {summary.totalCampaigns}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Reported campaign ad sets
            </span>
          </div>
        </div>
      )}

      {/* Query Parameters / Filters Toolbar (Matching Specification) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>Campaign Query Filters & Search</span>
          </div>
          {(filters.search ||
            filters.date_preset !== "maximum" ||
            filters.status !== "ALL" ||
            filters.since ||
            filters.until) && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 text-xs">
          {/* Search by campaign name (4 cols) */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              placeholder="Search campaign name (e.g. festive, Janmashtami)..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          {/* Date Preset Filter (3 cols) */}
          <div className="md:col-span-3">
            <select
              value={filters.date_preset}
              onChange={(e) => updateFilters({ date_preset: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 transition cursor-pointer"
            >
              <option value="maximum">Maximum (All Time)</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="last_7d">Last 7 Days</option>
              <option value="last_14d">Last 14 Days</option>
              <option value="last_30d">Last 30 Days</option>
              <option value="last_90d">Last 90 Days</option>
            </select>
          </div>

          {/* Status Filter (2 cols) */}
          <div className="md:col-span-2">
            <select
              value={filters.status}
              onChange={(e) => updateFilters({ status: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-blue-500 transition cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">ACTIVE Only</option>
              <option value="PAUSED">PAUSED Only</option>
            </select>
          </div>

          {/* Custom Date Range Start (since) (1.5 cols) */}
          <div className="md:col-span-3 flex items-center gap-2">
            <input
              type="date"
              value={filters.since}
              onChange={(e) => updateFilters({ since: e.target.value })}
              title="Custom Date Range Start (since)"
              className="w-1/2 px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500 transition"
            />
            <span className="text-slate-500 text-xs">to</span>
            <input
              type="date"
              value={filters.until}
              onChange={(e) => updateFilters({ until: e.target.value })}
              title="Custom Date Range End (until)"
              className="w-1/2 px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Campaigns Report Table (Matching User's Image 1 Specification) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white">Campaigns Breakdown</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {campaigns.length} Campaign{campaigns.length !== 1 ? "s" : ""}
            </span>
          </div>

          {loading && (
            <div className="flex items-center gap-2 text-xs text-blue-400">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Updating live data...</span>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 bg-slate-950/60 font-semibold">
              <tr>
                <th className="py-3 px-4">Campaign</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Spend</th>
                <th className="py-3 px-3">Impressions</th>
                <th className="py-3 px-3">Reach</th>
                <th className="py-3 px-3">Clicks</th>
                <th className="py-3 px-3">CTR</th>
                <th className="py-3 px-3">CPC</th>
                <th className="py-3 px-3">CPM</th>
                <th className="py-3 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {campaigns.length > 0 ? (
                campaigns.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                    onClick={() => setSelectedCampaign(item)}
                  >
                    {/* Campaign Name & Meta info */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1 max-w-[280px] sm:max-w-xs">
                        <span className="font-semibold text-white group-hover:text-blue-400 transition truncate text-xs">
                          {item.campaign}
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 flex-wrap">
                          <span className="font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                            ID: {item.id}
                          </span>
                          <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 font-medium border border-blue-500/20">
                            {item.objective || "LINK_CLICKS"}
                          </span>
                          {item.dateStart && item.dateStop && (
                            <span className="text-slate-500">
                              {item.dateStart} to {item.dateStop}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          item.status === "ACTIVE"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.status === "ACTIVE"
                              ? "bg-emerald-400 animate-pulse"
                              : "bg-amber-400"
                          }`}
                        ></span>
                        <span>{item.status}</span>
                      </span>
                    </td>

                    {/* Spend */}
                    <td className="py-3.5 px-3 font-semibold text-white">
                      ₹{parseFloat(item.spend || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>

                    {/* Impressions */}
                    <td className="py-3.5 px-3 text-slate-300 font-medium">
                      {Number(item.impressions || 0).toLocaleString("en-IN")}
                    </td>

                    {/* Reach */}
                    <td className="py-3.5 px-3 text-slate-300 font-medium">
                      {Number(item.reach || 0).toLocaleString("en-IN")}
                    </td>

                    {/* Clicks */}
                    <td className="py-3.5 px-3 font-bold text-emerald-400">
                      {Number(item.clicks || 0).toLocaleString("en-IN")}
                    </td>

                    {/* CTR */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-indigo-400">
                          {item.ctr}
                        </span>
                      </div>
                    </td>

                    {/* CPC */}
                    <td className="py-3.5 px-3 text-amber-400 font-medium">
                      ₹{item.cpc}
                    </td>

                    {/* CPM */}
                    <td className="py-3.5 px-3 text-cyan-400 font-medium">
                      ₹{item.cpm}
                    </td>

                    {/* Details Button */}
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCampaign(item);
                        }}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-medium transition cursor-pointer"
                      >
                        <span>View</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Megaphone className="w-8 h-8 text-slate-600" />
                      <span className="text-sm font-medium text-slate-300">
                        No campaigns found
                      </span>
                      <p className="text-xs text-slate-500">
                        Try adjusting your filters or search keywords.
                      </p>
                      <button
                        onClick={resetFilters}
                        className="mt-2 px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-white hover:bg-slate-700 cursor-pointer"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Campaign Details Modal */}
      {selectedCampaign && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedCampaign(null)}
        >
          <div
            className="relative max-w-lg w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                  Campaign Breakdown
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  {selectedCampaign.campaign}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 font-mono">
                  <span>ID: {selectedCampaign.id}</span>
                  <button
                    onClick={() => handleCopy(selectedCampaign.id, "modal")}
                    className="p-1 hover:text-white transition cursor-pointer"
                  >
                    {copiedId === "modal" ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
              <button
                onClick={() => setSelectedCampaign(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Campaign Attributes Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Status</span>
                <span className="font-bold text-emerald-400">
                  {selectedCampaign.status} ({selectedCampaign.effectiveStatus})
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Campaign Objective</span>
                <span className="font-bold text-white">
                  {selectedCampaign.objective}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Date Range</span>
                <span className="font-medium text-slate-200">
                  {selectedCampaign.dateStart} to {selectedCampaign.dateStop}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Created Time</span>
                <span className="font-medium text-slate-200">
                  {selectedCampaign.createdTime}
                </span>
              </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <span className="text-[10px] text-slate-400 block">Total Spend</span>
                <span className="text-base font-bold text-blue-400">
                  ₹{selectedCampaign.spend}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-[10px] text-slate-400 block">Link Clicks</span>
                <span className="text-base font-bold text-emerald-400">
                  {Number(selectedCampaign.clicks).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <span className="text-[10px] text-slate-400 block">CTR</span>
                <span className="text-base font-bold text-indigo-400">
                  {selectedCampaign.ctr}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20">
                <span className="text-[10px] text-slate-400 block">Impressions</span>
                <span className="text-base font-bold text-pink-400">
                  {Number(selectedCampaign.impressions).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <span className="text-[10px] text-slate-400 block">Reach</span>
                <span className="text-base font-bold text-purple-400">
                  {Number(selectedCampaign.reach).toLocaleString("en-IN")}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <span className="text-[10px] text-slate-400 block">CPC</span>
                <span className="text-base font-bold text-amber-400">
                  ₹{selectedCampaign.cpc}
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <a
                href={`https://adsmanager.facebook.com/adsmanager/manage/campaigns?act=${account?.id?.replace("act_", "")}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300"
              >
                <span>Open in Ads Manager</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => setSelectedCampaign(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetaAdsIntegration;
