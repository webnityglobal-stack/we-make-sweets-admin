import { useState, useEffect, useCallback } from "react";
import subAdminService from "../services/subadmin.service";

export const useSubAdmins = () => {
  const [subAdmins, setSubAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSubAdmins = useCallback(() => {
    setIsLoading(true);
    try {
      const data = subAdminService.getSubAdmins();
      setSubAdmins(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubAdmins();
  }, [fetchSubAdmins]);

  const addSubAdmin = async (payload) => {
    const res = await subAdminService.createSubAdmin(payload);
    fetchSubAdmins();
    return res;
  };

  const removeSubAdmin = (id) => {
    subAdminService.deleteSubAdmin(id);
    fetchSubAdmins();
  };

  const toggleSubAdminStatus = (id) => {
    subAdminService.toggleStatus(id);
    fetchSubAdmins();
  };

  return {
    subAdmins,
    isLoading,
    addSubAdmin,
    removeSubAdmin,
    toggleSubAdminStatus,
    refresh: fetchSubAdmins,
  };
};

export default useSubAdmins;
