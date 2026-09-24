import React, { useState } from 'react';
import { useIntegrations } from '@/hooks/useIntegrations';
import {
  Bot,
  Save,
  CheckCircle2,
  Send,
  Sparkles,
  Truck,
  ShieldCheck,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';

const WhatsAppBotIntegration = () => {
  const { waBotConfig, updateWABot } = useIntegrations();

  const [formData, setFormData] = useState({
    webhookUrl: waBotConfig?.webhookUrl || 'https://wemakesweets-backend.onrender.com/api/webhook/whatsapp',
    verifyToken: waBotConfig?.verifyToken || 'wemake_bot_secure_token_2026',
    botName: waBotConfig?.botName || 'Mithai Mitra (WeMake Sweets Bot)',
    greetingMessage:
      waBotConfig?.greetingMessage ||
      'Namaste! Welcome to WeMake Sweets. How can I assist you today? 🍬\n1. Track Order 📦\n2. View Sweet Catalog 🍯\n3. Confirm COD Order ✅\n4. Talk to Support 💬',
    autoConfirmCod: waBotConfig?.autoConfirmCod ?? true,
    autoSendTracking: waBotConfig?.autoSendTracking ?? true,
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  // Simulator Chat State
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Namaste! Welcome to WeMake Sweets. How can I assist you today? 🍬\n\n1️⃣ Track Order 📦\n2️⃣ Confirm COD Order ✅\n3️⃣ Ingredients & Sugar-Free FAQ 🍯',
      time: '11:00 AM',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    updateWABot({
      ...waBotConfig,
      ...formData,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    const userMsg = {
      sender: 'user',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');

    // Dynamic Bot Reply Logic
    setTimeout(() => {
      let reply = "I'm your WeMake Sweets automated concierge. You can type 'track', 'cod', or 'sugar free' to test automated workflows!";
      const lower = userText.toLowerCase();

      if (lower.includes('track') || lower.includes('order') || lower.includes('1')) {
        reply = '📦 Your Order WMS-1082 (Ultimate Snack Box) has been dispatched via Delhivery Air! AWB: SR109283741. Current status: Out for delivery today by 6 PM.';
      } else if (lower.includes('cod') || lower.includes('confirm') || lower.includes('2')) {
        reply = '✅ COD Order ORD-94811 Confirmed! Your package will be packed today with fresh sweets. Keep ₹649 cash or UPI ready at delivery.';
      } else if (lower.includes('sugar') || lower.includes('sweet') || lower.includes('ingredient') || lower.includes('3')) {
        reply = '🍯 All WeMake Sweets treats are crafted with 100% natural premium dates, roasted nuts, and multi-seeds. ZERO refined sugar, zero artificial preservatives, and zero palm oil!';
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            WhatsApp Bot Configuration
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure automated customer support, COD confirmation dialogues, and live shipment tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            <span>Bot Webhook Active</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Settings Form (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Bot Webhook & Triggers</h2>
              <p className="text-xs text-slate-400">Meta Webhooks endpoint integration</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 font-medium block mb-1">
                Webhook Callback URL
              </label>
              <input
                type="text"
                required
                value={formData.webhookUrl}
                onChange={(e) => setFormData({ ...formData, webhookUrl: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">
                Webhook Verify Token
              </label>
              <input
                type="text"
                required
                value={formData.verifyToken}
                onChange={(e) => setFormData({ ...formData, verifyToken: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">
                Bot Assistant Name
              </label>
              <input
                type="text"
                value={formData.botName}
                onChange={(e) => setFormData({ ...formData, botName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">
                Default Greeting Message
              </label>
              <textarea
                rows={3}
                value={formData.greetingMessage}
                onChange={(e) => setFormData({ ...formData, greetingMessage: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-teal-500 font-sans"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <div>
                  <span className="text-slate-200 font-semibold block">
                    Automated COD Order Confirmation
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Reduces RTO by verifying address before dispatch
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.autoConfirmCod}
                  onChange={(e) => setFormData({ ...formData, autoConfirmCod: e.target.checked })}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <div>
                  <span className="text-slate-200 font-semibold block">
                    Instant AWB Tracking Lookup
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Responds to customer queries with live Delhivery / BlueDart status
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.autoSendTracking}
                  onChange={(e) => setFormData({ ...formData, autoSendTracking: e.target.checked })}
                  className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 cursor-pointer"
                />
              </div>
            </div>

            {saveSuccess && (
              <div className="p-2.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Bot configuration successfully saved!</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg shadow-teal-600/20 transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Bot Configuration</span>
            </button>
          </form>
        </div>

        {/* Right Column: Live Bot Simulator (6 cols) */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-white">Interactive Bot Simulator</h2>
                <p className="text-xs text-slate-400">Test how the chatbot replies to customer inputs</p>
              </div>
              <button
                onClick={() =>
                  setMessages([
                    {
                      sender: 'bot',
                      text: formData.greetingMessage,
                      time: '11:00 AM',
                    },
                  ])
                }
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Chat</span>
              </button>
            </div>

            {/* Simulated WhatsApp Phone Frame */}
            <div className="rounded-2xl bg-[#0b141a] border border-slate-800 flex flex-col h-[400px] overflow-hidden shadow-2xl">
              {/* WhatsApp Header */}
              <div className="bg-[#202c33] p-3 flex items-center gap-3 border-b border-[#2d383f]">
                <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-bold">
                  🍬
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-tight">
                    {formData.botName}
                  </div>
                  <div className="text-[10px] text-teal-400">Online • Automated Assistant</div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-3.5 space-y-3 overflow-y-auto bg-[#0d171d]">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-xl p-2.5 text-xs leading-relaxed shadow ${
                        msg.sender === 'user'
                          ? 'bg-[#005c4b] text-white rounded-tr-none'
                          : 'bg-[#202c33] text-slate-200 rounded-tl-none border border-[#2d383f]'
                      }`}
                    >
                      <div className="whitespace-pre-line">{msg.text}</div>
                      <div className="text-[9px] text-[#8696a0] text-right mt-1">{msg.time}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Bar */}
              <form
                onSubmit={handleSendMessage}
                className="bg-[#202c33] p-2 flex items-center gap-2 border-t border-[#2d383f]"
              >
                <input
                  type="text"
                  placeholder="Type 'track', 'cod', or 'sugar free'..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 bg-[#2a3942] border-none rounded-lg px-3 py-2 text-xs text-white placeholder-[#8696a0] focus:outline-none"
                />
                <button
                  type="submit"
                  className="p-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Quick test buttons */}
          <div className="mt-4 flex flex-wrap gap-1.5 text-[11px]">
            <span className="text-slate-400 mr-1 self-center">Quick triggers:</span>
            <button
              onClick={() => setInputMessage('Track my order')}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
            >
              Where is my order?
            </button>
            <button
              onClick={() => setInputMessage('Confirm COD order')}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
            >
              Confirm COD
            </button>
            <button
              onClick={() => setInputMessage('Are sweets sugar-free?')}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
            >
              Are sweets sugar-free?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppBotIntegration;
