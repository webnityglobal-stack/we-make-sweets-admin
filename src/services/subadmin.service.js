import authService from "./auth.services";

const STORAGE_KEY = "wms_sub_admins";

const initialSubAdmins = [
  {
    id: "sub_1",
    name: "Kavita Sharma",
    email: "kavita.ops@wemakesweets.com",
    phone: "9876543211",
    role: "sub-admin",
    createdAt: "2026-09-10T11:00:00Z",
    status: "Active",
  },
  {
    id: "sub_2",
    name: "Aman Gupta",
    email: "aman.orders@wemakesweets.com",
    phone: "9812345678",
    role: "sub-admin",
    createdAt: "2026-09-11T14:30:00Z",
    status: "Active",
  },
];

export const subAdminService = {
  getSubAdmins: () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialSubAdmins;
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSubAdmins));
    return initialSubAdmins;
  },

  createSubAdmin: async ({ name, email, password, phone }) => {
    let backendResult = null;
    try {
      // Try registering on live backend
      backendResult = await authService.register({
        name,
        email,
        password,
        phone,
        role: "sub-admin",
      });
    } catch (err) {
      console.warn("Backend sub-admin registration fallback:", err.message);
    }

    const currentList = subAdminService.getSubAdmins();
    const newSubAdmin = {
      id: backendResult?.user?.id || backendResult?.user?._id || `sub_${Date.now()}`,
      name,
      email,
      phone,
      role: "sub-admin",
      createdAt: new Date().toISOString(),
      status: "Active",
    };

    const updated = [newSubAdmin, ...currentList];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return { success: true, subAdmin: newSubAdmin };
  },

  deleteSubAdmin: (id) => {
    const currentList = subAdminService.getSubAdmins();
    const updated = currentList.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return { success: true };
  },

  toggleStatus: (id) => {
    const currentList = subAdminService.getSubAdmins();
    const updated = currentList.map((s) =>
      s.id === id ? { ...s, status: s.status === "Active" ? "Inactive" : "Active" } : s
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return { success: true };
  },
};

export default subAdminService;
