import React, { useState } from 'react';
import { useIntegrations } from '@/hooks/useIntegrations';
import {
  BarChart3,
  Save,
  CheckCircle2,
  Users,
  Activity,
  Globe,
  Radio,
  ShoppingBag,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

const GoogleAnalyticsIntegration = () => {
  const { gaConfig, updateGA } = useIntegrations();

  const [formData, setFormData] = useState({
    measurementId: gaConfig?.measurementId || 'G-9K382LM982',
    tagManagerId: gaConfig?.tagManagerId || 'GTM-WMS994',
    apiSecret: gaConfig?.apiSecret || 'wms_sec_k9284j82194m',
    isActive: gaConfig?.isActive ?? true,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateGA({
      ...gaConfig,
      ...formData,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const activeChannels = gaConfig?.activeChannels || [];
  const funnel = gaConfig?.ecommerceFunnel || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Google Analytics Integration
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure Google Analytics 4 (GA4) measurement keys and observe real-time storefront traffic
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>GA4 Live Stream Active</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Credentials Configuration */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Client GA4 Credentials</h2>
              <p className="text-xs text-slate-400">Connected to WeMake Sweets domain</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 font-medium block mb-1">
                GA4 Measurement ID
              </label>
              <input
                type="text"
                required
                value={formData.measurementId}
                onChange={(e) => setFormData({ ...formData, measurementId: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, tagManagerId: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, apiSecret: e.target.value })}
                placeholder="Enter API Secret"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <div>
                <span className="text-slate-200 font-semibold block">Track Storefront Visitors</span>
                <span className="text-[10px] text-slate-400">Inject tracking snippet to store</span>
              </div>
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
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
        </div>

        {/* Right Columns: Live Analytics Simulation Dashboard */}
        <div className="lg:col-span-2 space-y-6">
          {/* Realtime KPI Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-semibold text-white">Live Storefront Realtime</h2>
              </div>
              <span className="text-xs text-slate-400">Past 30 minutes</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-extrabold text-white">
                {gaConfig?.realtimeVisitors || 28}
              </span>
              <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Active customers shopping right now</span>
              </span>
            </div>

            {/* Traffic Sources */}
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Top Acquisition Channels
              </div>
              {activeChannels.map((src, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">{src.channel}</span>
                    <span className="text-slate-400 font-medium">
                      {src.visitors} users ({src.percent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-400 h-full rounded-full"
                      style={{ width: `${src.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* E-Commerce Funnel */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-pink-400" />
                <h2 className="text-base font-semibold text-white">E-Commerce Funnel Conversion</h2>
              </div>
              <span className="text-xs text-pink-400 font-semibold">7.9% Overall Conversion</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {funnel.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center space-y-1 relative"
                >
                  <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                    {step.step}
                  </span>
                  <span className="text-lg font-bold text-white block">{step.count}</span>
                  <span className="text-[10px] text-emerald-400 font-medium block">
                    {step.rate}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleAnalyticsIntegration;
