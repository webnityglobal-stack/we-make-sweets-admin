import { useState, useEffect, useCallback } from "react";
import reelService, { getReelVideoUrl } from "../services/reel.service";

const MAX_REELS = 12;

export const useReels = () => {
  const [reels, setReels] = useState([]);
  const [serverCount, setServerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [deletingFilename, setDeletingFilename] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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

      // Normalize each reel URL to ensure full valid playback URL
      const normalizedReels = reelList.map((r) => ({
        ...r,
        url: getReelVideoUrl(r.url || r.filename),
      }));

      setReels(normalizedReels.slice(0, MAX_REELS));
      setServerCount(typeof data?.count === "number" ? data.count : reelList.length);
    } catch (err) {
      console.warn("Server reels fetch error:", err.message);
      setError(err.message || "Failed to fetch reels from server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReels();

    // Auto-refresh when tab gains focus (e.g. after uploading via Postman)
    const handleFocus = () => {
      fetchReels();
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
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
      setUploadProgress({
        percentage: 0,
        loaded: 0,
        total: fileList.reduce((acc, f) => acc + (f.size || 0), 0),
        isProcessing: false,
        fileNames: fileList.map((f) => f.name).join(", "),
      });

      const response = await reelService.uploadReels(fileList, (progress) => {
        setUploadProgress((prev) => ({
          ...prev,
          ...progress,
        }));
      });

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
      setUploadProgress(null);
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
    uploadProgress,
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
