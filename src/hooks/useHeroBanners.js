import { useState, useEffect, useCallback } from "react";
import heroBannerService, { getHeroImageUrl } from "../services/heroBanner.service";

export const useHeroBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingSlot, setUploadingSlot] = useState(null);
  const [deletingSlot, setDeletingSlot] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await heroBannerService.getBanners();
      setBanners(data);
    } catch (err) {
      setError(err.message || "Failed to load hero banners");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  // Construct structured slots 1, 2, and 3
  const slots = [1, 2, 3].map((slotNum) => {
    const found = banners.find((b) => Number(b.slot) === slotNum);
    return {
      slot: slotNum,
      banner: found || null,
      image: found?.image || null,
      imageUrl: found?.image ? getHeroImageUrl(found.image) : null,
      isActive: found?.isActive ?? false,
      updatedAt: found?.updatedAt || null,
    };
  });

  const uploadBanner = async (slot, file) => {
    try {
      setUploadingSlot(slot);
      setError(null);
      setSuccess(null);
      const res = await heroBannerService.uploadBanner(slot, file);
      await fetchBanners();
      setSuccess(res.message || `Hero banner for Slot ${slot} uploaded successfully!`);
      return res;
    } catch (err) {
      setError(err.message || `Failed to upload banner for Slot ${slot}`);
      throw err;
    } finally {
      setUploadingSlot(null);
    }
  };

  const deleteBanner = async (slot) => {
    try {
      setDeletingSlot(slot);
      setError(null);
      setSuccess(null);
      const res = await heroBannerService.deleteBanner(slot);
      await fetchBanners();
      setSuccess(res.message || `Hero banner for Slot ${slot} removed. Storefront will use default image.`);
      return res;
    } catch (err) {
      setError(err.message || `Failed to delete banner for Slot ${slot}`);
      throw err;
    } finally {
      setDeletingSlot(null);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return {
    banners,
    slots,
    loading,
    uploadingSlot,
    deletingSlot,
    error,
    success,
    fetchBanners,
    uploadBanner,
    deleteBanner,
    clearMessages,
  };
};

export default useHeroBanners;
