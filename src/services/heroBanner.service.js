import api from "../api/axios.js";

/**
 * Normalizes image URL returned by the backend.
 * Handles both absolute URLs (e.g. Cloudinary/S3) and relative paths (e.g. /uploads/hero/...).
 */
export const getHeroImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  const apiUrl = import.meta.env.VITE_API_URL || "https://wemakesweets-backend.onrender.com/api";
  const backendOrigin = apiUrl.replace(/\/api\/?$/, "");
  return `${backendOrigin}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};

export const heroBannerService = {
  /**
   * Fetch all hero banners
   * GET /api/hero-banner
   * Returns { success: true, banners: [...] }
   */
  getBanners: async () => {
    try {
      const response = await api.get("/hero-banner");
      if (response.data && Array.isArray(response.data.banners)) {
        return response.data.banners;
      }
      return [];
    } catch (error) {
      console.warn("Failed to fetch hero banners from live backend:", error.message);
      return [];
    }
  },

  /**
   * Upload hero banner image for a specific slot (1, 2, or 3)
   * POST /api/hero-banner/upload
   * Body: form-data { slot: 1|2|3, image: File }
   */
  uploadBanner: async (slot, file) => {
    const slotNum = Number(slot);
    if (![1, 2, 3].includes(slotNum)) {
      throw new Error("Slot must be 1, 2, or 3");
    }

    if (!file) {
      throw new Error("Please select an image file to upload");
    }

    const formData = new FormData();
    formData.append("slot", String(slotNum));
    formData.append("image", file);

    try {
      const response = await api.post("/hero-banner/upload", formData);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to upload hero banner";
      throw new Error(message);
    }
  },

  /**
   * Delete hero banner image for a specific slot (1, 2, or 3)
   * DELETE /api/hero-banner/:slot
   * Resets the slot to default storefront banner
   */
  deleteBanner: async (slot) => {
    const slotNum = Number(slot);
    if (![1, 2, 3].includes(slotNum)) {
      throw new Error("Slot must be 1, 2, or 3");
    }

    try {
      const response = await api.delete(`/hero-banner/${slotNum}`);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete hero banner";
      throw new Error(message);
    }
  },
};

export default heroBannerService;
