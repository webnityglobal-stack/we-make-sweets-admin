import React, { useState } from 'react';
import { useIntegrations } from '@/hooks/useIntegrations';
import {
  MessageSquare,
  Save,
  CheckCircle2,
  Send,
  Sparkles,
  Smartphone,
  Flame,
  Check,
  CheckCheck,
  Share2,
} from 'lucide-react';

const WhatsAppMarketingIntegration = () => {
  const { waMarketingConfig, updateWAMarketing } = useIntegrations();

  const [formData, setFormData] = useState({
    wabaId: waMarketingConfig?.wabaId || '104928192837461',
    phoneNumberId: waMarketingConfig?.phoneNumberId || '109827364512938',
    accessToken: waMarketingConfig?.accessToken || 'EAABw...ClientPermanentToken...X9',
    businessPhoneNumber: waMarketingConfig?.businessPhoneNumber || '+91 98765 00123',
  });

  const [selectedTemplate, setSelectedTemplate] = useState(
    waMarketingConfig?.templates?.[0] || null
  );
  const [testMobile, setTestMobile] = useState('+91 98765 43210');
  const [testSent, setTestSent] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const stats = waMarketingConfig?.stats || {
    totalBroadcasts: 18,
    messagesSent: 4250,
    messagesDelivered: 4190,
    messagesRead: 3410,
    linkClicks: 820,
    deliveredRate: '98.5%',
    readRate: '81.3%',
    clickRate: '19.5%',
  };

  const templates = waMarketingConfig?.templates || [];

  const handleSave = (e) => {
    e.preventDefault();
    updateWAMarketing({
      ...waMarketingConfig,
      ...formData,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSendTest = () => {
    setTestSent(true);
    setTimeout(() => setTestSent(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            WhatsApp Marketing API
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage Official Meta Cloud API Client Credentials and launch broadcast sweet campaigns
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Meta Cloud API Connected</span>
          </span>
        </div>
      </div>

      {/* Broadcast Performance Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-slate-400">Total Sent</span>
          <div className="text-xl font-bold text-white mt-1">
            {stats.messagesSent.toLocaleString('en-IN')}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">{stats.totalBroadcasts} Campaigns</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-slate-400">Delivered Rate</span>
          <div className="text-xl font-bold text-emerald-400 mt-1">
            {stats.deliveredRate}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">{stats.messagesDelivered} Delivered</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-slate-400">Read Rate</span>
          <div className="text-xl font-bold text-blue-400 mt-1">
            {stats.readRate}
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">{stats.messagesRead} Read</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
          <span className="text-[11px] text-slate-400">Store Clicks</span>
          <div className="text-xl font-bold text-pink-400 mt-1">
            {stats.linkClicks}
          </div>
          <span className="text-[10px] text-pink-300 mt-0.5 block">{stats.clickRate} Click-through</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Client Credentials Form (4 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">WhatsApp Client Credentials</h2>
              <p className="text-xs text-slate-400">Official Meta WhatsApp Cloud API</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 font-medium block mb-1">
                WhatsApp Business Account ID (WABA ID)
              </label>
              <input
                type="text"
                required
                value={formData.wabaId}
                onChange={(e) => setFormData({ ...formData, wabaId: e.target.value })}
                placeholder="104928192837461"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">
                Phone Number ID
              </label>
              <input
                type="text"
                required
                value={formData.phoneNumberId}
                onChange={(e) => setFormData({ ...formData, phoneNumberId: e.target.value })}
                placeholder="109827364512938"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">
                Business Display Phone Number
              </label>
              <input
                type="text"
                value={formData.businessPhoneNumber}
                onChange={(e) => setFormData({ ...formData, businessPhoneNumber: e.target.value })}
                placeholder="+91 98765 00123"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">
                Permanent System User Access Token
              </label>
              <input
                type="password"
                required
                value={formData.accessToken}
                onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
                placeholder="EAABw..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-white focus:outline-none focus:border-pink-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Requires `whatsapp_business_messaging` permission in Meta Business Suite
              </span>
            </div>

            {saveSuccess && (
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>WhatsApp API credentials saved successfully!</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save WhatsApp Credentials</span>
            </button>
          </form>
        </div>

        {/* Campaign Templates & Live WhatsApp Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6">
            <h2 className="text-base font-semibold text-white mb-1">
              Active WhatsApp Sweet Templates
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Select a template to preview its rendering on the customer device
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => setSelectedTemplate(tpl)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                    selectedTemplate?.id === tpl.id
                      ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-950'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                      {tpl.status}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-white truncate">
                    {tpl.name.replace(/_/g, ' ')}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">{tpl.category}</div>
                </div>
              ))}
            </div>

            {/* Live WhatsApp Chat Bubble Preview */}
            <div className="rounded-2xl bg-[#0b141a] p-4 border border-slate-800 relative overflow-hidden shadow-2xl">
              {/* WhatsApp Mock Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-[#222e35] mb-3">
                <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white text-base font-bold shadow">
                  🍬
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>We Make Sweets</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-1 rounded font-normal">
                      Verified Business
                    </span>
                  </div>
                  <div className="text-[10px] text-[#8696a0]">Official Business Account</div>
                </div>
              </div>

              {/* Message Bubble */}
              <div className="max-w-[85%] bg-[#005c4b] text-[#e9edef] rounded-2xl rounded-tl-none p-3 text-xs leading-relaxed shadow relative">
                <div className="whitespace-pre-line font-sans">
                  {selectedTemplate?.content
                    .replace('{{1}}', 'Rahul')
                    .replace('{{2}}', 'https://wemakesweets.com/box') ||
                    'Select a template to view the message.'}
                </div>
                <div className="flex items-center justify-end gap-1 text-[10px] text-[#8696a0] mt-1 text-right">
                  <span>10:45 AM</span>
                  <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                </div>
              </div>

              {/* Action Buttons inside Chat Bubble */}
              <div className="mt-2 flex gap-2">
                <a
                  href="https://wemakesweets.com"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#202c33] text-[#00a884] hover:bg-[#2a3942] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-[#374248]"
                >
                  <span>Claim Sweet Offer</span>
                </a>
              </div>
            </div>

            {/* Send Test Dispatch */}
            <div className="mt-5 p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="w-full sm:w-auto">
                <div className="text-xs font-semibold text-white">Send Instant Test Message</div>
                <div className="text-[10px] text-slate-400">Dispatch template directly to your WhatsApp</div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={testMobile}
                  onChange={(e) => setTestMobile(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 w-36"
                />
                <button
                  onClick={handleSendTest}
                  disabled={testSent}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{testSent ? 'Sent to WhatsApp!' : 'Send Test'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppMarketingIntegration;
