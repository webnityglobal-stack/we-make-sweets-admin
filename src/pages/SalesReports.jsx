import React, { useState } from 'react';
import { useReports } from '@/hooks/useReports';
import {
  TrendingUp,
  Download,
  Calendar,
  DollarSign,
  ShoppingCart,
  Percent,
  Layers,
  ArrowUpRight,
  RefreshCw,
  AlertCircle,
  XCircle,
  Package,
  CheckCircle2,
  Tag,
  Loader2,
} from 'lucide-react';

const formatDateDisplay = (dateStr) => {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('T')[0].split('-');
    if (parts.length === 3) {
      const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      const month = monthNames[parseInt(parts[1], 10) - 1];
      const day = parseInt(parts[2], 10);
      return `${day} ${month}`;
    }
  } catch (_) {}
  return dateStr;
};

const formatFullDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
  } catch (_) {}
  return dateStr;
};

const SalesReports = () => {
  const {
    selectedRange,
    setSelectedRange,
    customRange,
    setCustomRange,
    salesReport,
    isLoading,
    error,
    refresh,
    exportSalesCSV,
  } = useReports('7d');

  const [isCustomMode, setIsCustomMode] = useState(false);
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-09-15');

  const handleSelectRange = (range) => {
    setIsCustomMode(false);
    setCustomRange(null);
    setSelectedRange(range);
  };

  const handleApplyCustom = () => {
    if (!startDate || !endDate) return;
    setIsCustomMode(true);
    setCustomRange({
      startDate,
      endDate,
    });
    setSelectedRange('custom');
  };

  const summary = salesReport?.summary || {
    grossSales: 0,
    netRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    cancelledOrders: 0,
    cancelledAmount: 0,
    refundedAmount: 0,
  };

  const trajectory = salesReport?.revenueTrajectory || [];
  const topProducts = salesReport?.topSellingItems || [];
  const discounts = salesReport?.discounts || { totalDiscount: 0, couponDiscount: 0 };
  const timeframe = salesReport?.timeframe || {};

  const rangeLabel = isCustomMode
    ? `${formatDateDisplay(startDate)} — ${formatDateDisplay(endDate)}`
    : selectedRange === 'today'
    ? 'Today'
    : selectedRange === '15d'
    ? 'Last 15 Days'
    : selectedRange === '30d'
    ? 'Last 30 Days'
    : 'Last 7 Days';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Sales Reports</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Analyze store revenue, daily volume trends, cancelled orders, and coupon discounts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refresh}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition cursor-pointer disabled:opacity-50"
            title="Sync live data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-pink-400' : ''}`} />
            <span>Sync Live</span>
          </button>

          <button
            onClick={exportSalesCSV}
            className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-lg shadow-pink-600/20 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Sales CSV</span>
          </button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-pink-400" />
            Timeframe:
          </span>

          <button
            onClick={() => handleSelectRange('today')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              !isCustomMode && selectedRange === 'today'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Today
          </button>

          <button
            onClick={() => handleSelectRange('7d')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              !isCustomMode && selectedRange === '7d'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Last 7 Days
          </button>

          <button
            onClick={() => handleSelectRange('15d')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              !isCustomMode && selectedRange === '15d'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Last 15 Days
          </button>

          <button
            onClick={() => handleSelectRange('30d')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              !isCustomMode && selectedRange === '30d'
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Last 30 Days
          </button>

          <button
            onClick={() => setIsCustomMode(true)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              isCustomMode
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Custom Range
          </button>
        </div>

        {/* Custom Range Picker */}
        {isCustomMode && (
          <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            />
            <span className="text-slate-500 text-xs">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={handleApplyCustom}
              className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-lg cursor-pointer"
            >
              Apply
            </button>
          </div>
        )}
      </div>

      {/* Error message banner */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={refresh}
            className="text-rose-300 hover:text-white underline font-semibold text-xs cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Sales */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Gross Sales</span>
            <DollarSign className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            ₹{(summary.grossSales || 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-pink-400/80 mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Total sales before deductions</span>
          </div>
        </div>

        {/* Net Revenue */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Net Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            ₹{(summary.netRevenue || 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Actual collected / receivable</span>
          </div>
        </div>

        {/* Orders Volume */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Orders</span>
            <ShoppingCart className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            {summary.totalOrders || 0}
          </div>
          <div className="text-[11px] text-indigo-400 mt-1">
            Avg {trajectory.length > 0 ? (summary.totalOrders / trajectory.length).toFixed(1) : 0} orders / day
          </div>
        </div>

        {/* AOV */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Avg Order Value (AOV)</span>
            <Percent className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            ₹{(summary.averageOrderValue || 0).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-amber-400 mt-1">
            Discounts: ₹{(discounts.totalDiscount || 0).toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Cancelled Orders</span>
          <div className="text-base font-bold text-rose-400 mt-1">
            {summary.cancelledOrders || 0}{' '}
            <span className="text-xs font-normal text-slate-400">
              (₹{(summary.cancelledAmount || 0).toLocaleString('en-IN')})
            </span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Discounts</span>
          <div className="text-base font-bold text-amber-400 mt-1">
            ₹{(discounts.totalDiscount || 0).toLocaleString('en-IN')}
          </div>
          {discounts.couponDiscount > 0 && (
            <span className="text-[10px] text-slate-500 block">
              Coupons: ₹{discounts.couponDiscount.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Refunded Amount</span>
          <div className="text-base font-bold text-slate-200 mt-1">
            ₹{(summary.refundedAmount || 0).toLocaleString('en-IN')}
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Active Window</span>
          <div className="text-xs font-semibold text-slate-200 mt-1 truncate">
            {timeframe.startDate && timeframe.endDate
              ? `${formatDateDisplay(timeframe.startDate)} — ${formatDateDisplay(timeframe.endDate)}`
              : rangeLabel}
          </div>
        </div>
      </div>

      {/* Chart & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Revenue Trajectory</h2>
              <p className="text-xs text-slate-400">
                Daily sales for {rangeLabel}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span> Gross
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Net
              </span>
            </div>
          </div>

          {isLoading ? (
            <div className="h-64 flex items-center justify-center text-slate-500 gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-pink-500" />
              <span className="text-xs">Loading trajectory data...</span>
            </div>
          ) : trajectory.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-500 text-xs">
              No revenue data recorded for this timeframe.
            </div>
          ) : (
            /* Dynamic SVG Bar Chart */
            <div className="h-64 flex items-end justify-between gap-1 pt-6 px-2 overflow-x-auto">
              {trajectory.map((item, idx) => {
                const maxVal = Math.max(...trajectory.map((t) => Math.max(t.gross || 0, t.net || 0)), 1);
                const heightPercent = Math.max(8, Math.round(((item.gross || 0) / maxVal) * 100));
                const netHeight = Math.max(6, Math.round(((item.net || 0) / maxVal) * 100));

                return (
                  <div key={idx} className="flex-1 min-w-[28px] flex flex-col items-center gap-2 group relative">
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-14 bg-slate-950 text-white text-[10px] py-1.5 px-2.5 rounded-lg border border-slate-700 pointer-events-none whitespace-nowrap z-20 shadow-xl">
                      <div className="font-semibold text-slate-200">{formatDateDisplay(item.date)}</div>
                      <div className="text-pink-400 font-medium">Gross: ₹{(item.gross || 0).toLocaleString('en-IN')}</div>
                      <div className="text-emerald-400 font-medium">Net: ₹{(item.net || 0).toLocaleString('en-IN')}</div>
                      <div className="text-indigo-400">Orders: {item.orders || 0}</div>
                    </div>

                    <div className="w-full flex items-end justify-center gap-0.5 h-44">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-2 sm:w-3 bg-pink-600/80 group-hover:bg-pink-500 rounded-t transition"
                      />
                      <div
                        style={{ height: `${netHeight}%` }}
                        className="w-2 sm:w-3 bg-emerald-500/80 group-hover:bg-emerald-400 rounded-t transition"
                      />
                    </div>

                    <span className="text-[10px] text-slate-400 truncate max-w-[36px] text-center font-mono">
                      {formatDateDisplay(item.date)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Performing Sweet Packs */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-white mb-1">Top Selling Items</h2>
            <p className="text-xs text-slate-400 mb-4">Highest revenue contributors in this period</p>

            {isLoading ? (
              <div className="py-12 flex items-center justify-center text-slate-500 gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-pink-500" />
                <span className="text-xs">Loading items...</span>
              </div>
            ) : topProducts.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                No sweet items sold in this timeframe.
              </div>
            ) : (
              <div className="space-y-4">
                {topProducts.map((item, idx) => {
                  const share = summary.netRevenue > 0
                    ? Math.round((item.revenue / summary.netRevenue) * 100)
                    : 0;

                  return (
                    <div key={idx} className="p-3.5 rounded-lg bg-slate-800/40 border border-slate-700/50">
                      <div className="flex items-center justify-between text-xs font-semibold text-white">
                        <span className="truncate max-w-[160px]">{item.productName}</span>
                        <span className="text-emerald-400">₹{(item.revenue || 0).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                        <span>{item.quantitySold || 0} units ordered</span>
                        <span>{share}% of sales</span>
                      </div>
                      <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-pink-500 to-rose-500 h-full rounded-full"
                          style={{
                            width: `${Math.min(100, Math.max(5, share))}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 text-center">
            Updated continuously from live order dispatches
          </div>
        </div>
      </div>

      {/* Daily Breakdown Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-semibold text-white">Daily Breakdown Log</h2>
            <p className="text-xs text-slate-400">Day-by-day record of order volumes and revenue</p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {trajectory.length} Day(s) Recorded
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 bg-slate-950/40">
              <tr>
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4">Orders Count</th>
                <th className="py-2.5 px-4">Gross Revenue</th>
                <th className="py-2.5 px-4">Net Revenue</th>
                <th className="py-2.5 px-4">Daily AOV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {trajectory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">
                    No breakdown entries found.
                  </td>
                </tr>
              ) : (
                trajectory.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40 transition">
                    <td className="py-2.5 px-4 font-medium text-white">
                      {formatFullDate(row.date)}
                    </td>
                    <td className="py-2.5 px-4 text-slate-300 font-mono">{row.orders || 0}</td>
                    <td className="py-2.5 px-4 text-pink-400 font-semibold font-mono">
                      ₹{(row.gross || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-4 text-emerald-400 font-semibold font-mono">
                      ₹{(row.net || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-4 text-white font-mono">
                      ₹{row.orders > 0 ? Math.round((row.net || 0) / row.orders).toLocaleString('en-IN') : 0}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesReports;

