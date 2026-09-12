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
} from 'lucide-react';

const SalesReports = () => {
  const {
    selectedDays,
    setSelectedDays,
    customRange,
    setCustomRange,
    salesReport,
    isLoading,
    exportSalesCSV,
  } = useReports(7);

  const [isCustomMode, setIsCustomMode] = useState(false);
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-09-11');

  const handleSelectDays = (days) => {
    setIsCustomMode(false);
    setCustomRange(null);
    setSelectedDays(days);
  };

  const handleApplyCustom = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 7;

    setIsCustomMode(true);
    setCustomRange({
      start: startDate,
      end: endDate,
      daysCount: Math.min(60, Math.max(2, diffDays)),
    });
  };

  const report = salesReport || {
    totalGrossSales: 0,
    netRevenue: 0,
    totalOrders: 0,
    totalDiscounts: 0,
    averageOrderValue: 0,
    timeline: [],
    topProducts: [],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Sales Reports</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Analyze store revenue, daily volume trends, and coupon discounts across periods
          </p>
        </div>

        <button
          onClick={exportSalesCSV}
          className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-lg shadow-pink-600/20 transition cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Sales CSV</span>
        </button>
      </div>

      {/* Date Range Selector (Proposal: 7/15/30 Days & Custom) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-pink-400" />
            Timeframe:
          </span>

          <button
            onClick={() => handleSelectDays(7)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              !isCustomMode && selectedDays === 7
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Last 7 Days
          </button>

          <button
            onClick={() => handleSelectDays(15)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              !isCustomMode && selectedDays === 15
                ? 'bg-pink-600 text-white shadow-md shadow-pink-600/20'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Last 15 Days
          </button>

          <button
            onClick={() => handleSelectDays(30)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              !isCustomMode && selectedDays === 30
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
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
            />
            <span className="text-slate-500 text-xs">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Sales */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Gross Sales</span>
            <DollarSign className="w-4 h-4 text-pink-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            ₹{report.totalGrossSales.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Before discounts & coupons</span>
          </div>
        </div>

        {/* Net Revenue */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Net Revenue</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            ₹{report.netRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Actual collected / receivable
          </div>
        </div>

        {/* Orders Volume */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Orders</span>
            <ShoppingCart className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            {report.totalOrders}
          </div>
          <div className="text-[11px] text-indigo-400 mt-1">
            Avg {Math.round(report.totalOrders / (report.timeline?.length || 1))} orders / day
          </div>
        </div>

        {/* AOV */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Avg Order Value (AOV)</span>
            <Percent className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            ₹{report.averageOrderValue}
          </div>
          <div className="text-[11px] text-amber-400 mt-1">
            Discounts: ₹{report.totalDiscounts.toLocaleString('en-IN')}
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
                Daily sales for {report.period}
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

          {/* Dynamic SVG Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-1 pt-6 px-2 overflow-x-auto">
            {report.timeline?.map((item, idx) => {
              const maxVal = Math.max(...report.timeline.map((t) => t.grossSales), 1);
              const heightPercent = Math.max(12, Math.round((item.grossSales / maxVal) * 100));
              const netHeight = Math.max(8, Math.round((item.netSales / maxVal) * 100));

              return (
                <div key={idx} className="flex-1 min-w-[28px] flex flex-col items-center gap-2 group relative">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 bg-slate-950 text-white text-[10px] py-1 px-2 rounded border border-slate-700 pointer-events-none whitespace-nowrap z-20 shadow-lg">
                    <div>{item.date}</div>
                    <div className="text-pink-400">Gross: ₹{item.grossSales}</div>
                    <div className="text-emerald-400">Orders: {item.orders}</div>
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

                  <span className="text-[10px] text-slate-400 truncate max-w-[32px] text-center">
                    {item.date}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Performing Sweet Packs */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-white mb-1">Top Selling Items</h2>
            <p className="text-xs text-slate-400 mb-4">Highest revenue contributors in this period</p>

            <div className="space-y-4">
              {report.topProducts?.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-lg bg-slate-800/40 border border-slate-700/50">
                  <div className="flex items-center justify-between text-xs font-semibold text-white">
                    <span className="truncate">{item.name}</span>
                    <span className="text-emerald-400">₹{item.revenue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>{item.unitsSold} units ordered</span>
                    <span>
                      {Math.round((item.revenue / (report.netRevenue || 1)) * 100)}% of sales
                    </span>
                  </div>
                  <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-rose-500 h-full rounded-full"
                      style={{
                        width: `${Math.min(100, Math.round((item.revenue / (report.netRevenue || 1)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 text-center">
            Updated continuously based on live order dispatches
          </div>
        </div>
      </div>

      {/* Daily Breakdown Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6">
        <h2 className="text-base font-semibold text-white mb-3">Daily Breakdown Log</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 bg-slate-950/40">
              <tr>
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4">Orders Count</th>
                <th className="py-2.5 px-4">Gross Revenue</th>
                <th className="py-2.5 px-4">Discounts Given</th>
                <th className="py-2.5 px-4">Net Revenue</th>
                <th className="py-2.5 px-4">Daily AOV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {report.timeline?.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-4 font-medium text-white">{row.date}</td>
                  <td className="py-2.5 px-4 text-slate-300">{row.orders}</td>
                  <td className="py-2.5 px-4 text-pink-400 font-semibold">₹{row.grossSales}</td>
                  <td className="py-2.5 px-4 text-slate-400">₹{row.discounts}</td>
                  <td className="py-2.5 px-4 text-emerald-400 font-semibold">₹{row.netSales}</td>
                  <td className="py-2.5 px-4 text-white">
                    ₹{row.orders > 0 ? Math.round(row.netSales / row.orders) : 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SalesReports;
