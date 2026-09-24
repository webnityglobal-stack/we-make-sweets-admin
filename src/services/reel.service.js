import api from "../api/axios.js";

/**
 * Normalizes reel video URL.
 * Handles both absolute URLs and relative paths (/uploads/reels/...).
 */
export const getReelVideoUrl = (urlOrPath) => {
  if (!urlOrPath) return "";
  if (urlOrPath.startsWith("http://") || urlOrPath.startsWith("https://")) {
    return urlOrPath;
  }
  const apiUrl =
    import.meta.env.VITE_API_URL ||
    "https://salmon-coyote-671066.hostingersite.com/api";
  const backendOrigin = apiUrl.replace(/\/api\/?$/, "");
  return `${backendOrigin}${urlOrPath.startsWith("/") ? "" : "/"}${urlOrPath}`;
};

export const reelService = {
  /**
   * Fetch all reels from backend
   * GET /api/reels
   * Returns: { success: true, message: "Reels fetched successfully", count: number, reels: [...] }
   */
  getReels: async () => {
    try {
      const response = await api.get("/reels");
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch reels";
      throw new Error(message);
    }
  },

  /**
   * Upload one or more video reels
   * POST /api/reels/upload
   * Form-data key: 'reels' (File)
   * Returns: { success: true, message: "Reels uploaded successfully", reels: [{ filename, url }] }
   */
  uploadReels: async (files) => {
    if (!files || (Array.isArray(files) && files.length === 0)) {
      throw new Error("Please select at least one reel video to upload");
    }

    const fileList = Array.isArray(files) ? files : [files];
    const formData = new FormData();

    fileList.forEach((file) => {
      formData.append("reels", file);
    });

    try {
      const response = await api.post("/reels/upload", formData);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to upload reel(s)";
      throw new Error(message);
    }
  },

  /**
   * Delete a reel by its filename
   * DELETE /api/reels/:filename
   * Returns: { success: true, message: "Reel deleted successfully", filename: "..." }
   */
  deleteReel: async (filenameOrUrl) => {
    if (!filenameOrUrl) {
      throw new Error("Filename is required to delete reel");
    }

    // Extract clean filename whether full URL or bare filename is passed
    // e.g. "https://salmon-coyote-671066.hostingersite.com/api/reels/1790167921718-103738040.mp4" -> "1790167921718-103738040.mp4"
    const cleanFilename = String(filenameOrUrl).includes("/")
      ? String(filenameOrUrl).split("/").filter(Boolean).pop()
      : String(filenameOrUrl);

    try {
      const response = await api.delete(`/reels/${cleanFilename}`);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete reel";
      throw new Error(message);
    }
  },
};

export default reelService;
