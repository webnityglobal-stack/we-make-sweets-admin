import api from "../api/axios.js";

export const orderService = {
  getAllOrders: async (params = {}) => {
    try {
      const queryParams = {};

      if (params.search && params.search.trim()) {
        queryParams.search = params.search.trim();
      }

      if (params.status && params.status !== "All") {
        queryParams.status = params.status;
      }

      if (params.paymentMethod && params.paymentMethod !== "All") {
        queryParams.paymentMethod = params.paymentMethod;
      }

      if (params.page) {
        queryParams.page = params.page;
      }

      if (params.limit) {
        queryParams.limit = params.limit;
      }

      const response = await api.get("/admin/orders", { params: queryParams });

      if (response.data && response.data.orders) {
        return {
          orders: response.data.orders,
          pagination: response.data.pagination || {
            currentPage: 1,
            limit: 20,
            totalOrders: response.data.orders.length,
            totalPages: 1,
            hasNextPage: false,
            hasPreviousPage: false,
          },
        };
      }

      return { orders: [], pagination: {} };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch orders from server";
      throw new Error(message);
    }
  },

  updateOrderStatus: async (orderId, newStatus) => {
    try {
      const response = await api.put(`/admin/orders/${orderId}`, {
        orderStatus: newStatus,
      });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update order status";
      throw new Error(message);
    }
  },
};

export default orderService;
