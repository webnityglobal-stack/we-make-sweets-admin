import api from "../api/axios.js";

export const dashboardService = {
  getDashboardData: async () => {
    try {
      const response = await api.get("/admin/dashboard");
      if (response.data && response.data.dashboard) {
        return response.data.dashboard;
      }
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch dashboard data";
      throw new Error(message);
    }
  },
};

export default dashboardService;
