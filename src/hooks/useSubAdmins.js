import { useState, useEffect, useCallback } from "react";
import subAdminService from "../services/subadmin.service";

export const useSubAdmins = () => {
  const [subAdmins, setSubAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubAdmins = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await subAdminService.getSubAdmins();
      setSubAdmins(data);
    } catch (err) {
      console.error("Failed to load sub-admins:", err);
      setError(err.message || "Failed to load sub-admins");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubAdmins();
  }, [fetchSubAdmins]);

  const addSubAdmin = async (payload) => {
    try {
      const res = await subAdminService.createSubAdmin(payload);
      await fetchSubAdmins();
      return res;
    } catch (err) {
      throw err;
    }
  };

  const removeSubAdmin = async (id) => {
    try {
      const res = await subAdminService.deleteSubAdmin(id);
      setSubAdmins((prev) => prev.filter((s) => (s._id || s.id) !== id));
      return res;
    } catch (err) {
      throw err;
    }
  };

  return {
    subAdmins,
    isLoading,
    error,
    addSubAdmin,
    removeSubAdmin,
    refresh: fetchSubAdmins,
  };
};

export default useSubAdmins;

