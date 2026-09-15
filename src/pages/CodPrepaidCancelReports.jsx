import React, { useState } from 'react';
import { useReports } from '@/hooks/useReports';
import {
  CreditCard,
  Banknote,
  XCircle,
  AlertTriangle,
  Download,
  CheckCircle2,
  TrendingDown,
  ShieldCheck,
  RotateCcw,
  RefreshCw,
  Calendar,
  Loader2,
  AlertCircle,
  Layers,
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

const CodPrepaidCancelReports = () => {
  const {
    selectedRange,
    setSelectedRange,
    customRange,
    setCustomRange,
    paymentReport,
    isLoading,
    error,
    refresh,
    exportCodCancelCSV,
  } = useReports('7d');

  const [isCustomMode, setIsCustomMode] = useState(false);
  const [startDate, setStartDate] = useState('2026-09-08');
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

  const summary = paymentReport?.summary || {
    cod: { orders: 0, amount: 0, share: 0, successRate: 0, rtoRate: 0 },
    prepaid: { orders: 0, amount: 0, share: 0, successRate: 0, rtoRate: 0 },
    cancelled: { orders: 0, lostValue: 0, percentage: 0 },
    rto: { shipments: 0, rate: 0 },
  };

  const paymentComparison = paymentReport?.paymentComparison || {
    prepaid: { orders: 0, amount: 0, successRate: 0, rtoRate: 0 },
    cod: { orders: 0, amount: 0, successRate: 0, rtoRate: 0 },
  };

  const reasons = paymentReport?.cancellationReasons || [];
  const monthlyTrends = paymentReport?.monthlyTrends || [];
  const filters = paymentReport?.filters || {};

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
          <h1 className="text-2xl font-bold text-white tracking-tight">
            COD / Prepaid / Cancel Reports
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluate payment gateway splits, courier Return To Origin (RTO), and order cancellation metrics
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
            onClick={exportCodCancelCSV}
            className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-lg shadow-pink-600/20 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Breakdown CSV</span>
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

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* COD Orders */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>COD (Cash On Delivery)</span>
            <Banknote className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            ₹{(summary.cod?.amount || 0).toLocaleString('en-IN')}
          </div>
          <div className="flex items-center justify-between text-[11px] text-amber-400 mt-2">
            <span>{summary.cod?.orders || 0} Orders</span>
            <span className="font-semibold">{summary.cod?.share || 0}% Share</span>
          </div>
        </div>

        {/* Prepaid Orders */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Prepaid (UPI / Cards)</span>
            <CreditCard className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            ₹{(summary.prepaid?.amount || 0).toLocaleString('en-IN')}
          </div>
          <div className="flex items-center justify-between text-[11px] text-indigo-300 mt-2">
            <span>{summary.prepaid?.orders || 0} Orders</span>
            <span className="font-semibold">{summary.prepaid?.share || 0}% Share</span>
          </div>
        </div>

        {/* Cancelled Orders */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Cancelled Orders</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400 mt-2">
            {summary.cancelled?.orders || 0} Orders
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
            <span>Lost Value: ₹{(summary.cancelled?.lostValue || 0).toLocaleString('en-IN')}</span>
            <span className="text-rose-400 font-semibold">{summary.cancelled?.percentage || 0}%</span>
          </div>
        </div>

        {/* RTO Rate */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Return To Origin (RTO)</span>
            <RotateCcw className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-yellow-400 mt-2">
            {summary.rto?.rate || 0}%
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            {summary.rto?.shipments || 0} Shipments returned to warehouse
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Modes Comparison */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-white mb-1">
              Payment Mode Reliability Comparison
            </h2>
            <p className="text-xs text-slate-400 mb-5">
              Live breakdown of prepaid vs COD transaction volume and courier reliability
            </p>

            <div className="space-y-4">
              {/* Prepaid Card */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-white">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-indigo-400" />
                    <span>Prepaid - UPI / Cards / Online</span>
                  </div>
                  <span className="text-indigo-400 font-bold">
                    ₹{(paymentComparison.prepaid?.amount || 0).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Orders</span>
                    <span className="font-bold text-white">{paymentComparison.prepaid?.orders || 0}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Success Rate</span>
                    <span className="font-bold text-emerald-400">
                      {paymentComparison.prepaid?.successRate || 100}%
                    </span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">RTO Rate</span>
                    <span className="font-bold text-yellow-400">
                      {paymentComparison.prepaid?.rtoRate || 0}%
                    </span>
                  </div>
                </div>
              </div>

              {/* COD Card */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-white">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-amber-400" />
                    <span>Cash On Delivery (COD)</span>
                  </div>
                  <span className="text-amber-400 font-bold">
                    ₹{(paymentComparison.cod?.amount || 0).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Orders</span>
                    <span className="font-bold text-white">{paymentComparison.cod?.orders || 0}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Success Rate</span>
                    <span className="font-bold text-emerald-400">
                      {paymentComparison.cod?.successRate || 0}%
                    </span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">RTO Rate</span>
                    <span className="font-bold text-yellow-400">
                      {paymentComparison.cod?.rtoRate || 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Insight:</strong> Prepaid orders ensure upfront revenue collection and near-zero courier return rates compared to COD.
            </span>
          </div>
        </div>

        {/* Cancellation Reasons Breakdown */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-white mb-1">
              Cancellation Reasons Root Cause
            </h2>
            <p className="text-xs text-slate-400 mb-5">
              Analysis of cancelled sweet orders in {rangeLabel}
            </p>

            {reasons.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                No order cancellations recorded in this timeframe.
              </div>
            ) : (
              <div className="space-y-4">
                {reasons.map((r, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 truncate max-w-[260px]">{r.reason}</span>
                      <span className="text-slate-400 font-semibold font-mono">
                        {r.orders} {r.orders === 1 ? 'order' : 'orders'} ({r.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-rose-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, Math.max(8, r.percentage))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active timeframe footer */}
          <div className="mt-8 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Filter: {rangeLabel}</span>
            <span>
              {filters.startDate && filters.endDate
                ? `${formatDateDisplay(filters.startDate)} — ${formatDateDisplay(filters.endDate)}`
                : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Monthly / Historical Trends Breakdown */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-white">Monthly Breakdown Trends</h2>
            <p className="text-xs text-slate-400">Historical performance across payment modes and cancellations</p>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {monthlyTrends.length} Month(s) Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 bg-slate-950/40">
              <tr>
                <th className="py-2.5 px-4">Period</th>
                <th className="py-2.5 px-4">Prepaid Orders</th>
                <th className="py-2.5 px-4">Prepaid Revenue</th>
                <th className="py-2.5 px-4">COD Orders</th>
                <th className="py-2.5 px-4">COD Revenue</th>
                <th className="py-2.5 px-4">Cancelled Orders</th>
                <th className="py-2.5 px-4">Lost Value</th>
                <th className="py-2.5 px-4">RTO Shipments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {monthlyTrends.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 text-xs">
                    No monthly trend entries found.
                  </td>
                </tr>
              ) : (
                monthlyTrends.map((m, i) => (
                  <tr key={i} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-semibold text-white">{m.month}</td>
                    <td className="py-3 px-4 text-indigo-400 font-mono">{m.prepaidOrders || 0}</td>
                    <td className="py-3 px-4 text-white font-mono font-medium">
                      ₹{(m.prepaidAmount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-amber-400 font-mono">{m.codOrders || 0}</td>
                    <td className="py-3 px-4 text-white font-mono font-medium">
                      ₹{(m.codAmount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-rose-400 font-mono">{m.cancelledOrders || 0}</td>
                    <td className="py-3 px-4 text-rose-400/90 font-mono font-medium">
                      ₹{(m.cancelledAmount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-yellow-400 font-mono">{m.rtoOrders || 0}</td>
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

export default CodPrepaidCancelReports;

