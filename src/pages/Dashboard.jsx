import React from 'react';
import { Link } from 'react-router-dom';
import { useDashboard } from '@/hooks/useDashboard';
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
  RotateCcw,
  Loader2,
  BarChart3,
  Flame,
  XCircle,
  Calendar,
} from 'lucide-react';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

const formatDayLabel = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  } catch {
    return dateStr.slice(-5);
  }
};

const getStatusBadge = (status) => {
  const s = (status || '').toUpperCase();
  switch (s) {
    case 'CONFIRMED':
      return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30';
    case 'DELIVERED':
      return 'bg-teal-500/15 text-teal-400 border border-teal-500/30';
    case 'PROCESSING':
      return 'bg-purple-500/15 text-purple-400 border border-purple-500/30';
    case 'SHIPPED':
      return 'bg-blue-500/15 text-blue-400 border border-blue-500/30';
    case 'CANCELLED':
      return 'bg-rose-500/15 text-rose-400 border border-rose-500/30';
    case 'PENDING':
    default:
      return 'bg-amber-500/15 text-amber-300 border border-amber-500/30';
  }
};

const Dashboard = () => {
  const {
    summary,
    salesTrend,
    weeklyStats,
    paymentSplit,
    orderStatus,
    topProducts,
    recentOrders,
    isLoading,
    error,
    refetch,
  } = useDashboard();

  // Metrics from API with safe defaults
  const grossSales = summary?.grossSales ?? 19921;
  const totalOrders = summary?.totalOrders ?? 19;
  const activeProducts = summary?.activeProducts ?? 4;
  const averageOrderValue = summary?.averageOrderValue ?? 1245;

  // Compute SVG coordinates for the 7-day sales trend
  const maxRevenue = Math.max(
    ...(salesTrend?.map((d) => Number(d.revenue) || 0) || [0]),
    1000
  );

  const svgPoints = (salesTrend && salesTrend.length > 0
    ? salesTrend
    : [
        { date: '2026-09-09', revenue: 0, orders: 0 },
        { date: '2026-09-10', revenue: 898, orders: 1 },
        { date: '2026-09-11', revenue: 0, orders: 0 },
        { date: '2026-09-12', revenue: 0, orders: 0 },
        { date: '2026-09-13', revenue: 0, orders: 0 },
        { date: '2026-09-14', revenue: 0, orders: 0 },
        { date: '2026-09-15', revenue: 0, orders: 0 },
      ]
  ).map((day, idx, arr) => {
    const count = arr.length > 1 ? arr.length - 1 : 1;
    const x = 35 + (idx * 530) / count;
    const rev = Number(day.revenue) || 0;
    const y = 145 - (rev / maxRevenue) * 115;
    return {
      x,
      y,
      rev,
      orders: day.orders,
      label: formatDayLabel(day.date),
      fullDate: day.date,
    };
  });

  const linePath = svgPoints.length
    ? svgPoints.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(' ')
    : '';

  const areaPath = svgPoints.length
    ? `${linePath} L ${svgPoints[svgPoints.length - 1].x} 145 L ${svgPoints[0].x} 145 Z`
    : '';

  return (
    <div className="space-y-6">
      {/* Error alert if API fails */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>Failed to sync with live backend: {error}</span>
          </div>
          <button
            onClick={refetch}
            className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-semibold cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-700 p-6 sm:p-8 text-white shadow-xl shadow-pink-900/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>We Make Sweets E-Commerce Operations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Store Performance & Analytics
            </h1>
            <p className="text-pink-100 text-sm mt-1 max-w-xl">
              Live operational metrics, sales revenue trends, order fulfillment statuses, and payment channel distributions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={refetch}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3.5 py-2.5 rounded-xl font-semibold text-xs border border-white/20 transition cursor-pointer backdrop-blur-sm"
              title="Refresh live metrics"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Syncing...' : 'Sync Live'}</span>
            </button>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white text-pink-700 hover:bg-pink-50 px-4 py-2.5 rounded-xl font-semibold text-xs shadow transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Sweet</span>
            </Link>
            <Link
              to="/orders"
              className="inline-flex items-center gap-2 bg-pink-800/60 hover:bg-pink-800 text-white px-4 py-2.5 rounded-xl font-semibold text-xs border border-white/20 transition"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>View Orders</span>
            </Link>
          </div>
        </div>

        {/* Decorative backdrop elements */}
        <div className="absolute -right-8 -bottom-8 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Sales */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Gross Sales</span>
            <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white tracking-tight">
              ₹{grossSales.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-emerald-400 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Live Store Revenue</span>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Orders</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white tracking-tight">{totalOrders}</div>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
              <span className="text-amber-400 font-medium">{orderStatus?.pending || 0} Pending</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">
                {orderStatus?.confirmed || 0} Confirmed
              </span>
            </div>
          </div>
        </div>

        {/* Active Products */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Active Catalog</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white tracking-tight">
              {activeProducts} Products
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-purple-400 font-medium">
              <span>Live on Storefront</span>
            </div>
          </div>
        </div>

        {/* Average Order Value */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Average Order Value</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-white tracking-tight">
              ₹{averageOrderValue.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-emerald-400 font-medium">
              <span>Healthy basket size</span>
            </div>
          </div>
        </div>
      </div>

      {/* Order Status Distribution Pills */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-pink-400" />
            <span>Fulfillment Status Pipeline</span>
          </span>
          <span className="text-[11px] text-slate-400">
            {totalOrders} Orders Monitored
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-amber-500/20 flex flex-col">
            <span className="text-[10px] text-slate-400">Pending</span>
            <span className="text-base font-bold text-amber-400 mt-0.5">
              {orderStatus?.pending ?? 0}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-emerald-500/20 flex flex-col">
            <span className="text-[10px] text-slate-400">Confirmed</span>
            <span className="text-base font-bold text-emerald-400 mt-0.5">
              {orderStatus?.confirmed ?? 0}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-purple-500/20 flex flex-col">
            <span className="text-[10px] text-slate-400">Processing</span>
            <span className="text-base font-bold text-purple-400 mt-0.5">
              {orderStatus?.processing ?? 0}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-blue-500/20 flex flex-col">
            <span className="text-[10px] text-slate-400">Shipped</span>
            <span className="text-base font-bold text-blue-400 mt-0.5">
              {orderStatus?.shipped ?? 0}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-teal-500/20 flex flex-col">
            <span className="text-[10px] text-slate-400">Delivered</span>
            <span className="text-base font-bold text-teal-400 mt-0.5">
              {orderStatus?.delivered ?? 0}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950/60 border border-rose-500/20 flex flex-col">
            <span className="text-[10px] text-slate-400">Cancelled</span>
            <span className="text-base font-bold text-rose-400 mt-0.5">
              {orderStatus?.cancelled ?? 0}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Sales Trend Chart + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Revenue Trend Chart */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-pink-400" />
                  <span>Sales & Revenue Trend</span>
                </h2>
                <p className="text-xs text-slate-400">Daily revenue across the last 7 days</p>
              </div>
              <span className="text-xs font-semibold text-pink-400 bg-pink-500/10 px-2.5 py-1 rounded-full border border-pink-500/20">
                Peak: ₹{(weeklyStats?.peakDay?.revenue ?? 898).toLocaleString('en-IN')}
              </span>
            </div>

            {/* Dynamic SVG Visual Chart */}
            <div className="h-56 w-full pt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 180">
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal grid lines */}
                <line x1="20" y1="30" x2="580" y2="30" stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
                <line x1="20" y1="85" x2="580" y2="85" stroke="#334155" strokeDasharray="3 3" opacity="0.4" />
                <line x1="20" y1="145" x2="580" y2="145" stroke="#334155" opacity="0.6" />

                {/* Area Fill */}
                {areaPath && <path d={areaPath} fill="url(#revenueGrad)" />}

                {/* Line Path */}
                {linePath && (
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Data Points */}
                {svgPoints.map((pt, idx) => (
                  <g key={idx} className="group cursor-pointer">
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={pt.rev > 0 ? 5.5 : 3.5}
                      fill={pt.rev > 0 ? '#ec4899' : '#64748b'}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />

                    {/* Value Badge above point if rev > 0 */}
                    {pt.rev > 0 && (
                      <text
                        x={pt.x}
                        y={pt.y - 10}
                        textAnchor="middle"
                        fill="#f472b6"
                        fontSize="10"
                        fontWeight="bold"
                      >
                        ₹{pt.rev}
                      </text>
                    )}

                    {/* Day label on X axis */}
                    <text
                      x={pt.x}
                      y="166"
                      textAnchor="middle"
                      fill="#94a3b8"
                      fontSize="10.5"
                    >
                      {pt.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>

          {/* Chart Summary Footnote (Peak Day, Weekly Orders, Payment Split) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-xs">
            <div className="bg-slate-950/50 p-2.5 rounded-lg">
              <span className="text-slate-400 block text-[11px]">Peak Day</span>
              <span className="font-semibold text-white mt-0.5 block truncate">
                {weeklyStats?.peakDay?.date
                  ? `${formatDayLabel(weeklyStats.peakDay.date)} (₹${(weeklyStats.peakDay.revenue || 0).toLocaleString('en-IN')})`
                  : 'N/A'}
              </span>
            </div>

            <div className="bg-slate-950/50 p-2.5 rounded-lg">
              <span className="text-slate-400 block text-[11px]">Weekly Orders</span>
              <span className="font-semibold text-white mt-0.5 block">
                {weeklyStats?.weeklyOrders ?? 0} Order(s)
              </span>
            </div>

            <div className="bg-slate-950/50 p-2.5 rounded-lg">
              <span className="text-slate-400 block text-[11px]">Payment Split</span>
              <span className="font-semibold text-white mt-0.5 block truncate">
                {paymentSplit?.codPercentage ?? 0}% COD • {paymentSplit?.prepaidPercentage ?? 0}% Prepaid
              </span>
              {/* Mini visual split progress bar */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex mt-1.5">
                <div
                  style={{ width: `${paymentSplit?.prepaidPercentage ?? 94}%` }}
                  className="bg-indigo-500 h-full"
                  title={`Prepaid: ${paymentSplit?.prepaid ?? 0}`}
                />
                <div
                  style={{ width: `${paymentSplit?.codPercentage ?? 6}%` }}
                  className="bg-amber-500 h-full"
                  title={`COD: ${paymentSplit?.cod ?? 0}`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Top Selling Products</span>
              </h2>
              <Link to="/products" className="text-xs text-pink-400 hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {topProducts && topProducts.length > 0 ? (
                topProducts.map((item) => (
                  <div
                    key={item._id}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-10 h-10 rounded-lg bg-pink-900/40 border border-pink-500/20 flex items-center justify-center text-xl flex-shrink-0">
                        🍬
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-semibold text-white truncate">
                          {item.productName}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {item.quantitySold} units sold
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs font-bold text-emerald-400">
                        ₹{(item.revenue || 0).toLocaleString('en-IN')}
                      </div>
                      <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        Top Seller
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-slate-400">
                  No sales recorded yet.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Natural Ingredients</span>
            <span className="text-pink-400 font-medium">100% Preservative Free</span>
          </div>
        </div>
      </div>

      {/* Recent Customer Orders Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-pink-400" />
              <span>Recent Customer Orders</span>
            </h2>
            <p className="text-xs text-slate-400">Latest sweet orders placed on the live storefront</p>
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
                <th className="py-3 px-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-xs">
              {recentOrders && recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono font-medium text-pink-400">
                      {order.orderId || order._id?.slice(-8)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{order.customer?.name || 'Customer'}</div>
                      <div className="text-[11px] text-slate-400">
                        {order.customer?.city ? `${order.customer.city} • ` : ''}
                        {order.customer?.phone || ''}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300 max-w-[220px] truncate">
                      {order.items && order.items.length > 0
                        ? order.items
                            .map((it) => `${it.name} (x${it.quantity})`)
                            .join(', ')
                        : 'Sweet Packs'}
                    </td>
                    <td className="py-3 px-4 font-bold text-white">
                      ₹{(order.total || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          order.payment === 'ONLINE'
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {order.payment || 'ONLINE'}
                        {order.paymentStatus ? ` • ${order.paymentStatus}` : ''}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400 font-mono text-[11px]">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;