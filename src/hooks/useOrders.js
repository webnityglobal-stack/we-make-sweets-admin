import { useState, useEffect, useCallback } from "react";
import orderService from "../services/order.service";

export const useOrders = (initialFilters = {}) => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 20,
    totalOrders: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state for search and query parameters
  const [search, setSearch] = useState(initialFilters.search || "");
  const [status, setStatus] = useState(initialFilters.status || "All");
  const [paymentMethod, setPaymentMethod] = useState(
    initialFilters.paymentMethod || "All"
  );
  const [page, setPage] = useState(initialFilters.page || 1);
  const [limit, setLimit] = useState(initialFilters.limit || 20);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await orderService.getAllOrders({
        search,
        status,
        paymentMethod,
        page,
        limit,
      });
      setOrders(result.orders || []);
      if (result.pagination) {
        setPagination(result.pagination);
      }
    } catch (err) {
      setError(err.message || "Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  }, [search, status, paymentMethod, page, limit]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId || o.orderId === orderId
            ? { ...o, orderStatus: newStatus }
            : o
        )
      );
      return { success: true };
    } catch (err) {
      throw new Error(err.message || "Failed to update order status");
    }
  };

  return {
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
    limit,
    setLimit,
    refetch: fetchOrders,
    updateStatus,
  };
};

export default useOrders;
