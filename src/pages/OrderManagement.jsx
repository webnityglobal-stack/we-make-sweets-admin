import React, { useState, useEffect } from 'react';
import { useOrders } from '@/hooks/useOrders';
import {
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Package,
  Printer,
  ChevronRight,
  ChevronLeft,
  X,
  Phone,
  Mail,
  MapPin,
  RotateCcw,
  Loader2,
  AlertCircle,
  CreditCard,
} from 'lucide-react';
import reportService from '@/services/report.service';
import { printOrderSlip } from '@/lib/orderPrintSlip';

const formatOrderDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
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

const OrderManagement = () => {
  const {
    orders,
    pagination,
    isLoading,
    error,
    search,
    setSearch,
    status,
    setStatus,
    paymentMethod,
    setPaymentMethod,
    page,
    setPage,
    refetch,
    updateStatus,
  } = useOrders();

  // Local state for search input debouncing
  const [searchInput, setSearchInput] = useState(search);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  // Debounce search query so backend isn't flooded on every keypress
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        setSearch(searchInput);
        setPage(1);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput, search, setSearch, setPage]);

  const handleStatusFilterChange = (val) => {
    setStatus(val);
    setPage(1);
  };

  const handlePaymentFilterChange = (val) => {
    setPaymentMethod(val);
    setPage(1);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setStatusUpdating(true);
      await updateStatus(orderId, newStatus);
      if (selectedOrder && (selectedOrder._id === orderId || selectedOrder.orderId === orderId)) {
        setSelectedOrder((prev) => ({
          ...prev,
          orderStatus: newStatus,
        }));
      }
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleExportCSV = () => {
    if (!orders.length) return;
    const exportRows = orders.map((o) => ({
      'Order ID': o.orderId || o._id,
      'Customer Name': o.shippingAddress?.name || o.user?.name || 'Customer',
      Phone: o.shippingAddress?.phone || o.user?.phone || 'N/A',
      Email: o.shippingAddress?.email || o.user?.email || 'N/A',
      City: o.shippingAddress?.city || 'N/A',
      State: o.shippingAddress?.state || 'N/A',
      Pincode: o.shippingAddress?.pincode || 'N/A',
      Address: o.shippingAddress?.address || 'N/A',
      Items: o.items?.map((i) => `${i.name} (x${i.quantity})`).join('; '),
      'Total Amount (INR)': o.totalAmount,
      'Payment Mode': o.paymentMethod,
      'Payment Status': o.paymentStatus,
      'Order Status': o.orderStatus,
      Courier: o.shiprocket?.courierName || 'N/A',
      'AWB Code': o.shiprocket?.awbCode || 'N/A',
      'Created At': o.createdAt,
    }));
    reportService.exportToCSV('we_make_sweets_orders', exportRows);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">Order Management</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-pink-500/10 text-pink-400 text-xs font-semibold border border-pink-500/20">
              {pagination.totalOrders || orders.length} Orders
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            View, track, and manage customer sweet orders directly from live backend
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-lg text-xs font-semibold shadow transition cursor-pointer"
            title="Refresh Orders"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-pink-400' : ''}`} />
            <span>{isLoading ? 'Syncing...' : 'Refresh'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            disabled={!orders.length}
            className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2 rounded-lg text-xs font-semibold shadow transition cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-pink-400" />
            <span>Export Orders CSV</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => refetch()}
            className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-semibold cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Filter & Query Parameters Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order ID, customer name, phone, or city..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800 rounded-lg pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 transition"
          />
          {searchInput && (
            <button
              onClick={() => {
                setSearchInput('');
                setSearch('');
                setPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter (query param) */}
          <div className="flex items-center gap-1.5 bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-1.5">
            <span className="text-[11px] text-slate-400">Status:</span>
            <select
              value={status}
              onChange={(e) => handleStatusFilterChange(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900 text-white">All Statuses</option>
              <option value="PENDING" className="bg-slate-900 text-white">Pending</option>
              <option value="CONFIRMED" className="bg-slate-900 text-white">Confirmed</option>
              <option value="PROCESSING" className="bg-slate-900 text-white">Processing</option>
              <option value="SHIPPED" className="bg-slate-900 text-white">Shipped</option>
              <option value="DELIVERED" className="bg-slate-900 text-white">Delivered</option>
              <option value="CANCELLED" className="bg-slate-900 text-white">Cancelled</option>
            </select>
          </div>

          {/* Payment Method Filter (query param) */}
          <div className="flex items-center gap-1.5 bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-1.5">
            <span className="text-[11px] text-slate-400">Payment:</span>
            <select
              value={paymentMethod}
              onChange={(e) => handlePaymentFilterChange(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900 text-white">All Modes</option>
              <option value="ONLINE" className="bg-slate-900 text-white">ONLINE (Prepaid)</option>
              <option value="COD" className="bg-slate-900 text-white">COD (Cash on Delivery)</option>
            </select>
          </div>

          {/* Clear Filters Button if any active filter */}
          {(status !== 'All' || paymentMethod !== 'All' || search) && (
            <button
              onClick={() => {
                setSearchInput('');
                setSearch('');
                setStatus('All');
                setPaymentMethod('All');
                setPage(1);
              }}
              className="text-xs text-pink-400 hover:text-pink-300 font-medium px-2 py-1 cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 bg-slate-950/60">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Order ID & Date</th>
                <th className="py-3.5 px-4 font-semibold">Customer</th>
                <th className="py-3.5 px-4 font-semibold">Items Summary</th>
                <th className="py-3.5 px-4 font-semibold">Amount</th>
                <th className="py-3.5 px-4 font-semibold">Payment Method</th>
                <th className="py-3.5 px-4 font-semibold">Fulfillment Status</th>
                <th className="py-3.5 px-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-pink-500" />
                      <span className="text-xs">Loading orders from live server...</span>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Package className="w-8 h-8 text-slate-600" />
                      <span className="text-sm font-semibold text-slate-300">No orders found</span>
                      <span className="text-xs text-slate-500">
                        Try changing your search query or filter options.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const customerName =
                    order.shippingAddress?.name || order.user?.name || 'Customer';
                  const customerPhone =
                    order.shippingAddress?.phone || order.user?.phone || '';
                  const customerCity = order.shippingAddress?.city || '';
                  const itemsCount =
                    order.items?.reduce((acc, curr) => acc + (curr.quantity || 1), 0) || 0;

                  return (
                    <tr key={order._id} className="hover:bg-slate-800/40 transition">
                      {/* Order ID & Date */}
                      <td className="py-3.5 px-4 font-medium">
                        <div className="font-mono text-pink-400 font-semibold text-xs">
                          {order.orderId || order._id?.slice(-8)}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {formatOrderDate(order.createdAt)}
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{customerName}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          {customerPhone && <span>{customerPhone}</span>}
                          {customerPhone && customerCity && <span>•</span>}
                          {customerCity && <span>{customerCity}</span>}
                        </div>
                      </td>

                      {/* Items Summary */}
                      <td className="py-3.5 px-4 max-w-[220px]">
                        <div className="text-slate-200 truncate font-medium">
                          {order.items && order.items.length > 0
                            ? order.items.map((i) => i.name).join(', ')
                            : 'Sweet Items'}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {itemsCount} item{itemsCount !== 1 ? 's' : ''} total
                        </div>
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 font-bold text-white text-sm">
                        ₹{(order.totalAmount || 0).toLocaleString('en-IN')}
                      </td>

                      {/* Payment Method */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            order.paymentMethod === 'ONLINE'
                              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {order.paymentMethod || 'ONLINE'}
                        </span>
                        <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                          {order.paymentStatus || 'PENDING'}
                        </div>
                      </td>

                      {/* Fulfillment Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg text-xs font-semibold ${getStatusBadge(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus || 'PENDING'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => printOrderSlip(order)}
                            title="Print Slip / Tax Invoice"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition cursor-pointer hover:border-amber-500/40 hover:text-amber-300"
                          >
                            <Printer className="w-3.5 h-3.5 text-amber-400" />
                            <span className="hidden sm:inline">Slip</span>
                          </button>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-pink-400" />
                            <span>View</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {pagination && pagination.totalOrders > 0 && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div>
              Showing{' '}
              <span className="font-semibold text-white">
                {(pagination.currentPage - 1) * pagination.limit + 1}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-white">
                {Math.min(pagination.currentPage * pagination.limit, pagination.totalOrders)}
              </span>{' '}
              of <span className="font-semibold text-white">{pagination.totalOrders}</span> orders
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={!pagination.hasPreviousPage && pagination.currentPage <= 1}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <span className="px-3 py-1 text-slate-300 font-semibold">
                Page {pagination.currentPage} of {pagination.totalPages || 1}
              </span>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.hasNextPage && pagination.currentPage >= pagination.totalPages}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1 cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 text-slate-200 shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/80 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="border-b border-slate-800 pb-4 mb-5">
              <div className="flex items-center gap-2 text-xs text-pink-400 font-mono font-semibold">
                <span>{selectedOrder.orderId || selectedOrder._id}</span>
                <span>•</span>
                <span>
                  Placed on {formatOrderDate(selectedOrder.createdAt)}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <h2 className="text-xl font-bold text-white">Order Details</h2>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                    selectedOrder.orderStatus
                  )}`}
                >
                  {selectedOrder.orderStatus || 'PENDING'}
                </span>
              </div>
            </div>

            {/* Customer & Shipping Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Customer Information */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <span>Customer Information</span>
                </div>
                <div className="font-bold text-white text-sm">
                  {selectedOrder.shippingAddress?.name || selectedOrder.user?.name || 'Customer'}
                </div>
                <div className="text-xs text-slate-300 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-pink-400" />
                  <span>{selectedOrder.shippingAddress?.phone || selectedOrder.user?.phone || 'N/A'}</span>
                </div>
                <div className="text-xs text-slate-300 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-pink-400" />
                  <span>{selectedOrder.shippingAddress?.email || selectedOrder.user?.email || 'N/A'}</span>
                </div>
                {selectedOrder.user?._id && (
                  <div className="text-[10px] text-slate-500 font-mono pt-1">
                    User ID: {selectedOrder.user._id}
                  </div>
                )}
              </div>

              {/* Delivery Address & Shiprocket */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Shipping & Courier Details
                </div>
                <div className="text-xs text-slate-300 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-pink-400 flex-shrink-0 mt-0.5" />
                  <span>
                    {selectedOrder.shippingAddress
                      ? `${selectedOrder.shippingAddress.address || ''}, ${
                          selectedOrder.shippingAddress.city || ''
                        }, ${selectedOrder.shippingAddress.state || ''} - ${
                          selectedOrder.shippingAddress.pincode || ''
                        }, ${selectedOrder.shippingAddress.country || 'India'}`
                      : 'Address not available'}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800/60 text-xs space-y-1">
                  <div>
                    <span className="text-slate-400">Shiprocket AWB: </span>
                    <span className="font-mono font-medium text-emerald-400">
                      {selectedOrder.shiprocket?.awbCode || 'Pending Assignment'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Courier: </span>
                    <span className="text-slate-200">
                      {selectedOrder.shiprocket?.courierName || 'Pending Courier'}
                    </span>
                  </div>
                  {selectedOrder.shiprocket?.status && (
                    <div>
                      <span className="text-slate-400">Logistics Status: </span>
                      <span className="text-slate-300">
                        {selectedOrder.shiprocket.status}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Ordered Items */}
            <div className="mb-6">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Items Ordered ({selectedOrder.items?.length || 0})
              </div>
              <div className="divide-y divide-slate-800 rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-pink-950/60 border border-pink-500/20 flex items-center justify-center text-sm">
                          🍬
                        </div>
                        <div>
                          <div className="font-semibold text-white">{item.name}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            SKU: {item.sku || 'N/A'} • Qty: {item.quantity} × ₹{item.price}
                          </div>
                        </div>
                      </div>
                      <div className="font-bold text-white text-sm">
                        ₹{(item.total || item.quantity * item.price).toLocaleString('en-IN')}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-slate-500 text-xs">No item details</div>
                )}
              </div>
            </div>

            {/* Total breakdown */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between items-center mb-6">
              <div>
                <div className="text-xs text-slate-400">Payment Breakdown</div>
                <div className="text-sm font-semibold text-white mt-0.5">
                  {selectedOrder.paymentMethod || 'ONLINE'} ({selectedOrder.paymentStatus || 'PAID'})
                </div>
                {selectedOrder.paymentId?.gateway && (
                  <div className="text-[10px] text-slate-500 font-mono">
                    Gateway: {selectedOrder.paymentId.gateway}
                  </div>
                )}
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Total Order Amount</div>
                <div className="text-xl font-extrabold text-pink-400">
                  ₹{(selectedOrder.totalAmount || 0).toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Update Status:</span>
                <select
                  value={selectedOrder.orderStatus}
                  onChange={(e) =>
                    handleStatusChange(selectedOrder._id || selectedOrder.orderId, e.target.value)
                  }
                  disabled={statusUpdating}
                  className="bg-slate-800 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
                {statusUpdating && <Loader2 className="w-3.5 h-3.5 animate-spin text-pink-400" />}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => printOrderSlip(selectedOrder)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold cursor-pointer transition shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip / Tax Invoice</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
