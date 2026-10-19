import React, { useState, useRef } from "react";
import usePopupBanner from "@/hooks/usePopupBanner";
import {
  Megaphone,
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
  Copy,
  Check,
  Smartphone,
  Monitor,
  Tag,
  ShieldCheck,
  Layers,
  ZoomIn,
  Lock,
} from "lucide-react";

const formatBytes = (bytes, decimals = 2) => {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const PopupBannerManagement = () => {
  const {
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
  } = usePopupBanner();

  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showModalPreview, setShowModalPreview] = useState(false);
  const [showFullImageModal, setShowFullImageModal] = useState(false);
  const [previewDevice, setPreviewDevice] = useState("desktop"); // 'desktop' | 'mobile'
  const [imageLoadError, setImageLoadError] = useState(false);

  const handleFileProcess = async (file) => {
    if (!file) return;

    // Validate image format
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      alert("Invalid format! Please upload only JPG, JPEG, PNG, or WEBP images.");
      return;
    }

    try {
      setImageLoadError(false);
      await uploadImage(file);
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDelete = async (filenameToDelete) => {
    const targetFile = filenameToDelete || image?.filename;
    if (!targetFile) return;

    const confirm = window.confirm(
      `Are you sure you want to remove the promotional popup image?\n\nFile: ${targetFile}\n\nOnce removed, no popup modal will appear on the storefront until a new image is uploaded.`
    );
    if (!confirm) return;

    try {
      await deleteImage(targetFile);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleCopyUrl = () => {
    if (!image?.imageUrl && !image?.path) return;
    const url = image.imageUrl || image.path;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg"
        multiple={false}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-500/20 text-white">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  Popup Banner Management
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20">
                  Single Image Slot
                </span>
              </div>
              <p className="text-slate-400 text-sm mt-0.5">
                Manage and preview the promotional offer or coupon modal image shown to customers when they land on the storefront.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setImageLoadError(false);
              fetchImage();
            }}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition cursor-pointer disabled:opacity-50"
            title="Refresh current popup status from GET /api/image-upload"
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

      {/* Alert Messages */}
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
            <div className="text-xs text-slate-400 font-medium">Slot Policy</div>
            <div className="text-xl font-bold text-white mt-1">1 Active Slot</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Single Popup Modal Active</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
            <Tag className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Storefront Status</div>
            <div className={`text-xl font-bold mt-1 ${image ? "text-emerald-400" : "text-amber-400"}`}>
              {image ? "Active & Live" : "No Active Popup"}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {image ? `Showing on storefront (${count} stored)` : "Modal hidden on storefront"}
            </div>
          </div>
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              image
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                : "bg-amber-500/10 border border-amber-500/20 text-amber-400"
            }`}
          >
            {image ? <CheckCircle2 className="w-5 h-5" /> : <ImageIcon className="w-5 h-5" />}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Active File Info</div>
            <div className="text-xl font-bold text-white mt-1">
              {image ? formatBytes(image.size) : "No File"}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[180px]">
              {image ? image.filename : "Ready for upload"}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Explanatory Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-slate-900/60 border border-pink-500/20 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-semibold text-pink-300">
              Live Preview & Storefront Modal Integration:
            </span>
            <p className="text-slate-300 leading-relaxed">
              The preview below is fetched directly from <code>GET /api/image-upload</code>. Only <strong>1 image</strong> is shown to customers as a popup modal over the website when they arrive. Uploading a new image will update this active banner immediately.
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-emerald-400 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>GET /image-upload Connected</span>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="p-12 rounded-2xl border border-slate-800 bg-slate-900/40 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
          <span className="text-xs text-slate-400">Fetching popup image from server...</span>
        </div>
      ) : image ? (
        /* Image is active: Display Card + Actions */
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/40">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white leading-tight">
                    Active Popup Modal Banner (Live Preview)
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live on Website
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Fetched via <code>GET /api/image-upload</code>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowModalPreview(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-600/20 hover:bg-pink-600/30 text-pink-300 border border-pink-500/30 text-xs font-medium transition cursor-pointer"
                title="Preview storefront entry popup modal"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Simulate Popup</span>
              </button>

              <button
                onClick={() => setShowFullImageModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition cursor-pointer"
                title="View image full resolution"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Full Preview</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition cursor-pointer disabled:opacity-50"
                title="Replace current banner with a new one"
              >
                {uploading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-pink-400" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                <span>Replace Image</span>
              </button>

              <button
                onClick={() => handleDelete(image.filename)}
                disabled={deleting}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-medium transition cursor-pointer disabled:opacity-50"
                title="Remove popup banner"
              >
                {deleting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" />
                ) : (
                  <Trash2 className="w-3.5 h-3.5" />
                )}
                <span>Delete</span>
              </button>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Visual Image Preview */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div
                className="relative group w-full max-w-md rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/80 shadow-inner flex items-center justify-center cursor-pointer min-h-[300px]"
                onClick={() => setShowModalPreview(true)}
              >
                {imageLoadError ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400">
                    <AlertCircle className="w-10 h-10 text-rose-400 mb-2" />
                    <span className="text-xs font-medium">Image preview unavailable</span>
                    <a
                      href={image.imageUrl || image.path}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-pink-400 underline mt-1"
                    >
                      Open direct link
                    </a>
                  </div>
                ) : (
                  <img
                    src={image.imageUrl || image.path}
                    alt={image.filename || "Storefront Promotional Modal"}
                    onError={() => setImageLoadError(true)}
                    className="w-full h-auto max-h-[420px] object-contain rounded-xl transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                )}

                {/* Hover Overlay */}
                {!imageLoadError && (
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-xs">
                    <div className="w-12 h-12 rounded-full bg-pink-600 text-white flex items-center justify-center shadow-lg">
                      <Eye className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-white">
                      Click to Test Storefront Modal
                    </span>
                  </div>
                )}
              </div>
              <span className="text-[11px] text-slate-500 mt-2">
                Click image to open interactive storefront simulation
              </span>
            </div>

            {/* Metadata & Details */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Image Specifications (From GET /image-upload)
                </h3>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">File Name</span>
                    <span className="font-mono text-slate-200 font-medium truncate max-w-[220px]" title={image.filename}>
                      {image.filename}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">File Size</span>
                    <span className="font-medium text-slate-200">{formatBytes(image.size)}</span>
                  </div>

                  <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Live Status</span>
                    <span className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      Active & Serving
                    </span>
                  </div>

                  <div className="py-1.5">
                    <span className="text-slate-400 block mb-1.5">Hosted URL (GET path)</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={image.imageUrl || image.path}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-[11px] font-mono text-slate-300 focus:outline-none"
                      />
                      <button
                        onClick={handleCopyUrl}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs transition cursor-pointer flex-shrink-0"
                        title="Copy direct URL"
                      >
                        {copied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <a
                        href={image.imageUrl || image.path}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs transition flex-shrink-0"
                        title="Open image directly in new tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Update or Replace Active Banner
                </h3>
                <p className="text-xs text-slate-400">
                  {image
                    ? "An image is already active. Delete the current banner first, then upload a new one."
                    : "Want to launch a different promotional banner or coupon? Select a new image to replace the current one."}
                </p>
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <button
                    onClick={() => !image && fileInputRef.current?.click()}
                    disabled={uploading || !!image}
                    title={image ? "Delete the current image first before uploading a new one" : "Upload a new banner"}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold shadow-md transition ${
                      image
                        ? "bg-slate-700/60 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60"
                        : "bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white shadow-pink-600/20 cursor-pointer"
                    } disabled:opacity-50`}
                  >
                    {uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : image ? (
                      <Lock className="w-4 h-4" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    <span>{uploading ? "Uploading..." : image ? "Upload Disabled (1 Slot Used)" : "Upload New Banner"}</span>
                  </button>

                  <button
                    onClick={() => setShowModalPreview(true)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-pink-400" />
                    <span>Live Simulator</span>
                  </button>

                  <button
                    onClick={() => setShowFullImageModal(true)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition cursor-pointer"
                  >
                    <ZoomIn className="w-4 h-4 text-slate-400" />
                    <span>Full Preview</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* No Image: Empty Upload Dropzone */
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative rounded-2xl border-2 border-dashed transition-all p-10 flex flex-col items-center justify-center text-center ${
            isDragOver
              ? "border-pink-500 bg-pink-500/10 scale-[1.01]"
              : "border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-900/70"
          }`}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-rose-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-4 shadow-lg shadow-pink-500/10">
            {uploading ? (
              <Loader2 className="w-8 h-8 animate-spin text-pink-400" />
            ) : (
              <Upload className="w-8 h-8 text-pink-400" />
            )}
          </div>

          <h3 className="text-lg font-bold text-white">
            {uploading ? "Uploading Promotional Banner..." : "Upload Storefront Coupon / Popup Image"}
          </h3>
          <p className="text-xs text-slate-400 mt-1.5 max-w-md">
            Drag and drop your promotional image here, or click the button below to browse. Only 1 active image can be uploaded to the panel.
          </p>

          <div className="flex items-center gap-2 mt-4 text-[11px] text-slate-400">
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">JPG</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">PNG</span>
            <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700">WEBP</span>
            <span className="text-slate-500">•</span>
            <span>Recommended: Square (e.g. 800×800) or Portrait (800×1000)</span>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-semibold shadow-lg shadow-pink-600/25 transition cursor-pointer disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span>{uploading ? "Uploading Image..." : "Select Image to Upload"}</span>
          </button>
        </div>
      )}

      {/* Guidelines Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-pink-400 text-xs font-bold">
            <Tag className="w-4 h-4" />
            <span>Recommended Usage</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Use this slot for time-sensitive promotions such as <strong>Festive Discounts</strong>, <strong>Coupon Codes (e.g. SWEET10)</strong>, <strong>Free Delivery Offers</strong>, or <strong>New Launch Announcements</strong>. Visitors will see this popup immediately upon loading the site.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Automatic Optimization</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Images are automatically verified and compressed on upload to ensure super-fast loading times without degrading sharpness or sweet graphics.
          </p>
        </div>
      </div>

      {/* Storefront Modal Simulation Preview */}
      {showModalPreview && image && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Simulator Header */}
            <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs font-semibold text-slate-300 ml-2">
                  Storefront Entry Popup Simulator
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                  GET /image-upload
                </span>
              </div>

              {/* Viewport switch & Close */}
              <div className="flex items-center gap-2">
                <div className="bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60 flex items-center">
                  <button
                    onClick={() => setPreviewDevice("desktop")}
                    className={`px-2.5 py-1 rounded text-xs flex items-center gap-1.5 transition ${
                      previewDevice === "desktop"
                        ? "bg-pink-600 text-white font-medium"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Desktop</span>
                  </button>
                  <button
                    onClick={() => setPreviewDevice("mobile")}
                    className={`px-2.5 py-1 rounded text-xs flex items-center gap-1.5 transition ${
                      previewDevice === "mobile"
                        ? "bg-pink-600 text-white font-medium"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Mobile</span>
                  </button>
                </div>

                <button
                  onClick={() => setShowModalPreview(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                  title="Close simulator"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Simulated Storefront Viewport */}
            <div className="relative flex-1 overflow-y-auto bg-[#070e28] p-6 flex items-center justify-center min-h-[480px]">
              {/* Simulated Website Background (Blurred to represent modal backdrop) */}
              <div className="absolute inset-0 select-none pointer-events-none opacity-20 filter blur-xs overflow-hidden p-6 space-y-6">
                <div className="h-10 bg-slate-800 rounded-lg flex items-center px-4 justify-between">
                  <div className="w-28 h-4 bg-pink-500 rounded"></div>
                  <div className="flex gap-4">
                    <div className="w-16 h-3 bg-slate-700 rounded"></div>
                    <div className="w-16 h-3 bg-slate-700 rounded"></div>
                    <div className="w-16 h-3 bg-slate-700 rounded"></div>
                  </div>
                </div>
                <div className="h-44 bg-gradient-to-r from-pink-900/60 to-purple-900/60 rounded-xl"></div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="h-32 bg-slate-800 rounded-xl"></div>
                  <div className="h-32 bg-slate-800 rounded-xl"></div>
                  <div className="h-32 bg-slate-800 rounded-xl"></div>
                  <div className="h-32 bg-slate-800 rounded-xl"></div>
                </div>
              </div>

              {/* Dark Overlay Backdrop */}
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>

              {/* Centered Popup Modal Container */}
              <div
                className={`relative z-10 transition-all duration-300 ${
                  previewDevice === "mobile" ? "w-[300px]" : "w-[440px] max-w-full"
                }`}
              >
                {/* Modal Card */}
                <div className="relative rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-pink-500/30 shadow-2xl shadow-black/80 overflow-hidden animate-in zoom-in-95 duration-200">
                  {/* Modal Close Button */}
                  <button
                    onClick={() => setShowModalPreview(false)}
                    className="absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition cursor-pointer shadow-md"
                    title="Simulated close modal"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Uploaded Popup Image */}
                  <div className="p-2 sm:p-3">
                    <img
                      src={image.imageUrl || image.path}
                      alt="Promotional Offer"
                      className="w-full h-auto rounded-xl object-contain shadow-sm"
                    />
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <span className="text-[11px] text-slate-400 font-medium bg-black/50 px-3 py-1 rounded-full border border-white/10 backdrop-blur">
                    This is how customers will see the offer popup on {previewDevice}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-pink-400" />
                Visitors can close this modal using the top-right button or by clicking anywhere outside.
              </span>
              <button
                onClick={() => setShowModalPreview(false)}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition cursor-pointer"
              >
                Close Simulator
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Direct Full-Size Preview Modal */}
      {showFullImageModal && image && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowFullImageModal(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-2xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white">Full Resolution Preview</span>
                <span className="text-[11px] font-mono text-slate-400">({image.filename})</span>
              </div>
              <button
                onClick={() => setShowFullImageModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img
              src={image.imageUrl || image.path}
              alt={image.filename}
              className="max-h-[75vh] w-auto object-contain rounded-xl shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PopupBannerManagement;
