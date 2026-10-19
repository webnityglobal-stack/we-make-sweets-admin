import api from "../api/axios.js";

/**
 * Normalizes popup image URL returned by the backend.
 * Handles both absolute URLs and relative paths (/uploads/custom-images/...).
 */
export const getPopupImageUrl = (imagePathOrObj) => {
  if (!imagePathOrObj) return null;

  let imagePath =
    typeof imagePathOrObj === "string"
      ? imagePathOrObj
      : imagePathOrObj.path || imagePathOrObj.url || imagePathOrObj.filename;

  if (!imagePath) return null;

  const apiUrl =
    import.meta.env.VITE_API_URL ||
    "https://salmon-coyote-671066.hostingersite.com/api";
  const backendOrigin = apiUrl.replace(/\/api\/?$/, "");

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    if (
      imagePath.includes("localhost:5000") ||
      imagePath.includes("wemakesweets-backend.onrender.com")
    ) {
      return imagePath
        .replace(/https?:\/\/localhost:5000/, backendOrigin)
        .replace(/https?:\/\/wemakesweets-backend\.onrender\.com/, backendOrigin);
    }
    return imagePath;
  }

  // If path doesn't start with /uploads, prepend /uploads/custom-images/
  if (!imagePath.includes("/")) {
    return `${backendOrigin}/uploads/custom-images/${imagePath}`;
  }

  return `${backendOrigin}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};

export const popupBannerService = {
  /**
   * Fetch active popup image(s) from backend
   * GET /api/image-upload
   * Returns: { success: true, message: "...", count: number, images: [{ filename, path, size }] }
   */
  getImages: async () => {
    try {
      const response = await api.get("/image-upload");
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch popup image";
      console.warn("Failed to fetch popup banner from live backend:", message);
      throw new Error(message);
    }
  },

  /**
   * Upload single popup / coupon modal image
   * POST /api/image-upload
   * Form-data key: 'image' (File)
   * Returns: { success: true, message: "Image uploaded successfully", image: { filename, path, size } }
   */
  uploadImage: async (file) => {
    if (!file) {
      throw new Error("Please select an image file to upload");
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await api.post("/image-upload", formData);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to upload image";
      throw new Error(message);
    }
  },

  /**
   * Delete popup image by filename
   * DELETE /api/image-upload/:filename
   */
  deleteImage: async (filename) => {
    if (!filename) {
      throw new Error("Filename is required for deletion");
    }

    // Extract bare filename if a full URL or path was passed
    const cleanFilename = filename.split("/").pop();

    try {
      // Note: Adding a trailing slash avoids Hostinger edge CDN intercepting
      // '*.jpg' as static file and blocking CORS preflight for DELETE requests.
      const response = await api.delete(`/image-upload/${cleanFilename}/`);
      return response.data;
    } catch (error) {
      // Fallback without trailing slash if needed
      try {
        const fallback = await api.delete(`/image-upload/${cleanFilename}`);
        return fallback.data;
      } catch (fbError) {
        const message =
          error.response?.data?.message ||
          fbError.response?.data?.message ||
          error.message ||
          "Failed to delete image";
        throw new Error(message);
      }
    }
  },
};

export default popupBannerService;
