import React, { useState, useRef } from "react";
import useHeroBanners from "@/hooks/useHeroBanners";
import {
  Sliders,
  Upload,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  ExternalLink,
  Eye,
  Loader2,
  Sparkles,
  Info,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const SLOT_CONFIGS = {
  1: {
    title: "Slot 1 - Primary Hero",
    desc: "First slide shown when visitors arrive on the homepage.",
    badgeColor: "from-pink-500 to-rose-600",
  },
  2: {
    title: "Slot 2 - Secondary Hero",
    desc: "Second promotional slide highlighting special sweet boxes or offers.",
    badgeColor: "from-purple-500 to-indigo-600",
  },
  3: {
    title: "Slot 3 - Showcase Hero",
    desc: "Third slide showcasing gifting, festive specials, or premium snacks.",
    badgeColor: "from-amber-500 to-orange-600",
  },
};

const HeroBannerManagement = () => {
  const {
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
  } = useHeroBanners();

  const [previewImage, setPreviewImage] = useState(null);
  const [activePreviewSlide, setActivePreviewSlide] = useState(0);

  // Separate file inputs for each slot
  const fileInputRefs = {
    1: useRef(null),
    2: useRef(null),
    3: useRef(null),
  };

  const handleFileSelect = async (slotNum, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      alert("Invalid format! Only JPG, JPEG, PNG, and WEBP images are allowed.");
      e.target.value = "";
      return;
    }

    try {
      await uploadBanner(slotNum, file);
    } catch (err) {
      console.error(err);
    } finally {
      // Reset input value so re-uploading same file works
      if (fileInputRefs[slotNum]?.current) {
        fileInputRefs[slotNum].current.value = "";
      }
    }
  };

  const handleDelete = async (slotNum) => {
    const confirm = window.confirm(
      `Are you sure you want to remove the custom banner for Slot ${slotNum}?\n\nThe storefront will automatically revert to its default hero image.`
    );
    if (!confirm) return;

    try {
      await deleteBanner(slotNum);
    } catch (err) {
      console.error(err);
    }
  };

  // Stats calculation
  const activeCount = slots.filter((s) => s.image).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <Sliders className="w-7 h-7 text-pink-500" />
              Hero Banner Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20">
              3 Slots Only
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Manage the 3 hero slider banners displayed on the storefront homepage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchBanners}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-pink-400" : ""}`} />
            <span>Sync Live</span>
          </button>

          <a
            href="https://www.wemakesweets.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-semibold shadow-md shadow-pink-600/20 transition"
          >
            <span>View Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Alert Banners */}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="font-medium">{success}</span>
          </div>
          <button
            onClick={clearMessages}
            className="text-emerald-400/80 hover:text-emerald-200 p-1 rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
          <button
            onClick={clearMessages}
            className="text-rose-400/80 hover:text-rose-200 p-1 rounded cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* KPI Overview Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Total Allowed Slots</div>
            <div className="text-2xl font-bold text-white mt-1">3 Fixed Slots</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
            <Sliders className="w-5 h-5 text-pink-400" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Custom Banners Uploaded</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">
              {activeCount} of 3 Active
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Default Fallback Slots</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">
              {3 - activeCount} Default
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <ImageIcon className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 3 Hero Banner Slots Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {slots.map((slot) => {
          const config = SLOT_CONFIGS[slot.slot] || {
            title: `Slot ${slot.slot}`,
            desc: "Storefront slider banner.",
            badgeColor: "from-pink-500 to-rose-600",
          };
          const isUploading = uploadingSlot === slot.slot;
          const isDeleting = deletingSlot === slot.slot;
          const hasImage = Boolean(slot.imageUrl);

          return (
            <div
              key={slot.slot}
              className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden shadow-xl hover:border-slate-700 transition duration-300"
            >
              {/* Slot Header */}
              <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${config.badgeColor} flex items-center justify-center text-white font-bold text-xs shadow-sm`}
                  >
                    {slot.slot}
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-white leading-tight">
                      {config.title}
                    </h2>
                    <p className="text-[11px] text-slate-400 mt-0.5">{config.desc}</p>
                  </div>
                </div>

                {hasImage ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Live
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    Default
                  </span>
                )}
              </div>

              {/* Banner Visual Area (16:9 ratio) */}
              <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden border-b border-slate-800 group">
                {hasImage ? (
                  <>
                    <img
                      src={slot.imageUrl}
                      alt={`Hero Banner Slot ${slot.slot}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2.5 p-4">
                      <button
                        onClick={() => setPreviewImage(slot.imageUrl)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-semibold cursor-pointer transition shadow-lg"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview</span>
                      </button>
                      <button
                        onClick={() => handleDelete(slot.slot)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 backdrop-blur-md text-white text-xs font-semibold cursor-pointer transition shadow-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>

                    {/* Timestamp badge */}
                    {slot.updatedAt && (
                      <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 backdrop-blur-sm text-[9px] font-mono text-slate-300 pointer-events-none">
                        Updated {new Date(slot.updatedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center text-slate-500">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-dashed border-slate-700 flex items-center justify-center mb-2 text-slate-400">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium text-slate-400">
                      Slot {slot.slot} is Empty
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1 max-w-[200px]">
                      Storefront will automatically display its default fallback banner.
                    </span>
                  </div>
                )}

                {/* Loading overlay */}
                {(isUploading || isDeleting) && (
                  <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-20">
                    <Loader2 className="w-7 h-7 animate-spin text-pink-500" />
                    <span className="text-xs font-semibold text-white">
                      {isUploading ? "Uploading image..." : "Removing banner..."}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1 justify-between">
                <div className="text-[11px] text-slate-400 flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-pink-400 flex-shrink-0 mt-0.5" />
                  <span>
                    Accepted formats: <strong>JPG, PNG, WEBP</strong>. Recommended ratio: <strong>16:9</strong> (e.g. 1920×800 or 1920×1080).
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={fileInputRefs[slot.slot]}
                    onChange={(e) => handleFileSelect(slot.slot, e)}
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    className="hidden"
                  />

                  {/* Upload / Replace Button */}
                  <button
                    onClick={() => fileInputRefs[slot.slot]?.current?.click()}
                    disabled={isUploading || isDeleting}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 active:scale-[0.99] text-white text-xs font-semibold shadow-md shadow-pink-600/20 transition cursor-pointer disabled:opacity-50"
                  >
                    {isUploading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>{hasImage ? "Replace Banner" : `Upload Slot ${slot.slot}`}</span>
                  </button>

                  {/* Delete Button */}
                  {hasImage && (
                    <button
                      onClick={() => handleDelete(slot.slot)}
                      disabled={isUploading || isDeleting}
                      title={`Delete Slot ${slot.slot} Image (DELETE /api/hero-banner/${slot.slot})`}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      )}
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Storefront Hero Slider Simulator */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">
              Storefront Hero Preview (3-Slot Carousel)
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Simulates how the 3 slider images appear on the live storefront
          </span>
        </div>

        <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
          {slots[activePreviewSlide]?.imageUrl ? (
            <img
              src={slots[activePreviewSlide].imageUrl}
              alt={`Slide ${activePreviewSlide + 1}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6">
              <ImageIcon className="w-10 h-10 text-slate-600 mb-2" />
              <div className="text-sm font-semibold text-slate-300">
                Slot {activePreviewSlide + 1} Default Storefront Banner
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                No custom image uploaded yet for this slot. Default branding active.
              </p>
            </div>
          )}

          {/* Navigation Arrows */}
          <button
            onClick={() => setActivePreviewSlide((prev) => (prev === 0 ? 2 : prev - 1))}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur text-white flex items-center justify-center transition cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActivePreviewSlide((prev) => (prev === 2 ? 0 : prev + 1))}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur text-white flex items-center justify-center transition cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur px-3 py-1.5 rounded-full">
            {[0, 1, 2].map((idx) => (
              <button
                key={idx}
                onClick={() => setActivePreviewSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  activePreviewSlide === idx
                    ? "w-6 bg-pink-500"
                    : "w-2 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Active Slot Badge */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur text-xs font-semibold text-white">
            Displaying: Slot {activePreviewSlide + 1}
          </div>
        </div>
      </div>

      {/* Fullscreen Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-10 right-0 text-white/80 hover:text-white p-1 cursor-pointer flex items-center gap-1 text-xs"
            >
              <X className="w-5 h-5" />
              <span>Close</span>
            </button>
            <img
              src={previewImage}
              alt="Fullscreen Preview"
              className="max-h-[85vh] w-auto max-w-full rounded-xl object-contain border border-slate-700 shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroBannerManagement;
