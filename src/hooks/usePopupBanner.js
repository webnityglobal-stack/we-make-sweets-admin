import { useState, useEffect, useCallback } from "react";
import popupBannerService, { getPopupImageUrl } from "../services/popupBanner.service";
import { compressImage } from "../lib/imageCompressor";

export const usePopupBanner = () => {
  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchImage = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const resData = await popupBannerService.getImages();

      // Extract list from { success: true, count: 1, images: [...] }
      const imagesList = Array.isArray(resData?.images)
        ? resData.images
        : Array.isArray(resData)
        ? resData
        : resData?.image
        ? [resData.image]
        : [];

      const formattedList = imagesList.map((item) => ({
        filename: item.filename,
        path: item.path,
        size: item.size,
        imageUrl: getPopupImageUrl(item),
        raw: item,
      }));

      setImages(formattedList);
      setCount(resData?.count ?? formattedList.length);

      // Only one active image is maintained for the popup modal
      if (formattedList.length > 0) {
        // Pick the latest image as active
        setImage(formattedList[formattedList.length - 1]);
      } else {
        setImage(null);
      }
    } catch (err) {
      setError(err.message || "Failed to load popup banner image");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImage();
  }, [fetchImage]);

  const selectImage = (selectedImg) => {
    setImage(selectedImg);
  };

  const uploadImage = async (file) => {
    if (image) {
      const msg = "Only 1 image can be uploaded! Please delete the current image before uploading a new one.";
      setError(msg);
      throw new Error(msg);
    }

    try {
      setUploading(true);
      setError(null);
      setSuccess(null);


      // Client-side compression if image is > 2.5MB
      const processedFile = await compressImage(file, 2.5);

      const res = await popupBannerService.uploadImage(processedFile);

      // Immediately refresh live data from GET /api/image-upload
      await fetchImage();

      setSuccess(res.message || "Popup banner image uploaded successfully!");
      return res;
    } catch (err) {
      setError(err.message || "Failed to upload popup banner image");
      throw err;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (filename) => {
    try {
      setDeleting(true);
      setError(null);
      setSuccess(null);

      const fileToDelete = filename || image?.filename;
      if (!fileToDelete) {
        throw new Error("No image to delete");
      }

      const res = await popupBannerService.deleteImage(fileToDelete);
      
      // Clear active image if deleted image was the active one
      if (image?.filename === fileToDelete) {
        setImage(null);
      }

      await fetchImage();
      setSuccess(res.message || "Image deleted successfully.");
      return res;
    } catch (err) {
      setError(err.message || "Failed to delete popup banner image");
      throw err;
    } finally {
      setDeleting(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return {
    image,
    images,
    count,
    loading,
    uploading,
    deleting,
    error,
    success,
    fetchImage,
    uploadImage,
    deleteImage,
    selectImage,
    clearMessages,
  };
};

export default usePopupBanner;
