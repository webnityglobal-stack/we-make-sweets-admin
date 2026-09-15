import api from "../api/axios.js";

export const subAdminService = {
  getSubAdmins: async () => {
    try {
      const response = await api.get("/admin/subadmins");
      if (response.data && Array.isArray(response.data.subAdmins)) {
        return response.data.subAdmins;
      }
      return [];
    } catch (error) {
      console.warn("Failed to fetch sub-admins from live backend:", error.message);
      return [];
    }
  },

  createSubAdmin: async ({ name, email, phone, password }) => {
    try {
      const response = await api.post("/admin/subadmins", {
        name,
        email,
        phone,
        password,
      });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to create sub-admin";
      throw new Error(message);
    }
  },

  deleteSubAdmin: async (id) => {
    try {
      const response = await api.delete(`/admin/subadmins/${id}`);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete sub-admin";
      throw new Error(message);
    }
  },
};

export default subAdminService;

