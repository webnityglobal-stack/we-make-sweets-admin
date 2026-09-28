import React, { useState } from 'react';
import { useIntegrations } from '@/hooks/useIntegrations';
import useGoogleAnalytics from '@/hooks/useGoogleAnalytics';
import {
  BarChart3,
  Save,
  CheckCircle2,
  Users,
  UserCheck,
  Eye,
  RotateCcw,
  Zap,
  ShoppingCart,
  IndianRupee,
  TrendingUp,
  Clock,
  Radio,
  RefreshCw,
  Calendar,
  ShieldCheck,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';

const GoogleAnalyticsIntegration = () => {
  const { gaConfig, updateGA } = useIntegrations();
  const {
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
    refetch,
    refreshRealtime,
  } = useGoogleAnalytics();

  const [formData, setFormData] = useState({
    measurementId: gaConfig?.measurementId || 'G-9K382LM982',
    tagManagerId: gaConfig?.tagManagerId || 'GTM-WMS994',
    apiSecret: gaConfig?.apiSecret || 'wms_sec_k9284j82194m',
    isActive: gaConfig?.isActive ?? true,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [tempDates, setTempDates] = useState({
    startDate: '',
    endDate: '',
  });
  const [fullWidthView, setFullWidthView] = useState(false);
  const [credentialsOpen, setCredentialsOpen] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateGA({
      ...gaConfig,
      ...formData,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePeriodChange = (val) => {
    if (val === 'custom') {
      setShowCustomPicker(true);
      setPeriod('custom');
    } else {
      setShowCustomPicker(false);
      setPeriod(val);
    }
  };

  const applyCustomDates = (e) => {
    e.preventDefault();
    if (tempDates.startDate && tempDates.endDate) {
      setCustomRange(tempDates);
      setPeriod('custom');
    }
  };

  // Helper to format engagement time (userEngagementDuration in seconds)
  const formatDuration = (totalSeconds) => {
    const sec = Math.round(Number(totalSeconds) || 0);
    if (sec <= 0) return '0s';
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const remainingSec = sec % 60;

    if (hours > 0) return `${hours}h ${minutes}m ${remainingSec}s`;
    if (minutes > 0) return `${minutes}m ${remainingSec}s`;
    return `${remainingSec}s`;
  };

  // Format engagement rate (if <= 1, convert float to percentage)
  const formatEngagementRate = (rate) => {
    const num = parseFloat(rate || 0);
    if (num <= 0) return '0.0%';
    if (num <= 1) return `${(num * 100).toFixed(1)}%`;
    return `${num.toFixed(1)}%`;
  };

  /**
   * The 9 Admin Panel Cards mapped directly to GA4 metrics as requested:
   * 1. Visitors       -> activeUsers
   * 2. Total Users    -> totalUsers
   * 3. Page Views     -> screenPageViews
   * 4. Sessions       -> sessions
   * 5. Events         -> eventCount
   * 6. Purchases      -> transactions
   * 7. Revenue        -> totalRevenue
   * 8. Engagement Rate-> engagementRate
   * 9. Engagement Time-> userEngagementDuration
   */
  const gaCards = [
    {
      title: 'Visitors',
      metricKey: 'activeUsers',
      icon: Users,
      value: Number(metrics?.activeUsers || 0).toLocaleString('en-IN'),
      subtitle: 'Active unique storefront visitors',
      accentColor: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/20',
      hoverBorder: 'hover:border-indigo-500/40',
      gradient: 'from-indigo-500/10 to-transparent',
    },
    {
      title: 'Total Users',
      metricKey: 'totalUsers',
      icon: UserCheck,
      value: Number(metrics?.totalUsers || 0).toLocaleString('en-IN'),
      subtitle: 'Unique registered & first-time users',
      accentColor: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      hoverBorder: 'hover:border-blue-500/40',
      gradient: 'from-blue-500/10 to-transparent',
    },
    {
      title: 'Page Views',
      metricKey: 'screenPageViews',
      icon: Eye,
      value: Number(metrics?.screenPageViews || 0).toLocaleString('en-IN'),
      subtitle: 'Storefront screens & page loads',
      accentColor: 'text-pink-400',
      bgColor: 'bg-pink-500/10',
      borderColor: 'border-pink-500/20',
      hoverBorder: 'hover:border-pink-500/40',
      gradient: 'from-pink-500/10 to-transparent',
    },
    {
      title: 'Sessions',
      metricKey: 'sessions',
      icon: RotateCcw,
      value: Number(metrics?.sessions || 0).toLocaleString('en-IN'),
      subtitle: 'Individual storefront visit sessions',
      accentColor: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20',
      hoverBorder: 'hover:border-cyan-500/40',
      gradient: 'from-cyan-500/10 to-transparent',
    },
    {
      title: 'Events',
      metricKey: 'eventCount',
      icon: Zap,
      value: Number(metrics?.eventCount || 0).toLocaleString('en-IN'),
      subtitle: 'Clicks, scrolls & custom GA4 events',
      accentColor: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      hoverBorder: 'hover:border-amber-500/40',
      gradient: 'from-amber-500/10 to-transparent',
    },
    {
      title: 'Purchases',
      metricKey: 'transactions',
      icon: ShoppingCart,
      value: Number(metrics?.transactions || 0).toLocaleString('en-IN'),
      subtitle: 'Completed e-commerce orders',
      accentColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      hoverBorder: 'hover:border-emerald-500/40',
      gradient: 'from-emerald-500/10 to-transparent',
    },
    {
      title: 'Revenue',
      metricKey: 'totalRevenue',
      icon: IndianRupee,
      value: `₹${parseFloat(metrics?.totalRevenue || 0).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      subtitle: 'Total e-commerce sales tracked in GA4',
      accentColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      hoverBorder: 'hover:border-emerald-500/40',
      gradient: 'from-emerald-500/10 to-transparent',
    },
    {
      title: 'Engagement Rate',
      metricKey: 'engagementRate',
      icon: TrendingUp,
      value: formatEngagementRate(metrics?.engagementRate),
      subtitle: 'Percentage of engaged user sessions',
      accentColor: 'text-violet-400',
      bgColor: 'bg-violet-500/10',
      borderColor: 'border-violet-500/20',
      hoverBorder: 'hover:border-violet-500/40',
      gradient: 'from-violet-500/10 to-transparent',
    },
    {
      title: 'Engagement Time',
      metricKey: 'userEngagementDuration',
      icon: Clock,
      value: formatDuration(metrics?.userEngagementDuration),
      subtitle:
        metrics?.activeUsers > 0
          ? `${formatDuration(
              Math.round(metrics.userEngagementDuration / metrics.activeUsers)
            )} avg / active user`
          : 'Total engaged user duration',
      accentColor: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/20',
      hoverBorder: 'hover:border-rose-500/40',
      gradient: 'from-rose-500/10 to-transparent',
    },
  ];

  const periodsList = [
    { label: 'Today', value: 'today' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'Last 90 Days', value: '90d' },
    { label: 'Year', value: 'year' },
    { label: 'Custom', value: 'custom' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-pink-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                Google Analytics Integration
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time GA4 measurement metrics, visitor traffic, e-commerce revenue, and session engagement
              </p>
            </div>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Realtime Live Active Pill */}
          <button
            onClick={refreshRealtime}
            disabled={realtimeLoading}
            title="Click to refresh live active customers"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/15 transition cursor-pointer"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>
              {realtime?.activeUsers ?? 0} Live Shoppers
            </span>
            <span className="text-[10px] text-emerald-500/70 hidden sm:inline">(Past 30m)</span>
          </button>

          {/* Sync Live Button */}
          <button
            onClick={() => refetch()}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-pink-400' : ''}`} />
            <span>Sync Live</span>
          </button>

          {/* Toggle Full Width / Split Layout */}
          <button
            onClick={() => setFullWidthView(!fullWidthView)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition cursor-pointer"
            title={fullWidthView ? 'Switch to split layout' : 'Expand full width dashboard'}
          >
            {fullWidthView ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Split View</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Full Width</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Property & Data Stream Metadata Banner */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-white">GA4 Property:</span>
            <span className="font-mono text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded text-[11px]">
              {metadata?.propertyId || '556026776'}
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Timezone:</span>
            <span className="text-slate-200 font-medium">{metadata?.timeZone || 'Asia/Calcutta'}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Currency:</span>
            <span className="text-slate-200 font-medium">{metadata?.currencyCode || 'INR'} (₹)</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          {!isFallback ? (
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold flex items-center gap-1.5 shadow-sm shadow-emerald-500/10">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Live Backend Connected</span>
            </span>
          ) : (
            <span
              className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-medium flex items-center gap-1.5"
              title="Backend API not reachable. Displaying sample data."
            >
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>Sample Fallback Mode</span>
            </span>
          )}
        </div>
      </div>

      {/* Date Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1 mr-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Range:</span>
          </span>
          {periodsList.map((p) => {
            const isActive = period === p.value;
            return (
              <button
                key={p.value}
                onClick={() => handlePeriodChange(p.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Custom Range Inputs (if selected) */}
        {showCustomPicker && (
          <form
            onSubmit={applyCustomDates}
            className="flex items-center gap-2 flex-wrap text-xs bg-slate-950/80 p-2 rounded-lg border border-slate-800"
          >
            <input
              type="date"
              required
              value={tempDates.startDate}
              onChange={(e) => setTempDates({ ...tempDates, startDate: e.target.value })}
              className="bg-slate-900 border border-slate-700 text-white px-2 py-1 rounded text-xs focus:outline-none focus:border-pink-500"
            />
            <span className="text-slate-400">to</span>
            <input
              type="date"
              required
              value={tempDates.endDate}
              onChange={(e) => setTempDates({ ...tempDates, endDate: e.target.value })}
              className="bg-slate-900 border border-slate-700 text-white px-2 py-1 rounded text-xs focus:outline-none focus:border-pink-500"
            />
            <button
              type="submit"
              className="px-2.5 py-1 bg-pink-600 hover:bg-pink-500 text-white rounded font-medium text-xs transition"
            >
              Apply
            </button>
          </form>
        )}
      </div>

      {/* Main Content Layout */}
      <div
        className={`grid gap-6 ${
          fullWidthView ? 'grid-cols-1' : 'grid-cols-1'
        }`}
      >
        {/* Left Column: Client Credentials Configuration */}
        {/* {!fullWidthView && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 h-fit space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-white">Client GA4 Credentials</h2>
                  <p className="text-[11px] text-slate-400">WeMake Sweets Storefront Stream</p>
                </div>
              </div>
              <button
                onClick={() => setCredentialsOpen(!credentialsOpen)}
                className="text-slate-400 hover:text-white p-1"
                title={credentialsOpen ? 'Collapse form' : 'Expand form'}
              >
                {credentialsOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </div>

            {credentialsOpen && (
              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs pt-1">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">
                    GA4 Measurement ID
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.measurementId}
                    onChange={(e) =>
                      setFormData({ ...formData, measurementId: e.target.value })
                    }
                    placeholder="G-XXXXXXXXXX"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-white focus:outline-none focus:border-pink-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Found in Google Analytics &gt; Admin &gt; Data Streams
                  </span>
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">
                    Google Tag Manager (GTM) ID
                  </label>
                  <input
                    type="text"
                    value={formData.tagManagerId}
                    onChange={(e) =>
                      setFormData({ ...formData, tagManagerId: e.target.value })
                    }
                    placeholder="GTM-XXXXXXX"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">
                    Measurement Protocol API Secret
                  </label>
                  <input
                    type="password"
                    value={formData.apiSecret}
                    onChange={(e) =>
                      setFormData({ ...formData, apiSecret: e.target.value })
                    }
                    placeholder="Enter API Secret"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                  <div>
                    <span className="text-slate-200 font-medium block">
                      Track Storefront Visitors
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Inject tracking snippet to store
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500 cursor-pointer"
                  />
                </div>

                {savedSuccess && (
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Credentials updated & saved!</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg shadow-pink-600/20 transition cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save & Verify Connection</span>
                </button>
              </form>
            )}
          </div>
        )} */}

        {/* Right Section: The 9 GA4 Admin Panel Metric Cards */}
        <div
          className={`space-y-6 ${
            fullWidthView ? 'col-span-1' : 'lg:col-span-2'
          }`}
        >
          {/* Card Section Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>GA4 Overview Metrics</span>
                {loading && (
                  <span className="text-xs font-normal text-pink-400 animate-pulse">
                    (Updating...)
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Displaying 9 core metrics directly mapped from GA4 Data API response
              </p>
            </div>
            <span className="text-xs text-slate-400 font-medium bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
              9 Cards Active
            </span>
          </div>

          {/* Grid of the 9 Cards */}
          <div
            className={`grid gap-4 ${
              fullWidthView
                ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3'
                : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
            }`}
          >
            {gaCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className={`relative overflow-hidden rounded-xl bg-gradient-to-b ${card.gradient} bg-slate-900/90 border border-slate-800 p-4 transition-all duration-200 ${card.hoverBorder} hover:shadow-lg hover:shadow-slate-950/50 group flex flex-col justify-between`}
                >
                  {/* Top: Title & Icon */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="space-y-1">
                        <span className="text-sm font-semibold text-white tracking-tight block">
                          {card.title}
                        </span>
                        {/* GA4 Metric Tag from user specification */}
                        <span className="inline-block font-mono text-[10px] text-slate-400 bg-slate-950/70 border border-slate-800/80 px-1.5 py-0.5 rounded">
                          {card.metricKey}
                        </span>
                      </div>
                      <div
                        className={`p-2 rounded-lg ${card.bgColor} ${card.accentColor} border ${card.borderColor} flex-shrink-0 transition-transform duration-200 group-hover:scale-110`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>

                    {/* Metric Value */}
                    <div className="mt-3">
                      <div className={`text-2xl font-extrabold tracking-tight ${card.accentColor}`}>
                        {card.value}
                      </div>
                    </div>
                  </div>

                  {/* Subtitle / Helper */}
                  <div className="mt-2.5 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
                    {card.subtitle}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Daily Trends Breakdown Section */}
          {trends && trends.length > 0 && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-pink-400" />
                  <h3 className="text-sm font-bold text-white">Daily Traffic & Revenue Trends</h3>
                </div>
                <span className="text-[11px] text-slate-400">Last {trends.length} Days Breakdown</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {trends.slice(-4).map((day, i) => {
                  const formattedDate =
                    day.date && day.date.length === 8
                      ? `${day.date.slice(6, 8)}/${day.date.slice(4, 6)}/${day.date.slice(0, 4)}`
                      : day.date;
                  return (
                    <div
                      key={i}
                      className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-white">{formattedDate}</span>
                        <span className="text-emerald-400 font-medium">₹{day.totalRevenue}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Visitors: <strong className="text-slate-200">{day.activeUsers}</strong></span>
                        <span>Views: <strong className="text-slate-200">{day.screenPageViews}</strong></span>
                      </div>
                      <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                        <div
                          className="bg-pink-500 h-full rounded-full"
                          style={{
                            width: `${Math.min(100, Math.max(15, (day.activeUsers / 300) * 100))}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* If full-width view, display credentials as collapsible bar below */}
          {/* {fullWidthView && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">Client GA4 Credentials Configuration</h3>
                </div>
                <button
                  onClick={() => setCredentialsOpen(!credentialsOpen)}
                  className="text-xs text-pink-400 hover:text-pink-300 transition cursor-pointer flex items-center gap-1"
                >
                  {credentialsOpen ? 'Hide Credentials' : 'Show Credentials'}
                </button>
              </div>

              {credentialsOpen && (
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="text-slate-300 font-medium block mb-1">
                      GA4 Measurement ID
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.measurementId}
                      onChange={(e) =>
                        setFormData({ ...formData, measurementId: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-medium block mb-1">
                      Google Tag Manager ID
                    </label>
                    <input
                      type="text"
                      value={formData.tagManagerId}
                      onChange={(e) =>
                        setFormData({ ...formData, tagManagerId: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-medium block mb-1">
                      API Secret
                    </label>
                    <input
                      type="password"
                      value={formData.apiSecret}
                      onChange={(e) =>
                        setFormData({ ...formData, apiSecret: e.target.value })
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div className="md:col-span-3 flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) =>
                          setFormData({ ...formData, isActive: e.target.checked })
                        }
                        className="w-4 h-4 text-pink-600 rounded cursor-pointer"
                      />
                      <span className="text-slate-300">Track Storefront Visitors (Inject snippet)</span>
                    </div>
                    <button
                      type="submit"
                      className="py-2 px-5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-lg font-semibold flex items-center gap-2 shadow-lg shadow-pink-600/20 transition cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default GoogleAnalyticsIntegration;
