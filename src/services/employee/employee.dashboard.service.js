import api from "@/api/axios"

export const employeeDashboardService = {
  getDashboard: async (id, status = "") => {
    const { data } = await api.get(`/dashboard/employee/${id}`, {
      params: {
        status
      }
    });

    return data;
  }
};