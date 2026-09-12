import React from 'react';
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
} from 'lucide-react';

const CodPrepaidCancelReports = () => {
  const { paymentReport, exportCodCancelCSV } = useReports();

  const summary = paymentReport?.summary || {
    totalOrders: 320,
    codOrders: 180,
    prepaidOrders: 140,
    cancelledOrders: 28,
    rtoCount: 14,
    codRevenue: 134200,
    prepaidRevenue: 121800,
    cancelledLoss: 21500,
    codSharePercent: 56.2,
    prepaidSharePercent: 43.8,
    rtoRatePercent: 7.7,
    cancellationRatePercent: 8.75,
  };

  const breakdowns = paymentReport?.paymentStatusBreakdown || [];
  const reasons = paymentReport?.cancellationReasons || [];
  const monthlyTrends = paymentReport?.monthlyTrends || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            COD / Prepaid / Cancel Reports
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluate payment gateway splits, courier Return To Origin (RTO), and order cancellation reasons
          </p>
        </div>

        <button
          onClick={exportCodCancelCSV}
          className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-lg shadow-pink-600/20 transition cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Breakdown CSV</span>
        </button>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* COD Orders */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>COD (Cash On Delivery)</span>
            <Banknote className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            ₹{summary.codRevenue.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center justify-between text-[11px] text-amber-400 mt-2">
            <span>{summary.codOrders} Orders</span>
            <span className="font-semibold">{summary.codSharePercent}% Share</span>
          </div>
        </div>

        {/* Prepaid Orders */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Prepaid (UPI / Cards)</span>
            <CreditCard className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            ₹{summary.prepaidRevenue.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center justify-between text-[11px] text-indigo-300 mt-2">
            <span>{summary.prepaidOrders} Orders</span>
            <span className="font-semibold">{summary.prepaidSharePercent}% Share</span>
          </div>
        </div>

        {/* Cancelled Orders */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Cancelled Orders</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-400 mt-2">
            {summary.cancelledOrders} Orders
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
            <span>Lost Value: ₹{summary.cancelledLoss.toLocaleString('en-IN')}</span>
            <span className="text-rose-400 font-medium">{summary.cancellationRatePercent}%</span>
          </div>
        </div>

        {/* RTO Rate */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Return To Origin (RTO)</span>
            <RotateCcw className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-yellow-400 mt-2">
            {summary.rtoRatePercent}%
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            {summary.rtoCount} Shipments returned to warehouse
          </div>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Modes Comparison */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6">
          <h2 className="text-base font-semibold text-white mb-1">
            Payment Mode Reliability Comparison
          </h2>
          <p className="text-xs text-slate-400 mb-5">
            Prepaid orders experience drastically lower RTO compared to COD
          </p>

          <div className="space-y-4">
            {breakdowns.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-white">
                  <span>{item.mode}</span>
                  <span className="text-pink-400">₹{item.amount.toLocaleString('en-IN')}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Orders</span>
                    <span className="font-bold text-white">{item.count}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Success Rate</span>
                    <span className="font-bold text-emerald-400">{item.successRate}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">RTO Rate</span>
                    <span className="font-bold text-yellow-400">{item.rtoRate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Recommendation:</strong> Use the integrated WhatsApp Bot to verify COD orders before dispatch to cut COD RTO by over 45%.
            </span>
          </div>
        </div>

        {/* Cancellation Reasons Breakdown */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6">
          <h2 className="text-base font-semibold text-white mb-1">
            Cancellation Reasons Root Cause
          </h2>
          <p className="text-xs text-slate-400 mb-5">
            Analysis of 28 cancelled sweet orders across last 30 days
          </p>

          <div className="space-y-4">
            {reasons.map((r, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 truncate max-w-[280px]">{r.reason}</span>
                  <span className="text-slate-400 font-semibold">{r.count} ({r.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full"
                    style={{ width: `${r.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800">
            <div className="text-xs font-semibold text-slate-300 mb-3">Monthly Trends</div>
            <div className="grid grid-cols-5 gap-2 text-center text-[10px]">
              {monthlyTrends.map((m, i) => (
                <div key={i} className="p-2 rounded bg-slate-950 border border-slate-800">
                  <div className="font-semibold text-slate-200">{m.month}</div>
                  <div className="text-amber-400 mt-1">COD: {m.cod}</div>
                  <div className="text-indigo-400">Prep: {m.prepaid}</div>
                  <div className="text-rose-400">Canc: {m.cancel}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodPrepaidCancelReports;
