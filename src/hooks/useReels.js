import { useState, useEffect, useCallback } from "react";
import reelService from "../services/reel.service";

const MAX_REELS = 12;
const STORAGE_KEY = "wms_admin_uploaded_reels";

export const useReels = () => {
  const [reels, setReels] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingFilename, setDeletingFilename] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [serverCount, setServerCount] = useState(0);

  // Sync to localStorage whenever reels state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reels));
    } catch (e) {
      console.warn("Failed to persist reels to localStorage:", e);
    }
  }, [reels]);

  // Fetch reels from live backend GET /api/reels
  const fetchReels = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reelService.getReels();
      
      const reelList = Array.isArray(data?.reels)
        ? data.reels
        : Array.isArray(data)
        ? data
        : [];

      setReels(reelList.slice(0, MAX_REELS));
      setServerCount(typeof data?.count === "number" ? data.count : reelList.length);
    } catch (err) {
      console.warn("Server reels fetch fallback:", err.message);
      setError(err.message || "Failed to fetch reels from server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReels();
  }, [fetchReels]);

  // Construct structured 12 slots
  const slots = Array.from({ length: MAX_REELS }, (_, index) => {
    const reel = reels[index] || null;
    return {
      slot: index + 1,
      reel: reel,
      isFilled: Boolean(reel),
    };
  });

  const uploadReels = async (files) => {
    const fileList = Array.isArray(files) ? files : [files];
    const currentCount = reels.length;
    const remainingSlots = MAX_REELS - currentCount;

    if (remainingSlots <= 0) {
      const msg = `Maximum limit of ${MAX_REELS} reels reached! Please delete an existing reel to upload a new one.`;
      setError(msg);
      throw new Error(msg);
    }

    if (fileList.length > remainingSlots) {
      const msg = `You can only upload up to ${remainingSlots} more reel(s). Selected ${fileList.length}.`;
      setError(msg);
      throw new Error(msg);
    }

    try {
      setUploading(true);
      setError(null);
      setSuccess(null);

      const response = await reelService.uploadReels(fileList);

      setSuccess(
        response?.message || `Uploaded ${fileList.length} reel(s) successfully!`
      );

      // Re-fetch latest live list from backend
      await fetchReels();

      return response;
    } catch (err) {
      setError(err.message || "Failed to upload reels");
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const deleteReel = async (filenameOrUrl) => {
    const cleanFilename =
      filenameOrUrl && String(filenameOrUrl).includes("/")
        ? String(filenameOrUrl).split("/").filter(Boolean).pop()
        : String(filenameOrUrl);

    try {
      setDeletingFilename(cleanFilename);
      setError(null);
      setSuccess(null);

      const response = await reelService.deleteReel(cleanFilename);

      setSuccess(response?.message || "Reel deleted successfully!");

      // Re-fetch latest live list from backend
      await fetchReels();

      return response;
    } catch (err) {
      setError(err.message || "Failed to delete reel");
      throw err;
    } finally {
      setDeletingFilename(null);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return {
    reels,
    slots,
    serverCount,
    maxReels: MAX_REELS,
    remainingSlots: MAX_REELS - reels.length,
    loading,
    uploading,
    deletingFilename,
    error,
    success,
    fetchReels,
    uploadReels,
    deleteReel,
    clearMessages,
  };
};

export default useReels;
