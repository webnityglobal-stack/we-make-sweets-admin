import React, { useState, useMemo } from 'react';
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
  X,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import reportService from '@/services/report.service';

const OrderManagement = () => {
  const { orders, isLoading, updateStatus } = useOrders();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter((order) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        order.id?.toLowerCase().includes(q) ||
        order.orderNumber?.toLowerCase().includes(q) ||
        order.customer?.name?.toLowerCase().includes(q) ||
        order.customer?.phone?.toLowerCase().includes(q) ||
        order.customer?.city?.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'All' || order.orderStatus === statusFilter;
      const matchesPayment = paymentFilter === 'All' || order.paymentMethod === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, searchQuery, statusFilter, paymentFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    setStatusUpdating(true);
    await updateStatus(orderId, newStatus);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => ({
        ...prev,
        orderStatus: newStatus,
        paymentStatus:
          newStatus === 'Delivered' && prev.paymentMethod === 'COD'
            ? 'Paid on Delivery'
            : newStatus === 'Cancelled'
            ? 'Cancelled'
            : prev.paymentStatus,
      }));
    }
    setStatusUpdating(false);
  };

  const handleExportCSV = () => {
    if (!filteredOrders.length) return;
    const exportRows = filteredOrders.map((o) => ({
      "Order ID": o.orderNumber || o.id,
      "Customer Name": o.customer?.name,
      "Phone": o.customer?.phone,
      "City": o.customer?.city,
      "Items": o.items?.map((i) => `${i.name} (x${i.quantity})`).join('; '),
      "Total Amount (INR)": o.totalAmount,
      "Payment Mode": o.paymentMethod,
      "Payment Status": o.paymentStatus,
      "Order Status": o.orderStatus,
      "AWB / Tracking": o.awbNumber || "N/A",
      "Created At": o.createdAt,
    }));
    reportService.exportToCSV("we_make_sweets_orders", exportRows);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Order Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            View, track, and update fulfillment status for customer sweet orders
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2 rounded-lg text-xs font-semibold shadow transition cursor-pointer"
        >
          <Download className="w-4 h-4 text-pink-400" />
          <span>Export Orders CSV</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Order ID, customer name, phone, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950/60 border border-slate-800 rounded-lg px-2.5 py-1">
            <span className="text-[11px] text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900">All Statuses</option>
              <option value="Pending" className="bg-slate-900">Pending</option>
              <option value="Processing" className="bg-slate-900">Processing</option>
              <option value="Shipped" className="bg-slate-900">Shipped</option>
              <option value="Delivered" className="bg-slate-900">Delivered</option>
              <option value="Cancelled" className="bg-slate-900">Cancelled</option>
            </select>
          </div>

          {/* Payment Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950/60 border border-slate-800 rounded-lg px-2.5 py-1">
            <span className="text-[11px] text-slate-400">Payment:</span>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-slate-900">All Modes</option>
              <option value="Prepaid" className="bg-slate-900">Prepaid</option>
              <option value="COD" className="bg-slate-900">COD (Cash on Delivery)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800 bg-slate-950/40">
              <tr>
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items Summary</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Fulfillment Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-xs">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4 font-medium">
                      <div className="font-mono text-pink-400 font-semibold">
                        {order.orderNumber || order.id}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {new Date(order.createdAt).toLocaleString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white">{order.customer?.name}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <span>{order.customer?.phone}</span>
                        <span>•</span>
                        <span>{order.customer?.city}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-[220px]">
                      <div className="text-slate-200 truncate font-medium">
                        {order.items?.map((i) => i.name).join(', ')}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {order.items?.reduce((acc, curr) => acc + curr.quantity, 0)} items total
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-white">
                      ₹{order.totalAmount}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          order.paymentMethod === 'Prepaid'
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {order.paymentMethod}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {order.paymentStatus}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-xs font-semibold rounded-lg px-2 py-1 border cursor-pointer focus:outline-none ${
                          order.orderStatus === 'Delivered'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : order.orderStatus === 'Shipped'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                            : order.orderStatus === 'Processing'
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                            : order.orderStatus === 'Cancelled'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                        }`}
                      >
                        <option value="Pending" className="bg-slate-900 text-white">Pending</option>
                        <option value="Processing" className="bg-slate-900 text-white">Processing</option>
                        <option value="Shipped" className="bg-slate-900 text-white">Shipped</option>
                        <option value="Delivered" className="bg-slate-900 text-white">Delivered</option>
                        <option value="Cancelled" className="bg-slate-900 text-white">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-pink-400" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 text-slate-200 shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/80"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="border-b border-slate-800 pb-4 mb-5">
              <div className="flex items-center gap-2 text-xs text-pink-400 font-mono font-semibold">
                <span>{selectedOrder.orderNumber || selectedOrder.id}</span>
                <span>•</span>
                <span>
                  Placed on {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', {
                    dateStyle: 'long',
                  })}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">Order Details</h2>
            </div>

            {/* Customer & Shipping Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Customer Information
                </div>
                <div className="font-bold text-white text-sm">{selectedOrder.customer?.name}</div>
                <div className="text-xs text-slate-300 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-pink-400" />
                  <span>{selectedOrder.customer?.phone}</span>
                </div>
                <div className="text-xs text-slate-300 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-pink-400" />
                  <span>{selectedOrder.customer?.email}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Delivery Address & AWB
                </div>
                <div className="text-xs text-slate-300 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-pink-400 flex-shrink-0 mt-0.5" />
                  <span>{selectedOrder.customer?.address}</span>
                </div>
                <div className="pt-2 border-t border-slate-800/60 text-xs">
                  <span className="text-slate-400">Shiprocket AWB: </span>
                  <span className="font-mono font-medium text-emerald-400">
                    {selectedOrder.awbNumber || 'Pending Generation'}
                  </span>
                </div>
                <div className="text-xs">
                  <span className="text-slate-400">Courier: </span>
                  <span className="text-slate-200">{selectedOrder.courier || 'Delhivery Surface'}</span>
                </div>
              </div>
            </div>

            {/* Ordered Items */}
            <div className="mb-6">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                Items Ordered
              </div>
              <div className="divide-y divide-slate-800 rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-pink-950/60 border border-pink-500/20 flex items-center justify-center text-sm">
                        🍬
                      </div>
                      <div>
                        <div className="font-semibold text-white">{item.name}</div>
                        <div className="text-slate-400">Qty: {item.quantity} × ₹{item.price}</div>
                      </div>
                    </div>
                    <div className="font-bold text-white">
                      ₹{item.total || item.quantity * item.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total breakdown */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between items-center mb-6">
              <div>
                <div className="text-xs text-slate-400">Payment Summary</div>
                <div className="text-sm font-semibold text-white">
                  {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Total Paid / Payable</div>
                <div className="text-xl font-extrabold text-pink-400">
                  ₹{selectedOrder.totalAmount}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Update Status:</span>
                <select
                  value={selectedOrder.orderStatus}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                  disabled={statusUpdating}
                  className="bg-slate-800 border border-slate-700 text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
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
