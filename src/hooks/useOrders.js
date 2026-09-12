import { useState, useEffect, useCallback } from "react";
import orderService from "../services/order.service";

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
      const computedStats = await orderService.getOrderStats();
      setStats(computedStats);
    } catch (err) {
      setError(err.message || "Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (orderId, newStatus) => {
    const res = await orderService.updateOrderStatus(orderId, newStatus);
    if (res.orders) {
      setOrders(res.orders);
      const computedStats = await orderService.getOrderStats();
      setStats(computedStats);
    }
    return { success: true };
  };

  return {
    orders,
    stats,
    isLoading,
    error,
    refetch: fetchOrders,
    updateStatus,
  };
};

export default useOrders;
