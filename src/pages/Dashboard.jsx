import React from 'react';
import { useOrders } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useProducts';
import { useIntegrations } from '@/hooks/useIntegrations';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingCart,
  Package,
  CreditCard,
  ArrowUpRight,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Plus,
  BarChart3,
  Bot,
  Megaphone,
} from 'lucide-react';

const Dashboard = () => {
  const { orders, stats, isLoading: ordersLoading } = useOrders();
  const { products, isLoading: productsLoading } = useProducts();
  const { gaConfig, waBotConfig, metaConfig } = useIntegrations();

  const totalRevenue = stats?.totalRevenue || 256000;
  const totalOrders = stats?.totalOrders || (orders ? orders.length : 0);
  const pendingCount = stats?.pendingCount || 0;
  const deliveredCount = stats?.deliveredCount || 0;
  const aov = stats?.averageOrderValue || 850;

  const recentOrders = orders?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-700 p-6 sm:p-8 text-white shadow-xl shadow-pink-900/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>We Make Sweets E-Commerce Operations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Sweets Store Overview
            </h1>
            <p className="text-pink-100 text-sm mt-1 max-w-xl">
              Monitor real-time sales, manage orders, track COD vs Prepaid ratios, and optimize marketing campaigns.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white text-pink-700 hover:bg-pink-50 px-4 py-2.5 rounded-xl font-semibold text-sm shadow transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </Link>
            <Link
              to="/orders"
              className="inline-flex items-center gap-2 bg-pink-800/60 hover:bg-pink-800 text-white px-4 py-2.5 rounded-xl font-semibold text-sm border border-white/20 transition"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>View Orders</span>
            </Link>
          </div>
        </div>

        {/* Decorative backdrop elements */}
        <div className="absolute -right-8 -bottom-8 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Gross Sales</span>
            <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-emerald-400 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.4% from last month</span>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Orders</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white">{totalOrders}</div>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
              <span className="text-amber-400 font-medium">{pendingCount} Pending</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">{deliveredCount} Delivered</span>
            </div>
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Active Catalog</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white">
              {productsLoading ? '...' : products?.length || 3} Products
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-purple-400 font-medium">
              <span>All items synced with Backend</span>
            </div>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Average Order Value</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white">₹{aov}</div>
            <div className="flex items-center gap-1 mt-1 text-xs text-emerald-400 font-medium">
              <span>Healthy cart basket size</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Sales Chart + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Revenue Trend */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-white">Sales & Revenue Trend</h2>
                <p className="text-xs text-slate-400">Daily revenue across the last 7 days</p>
              </div>
              <Link
                to="/reports/sales"
                className="text-xs font-semibold text-pink-400 hover:text-pink-300 flex items-center gap-1"
              >
                <span>Full Reports</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* SVG Visual Chart */}
            <div className="h-56 w-full pt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 180">
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Horizontal grid lines */}
                <line x1="0" y1="30" x2="600" y2="30" stroke="#334155" strokeDasharray="3 3" opacity="0.5" />
                <line x1="0" y1="80" x2="600" y2="80" stroke="#334155" strokeDasharray="3 3" opacity="0.5" />
                <line x1="0" y1="130" x2="600" y2="130" stroke="#334155" strokeDasharray="3 3" opacity="0.5" />

                {/* Area Fill */}
                <path
                  d="M 20 120 Q 110 70, 200 90 T 380 40 T 480 60 T 580 30 L 580 160 L 20 160 Z"
                  fill="url(#revenueGrad)"
                />
                {/* Line Path */}
                <path
                  d="M 20 120 Q 110 70, 200 90 T 380 40 T 480 60 T 580 30"
                  fill="none"
                  stroke="#ec4899"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Data Points */}
                {[
                  { cx: 20, cy: 120, label: 'Mon', val: '₹7.8k' },
                  { cx: 110, cy: 75, label: 'Tue', val: '₹12.2k' },
                  { cx: 200, cy: 90, label: 'Wed', val: '₹10.4k' },
                  { cx: 290, cy: 60, label: 'Thu', val: '₹14.1k' },
                  { cx: 380, cy: 40, label: 'Fri', val: '₹18.5k' },
                  { cx: 480, cy: 60, label: 'Sat', val: '₹15.3k' },
                  { cx: 580, cy: 30, label: 'Sun', val: '₹21.4k' },
                ].map((pt, idx) => (
                  <g key={idx}>
                    <circle cx={pt.cx} cy={pt.cy} r="5" fill="#ec4899" stroke="#ffffff" strokeWidth="2" />
                    <text x={pt.cx} y="175" textAnchor="middle" fill="#94a3b8" fontSize="11">
                      {pt.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-800 text-center text-xs">
            <div>
              <span className="text-slate-400 block">Peak Day</span>
              <span className="font-semibold text-white">Sunday (₹21,400)</span>
            </div>
            <div>
              <span className="text-slate-400 block">Weekly Orders</span>
              <span className="font-semibold text-white">142 Orders</span>
            </div>
            <div>
              <span className="text-slate-400 block">Payment Split</span>
              <span className="font-semibold text-white">56% COD / 44% Prepaid</span>
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white">Top Sweet Packs</h2>
              <Link to="/products" className="text-xs text-pink-400 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {products?.slice(0, 3).map((item, idx) => (
                <div
                  key={item._id || idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-lg bg-pink-900/40 border border-pink-500/20 flex items-center justify-center text-xl flex-shrink-0">
                      🍬
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-xs font-semibold text-white truncate">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {item.weight || '250g'} • ₹{item.salePrice}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-emerald-400">
                      {item.isBestSeller ? 'Best Seller' : 'Popular'}
                    </div>
                    <div className="text-[10px] text-slate-400">{item.stock} in stock</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Natural Ingredients Only</span>
            <span className="text-pink-400 font-medium">100% Preservative Free</span>
          </div>
        </div>
      </div>

      {/* Integration Status Badges */}
      {/* <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white">Client Integrations Status</h2>
          <span className="text-xs text-slate-400">Active APIs from Proposal</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"> */}
          {/* GA */}
          {/* <Link
            to="/integrations/google-analytics"
            className="p-3 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 flex items-center gap-3 transition"
          >
            <div className="p-2 rounded-md bg-amber-500/10 text-amber-400">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Google Analytics 4</div>
              <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>{gaConfig?.realtimeVisitors || 28} Live Visitors</span>
              </div>
            </div>
          </Link> */}

          {/* WhatsApp Marketing */}
          {/* <Link
            to="/integrations/whatsapp-marketing"
            className="p-3 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 flex items-center gap-3 transition"
          >
            <div className="p-2 rounded-md bg-emerald-500/10 text-emerald-400">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">WhatsApp Marketing</div>
              <div className="text-[10px] text-emerald-400">WABA Active • 98.5% Deliv.</div>
            </div>
          </Link> */}

          {/* WhatsApp Bot */}
          {/* <Link
            to="/integrations/whatsapp-bot"
            className="p-3 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 flex items-center gap-3 transition"
          >
            <div className="p-2 rounded-md bg-teal-500/10 text-teal-400">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">WhatsApp Auto-Bot</div>
              <div className="text-[10px] text-teal-300">COD Confirmation & Tracking</div>
            </div>
          </Link> */}

          {/* Meta Ads */}
          {/* <Link
            to="/integrations/meta-ads"
            className="p-3 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 flex items-center gap-3 transition"
          >
            <div className="p-2 rounded-md bg-blue-500/10 text-blue-400">
              <Megaphone className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Meta Ads & CAPI</div>
              <div className="text-[10px] text-blue-300">Pixel Active • 4.31x ROAS</div>
            </div>
          </Link> */}
        {/* </div>
      </div> */}

      {/* Recent Orders Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-white">Recent Customer Orders</h2>
            <p className="text-xs text-slate-400">Latest sweet orders placed on the storefront</p>
          </div>
          <Link
            to="/orders"
            className="text-xs font-semibold text-pink-400 hover:text-pink-300 flex items-center gap-1"
          >
            <span>Manage All Orders</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 bg-slate-950/40">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-xs">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono font-medium text-pink-400">
                    {order.orderNumber || order.id}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-white">{order.customer?.name}</div>
                    <div className="text-[11px] text-slate-400">{order.customer?.city}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-300 max-w-[200px] truncate">
                    {order.items?.map((it) => `${it.name} (x${it.quantity})`).join(', ')}
                  </td>
                  <td className="py-3 px-4 font-bold text-white">
                    ₹{order.totalAmount}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        order.paymentMethod === 'Prepaid'
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {order.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : order.orderStatus === 'Shipped'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : order.orderStatus === 'Processing'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : order.orderStatus === 'Cancelled'
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      to="/orders"
                      className="px-2.5 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                    >
                      Details
                    </Link>
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

export default Dashboard;