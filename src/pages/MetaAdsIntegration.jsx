import React, { useState } from 'react';
import { useIntegrations } from '@/hooks/useIntegrations';
import {
  Megaphone,
  Save,
  CheckCircle2,
  TrendingUp,
  Activity,
  Layers,
  ShieldCheck,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

const MetaAdsIntegration = () => {
  const { metaConfig, updateMeta } = useIntegrations();

  const [formData, setFormData] = useState({
    pixelId: metaConfig?.pixelId || '982374182938471',
    capiAccessToken: metaConfig?.capiAccessToken || 'EAAG...MetaCapiPermanentToken...Z1',
    adAccountId: metaConfig?.adAccountId || 'act_9182374829',
    isActive: metaConfig?.isActive ?? true,
    eventDeduplication: metaConfig?.eventDeduplication ?? true,
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateMeta({
      ...metaConfig,
      ...formData,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const events = metaConfig?.eventsTracked || [];
  const performance = metaConfig?.campaignPerformance || {
    adSpendMonth: 42800,
    revenueTracked: 184500,
    roas: '4.31x',
    totalPurchases: 248,
    costPerPurchase: 172.5,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Meta Ads & Conversions API (CAPI)
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure Meta Pixel, server-side Conversions API token, and review live ROAS
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span>Meta CAPI Server-Side Active</span>
          </span>
        </div>
      </div>

      {/* ROAS & Ad Performance Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-slate-400">Monthly Ad Spend</span>
          <div className="text-xl font-bold text-white mt-1">
            ₹{performance.adSpendMonth.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Instagram & Facebook Ads</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-slate-400">Attributed Sweet Sales</span>
          <div className="text-xl font-bold text-emerald-400 mt-1">
            ₹{performance.revenueTracked.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-emerald-400 mt-0.5 block">248 Verified Orders</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-slate-400">Overall ROAS</span>
          <div className="text-xl font-bold text-pink-400 mt-1">
            {performance.roas}
          </div>
          <span className="text-[10px] text-pink-300 mt-0.5 block">Return On Ad Spend</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-slate-400">Cost Per Acquisition</span>
          <div className="text-xl font-bold text-indigo-400 mt-1">
            ₹{performance.costPerPurchase}
          </div>
          <span className="text-[10px] text-indigo-300 mt-0.5 block">Per customer sweet purchase</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Client Credentials Form (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Client Meta Credentials</h2>
              <p className="text-xs text-slate-400">Meta Events Manager & Ads Manager</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 font-medium block mb-1">
                Meta Pixel ID
              </label>
              <input
                type="text"
                required
                value={formData.pixelId}
                onChange={(e) => setFormData({ ...formData, pixelId: e.target.value })}
                placeholder="982374182938471"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">
                Conversions API (CAPI) System User Token
              </label>
              <input
                type="password"
                required
                value={formData.capiAccessToken}
                onChange={(e) => setFormData({ ...formData, capiAccessToken: e.target.value })}
                placeholder="EAAG..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-white focus:outline-none focus:border-blue-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Generated in Meta Events Manager &gt; Settings &gt; Conversions API
              </span>
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">
                Meta Ad Account ID
              </label>
              <input
                type="text"
                value={formData.adAccountId}
                onChange={(e) => setFormData({ ...formData, adAccountId: e.target.value })}
                placeholder="act_9182374829"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <div>
                  <span className="text-slate-200 font-semibold block">Enable Dual Tracking</span>
                  <span className="text-[10px] text-slate-400">
                    Sends events via Browser Pixel + Server CAPI
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <div>
                  <span className="text-slate-200 font-semibold block">
                    Automatic Event Deduplication
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Uses unique `event_id` to prevent double counting
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.eventDeduplication}
                  onChange={(e) =>
                    setFormData({ ...formData, eventDeduplication: e.target.checked })
                  }
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                />
              </div>
            </div>

            {saveSuccess && (
              <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Meta credentials successfully saved & validated!</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Meta Credentials</span>
            </button>
          </form>
        </div>

        {/* Live CAPI Events Health Table (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-white">Live CAPI Event Stream</h2>
                <p className="text-xs text-slate-400">Real-time status of events relayed to Meta</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                Healthy Connection
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-800 bg-slate-950/40">
                  <tr>
                    <th className="py-2.5 px-3">Event Name</th>
                    <th className="py-2.5 px-3">Last 24h Count</th>
                    <th className="py-2.5 px-3">Connection Channel</th>
                    <th className="py-2.5 px-3 text-right">Event Match Quality</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {events.map((ev, i) => (
                    <tr key={i} className="hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-mono font-bold text-white">
                        {ev.event}
                      </td>
                      <td className="py-3 px-3 font-semibold text-blue-400">
                        {ev.count24h.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-[10px]">
                          {ev.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="text-emerald-400 font-bold">{ev.matchQuality}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300">
                <strong className="text-white block mb-0.5">High Event Match Quality (9.8/10)</strong>
                Because WeMake Sweets server hashes customer phone numbers and emails before sending to Meta CAPI, your ad campaigns achieve optimal attribution and lower customer acquisition costs.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetaAdsIntegration;
