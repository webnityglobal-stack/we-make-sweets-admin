import React, { useState, useRef } from "react";
import useReels from "@/hooks/useReels";
import {
  Film,
  Video,
  Play,
  Upload,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  Loader2,
  Sparkles,
  Info,
  X,
  Plus,
  HardDrive,
  Calendar,
} from "lucide-react";

const formatFileSize = (bytes) => {
  if (!bytes || isNaN(bytes)) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDate = (dateString) => {
  if (!dateString) return null;
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return null;
  }
};

const ReelManagement = () => {
  const {
    reels,
    slots,
    serverCount,
    maxReels,
    remainingSlots,
    loading,
    uploading,
    deletingFilename,
    error,
    success,
    fetchReels,
    uploadReels,
    deleteReel,
    clearMessages,
  } = useReels();

  const fileInputRef = useRef(null);
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState(null);

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // Reset input value so re-selecting same file works
    e.target.value = "";

    // Validate video types
    const validTypes = ["video/mp4", "video/webm", "video/quicktime"];
    const invalid = files.find((f) => !validTypes.includes(f.type) && !f.name.match(/\.(mp4|webm|mov)$/i));
    if (invalid) {
      alert(`Invalid format: "${invalid.name}". Only MP4, WebM, and MOV video files are allowed.`);
      return;
    }

    if (files.length > remainingSlots) {
      alert(`You can only upload up to ${remainingSlots} more reel(s). You selected ${files.length}.`);
      return;
    }

    try {
      await uploadReels(files);
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const handleDelete = async (filename) => {
    const confirm = window.confirm(
      `Are you sure you want to delete this reel?\n\nFile: ${filename}\nEndpoint: DELETE /api/reels/${filename}\n\nThis will permanently remove the reel from the storefront.`
    );
    if (!confirm) return;

    try {
      await deleteReel(filename);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleCopyUrl = (url) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => {
      setCopiedUrl(null);
    }, 2000);
  };

  const totalStorage = formatFileSize(
    reels.reduce((acc, r) => acc + (Number(r.size) || 0), 0)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <Film className="w-7 h-7 text-pink-500" />
              Storefront Reels Management
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20">
              {reels.length} / {maxReels} Reels Added
            </span>
            {loading && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                <Loader2 className="w-3 h-3 animate-spin text-pink-400" />
                <span>Syncing live...</span>
              </span>
            )}
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Upload and manage short video reels for the storefront homepage. Exactly 12 slots available.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchReels}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-pink-400" : ""}`} />
            <span>Sync Live</span>
          </button>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="video/mp4,video/webm,video/quicktime"
            multiple
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || remainingSlots <= 0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-semibold shadow-md shadow-pink-600/20 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5" />
            )}
            <span>{uploading ? "Uploading..." : "Upload Reel(s)"}</span>
          </button>

          <a
            href="https://www.wemakesweets.com"
            target="_blank"
            rel="noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white rounded-lg border border-slate-700 transition"
          >
            <span>Visit Store</span>
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

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Total Reel Slots</div>
            <div className="text-2xl font-bold text-white mt-1">12 Slots Max</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Fixed Storefront Layout</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-pink-400">
            <Film className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Reels Added (Active)</div>
            <div className="text-2xl font-bold text-emerald-400 mt-1">
              {reels.length} / 12 Added
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Live server count: <span className="text-emerald-400 font-semibold">{serverCount}</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Video className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Available Free Slots</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">
              {remainingSlots} Slots Left
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {remainingSlots > 0 ? "Ready for upload" : "All slots full"}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400 font-medium">Total Storage Used</div>
            <div className="text-2xl font-bold text-purple-400 mt-1">
              {totalStorage || "0 MB"}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Hostinger Cloud Storage
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <HardDrive className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Upload Zone / Notice */}
      <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Info className="w-4 h-4 text-pink-400 flex-shrink-0" />
          <span>
            Supported formats: <strong>MP4, WebM, MOV</strong> (Vertical 9:16 mobile ratio recommended, up to 100MB per video).
          </span>
        </div>
        <div className="text-slate-400">
          {remainingSlots > 0 ? (
            <span className="text-emerald-400 font-medium">
              ✓ Ready for upload ({remainingSlots} slot{remainingSlots !== 1 ? "s" : ""} free)
            </span>
          ) : (
            <span className="text-rose-400 font-medium">
              ⚠ Maximum 12 reels reached. Delete a reel to free up a slot.
            </span>
          )}
        </div>
      </div>

      {/* 12 Slots Grid (Vertical Video 9:16 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {slots.map((slot) => {
          const reel = slot.reel;
          const isDeleting = deletingFilename === reel?.filename;

          return (
            <div
              key={slot.slot}
              className={`relative rounded-2xl overflow-hidden border flex flex-col justify-between aspect-[9/16] transition-all duration-300 ${
                slot.isFilled
                  ? "border-slate-800 bg-slate-950 shadow-lg hover:border-slate-700 hover:shadow-pink-500/5 group"
                  : "border-dashed border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-900/30"
              }`}
            >
              {slot.isFilled && reel ? (
                <>
                  {/* Video Thumbnail / Canvas */}
                  <video
                    src={reel.url}
                    preload="metadata"
                    className="w-full h-full object-cover select-none pointer-events-none"
                    muted
                  />

                  {/* Slot Number Badge */}
                  <div className="absolute top-2 left-2 z-20 pointer-events-none">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/75 backdrop-blur text-white border border-white/10 shadow">
                      #{slot.slot}
                    </span>
                  </div>

                  {/* Top-Right Delete Action Button - Higher z-index to stay above play overlay */}
                  <div className="absolute top-2 right-2 z-30">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(reel.filename);
                      }}
                      disabled={isDeleting}
                      title="Delete Reel"
                      className="w-8 h-8 rounded-full bg-rose-600 hover:bg-rose-500 active:scale-95 text-white flex items-center justify-center transition-all shadow-lg cursor-pointer hover:scale-110 disabled:opacity-50 border border-white/20"
                    >
                      {isDeleting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Play Button Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-3 z-10 pointer-events-none">
                    <button
                      onClick={() => setActiveVideoModal(reel)}
                      className="w-12 h-12 rounded-full bg-pink-600 hover:bg-pink-500 text-white flex items-center justify-center shadow-xl cursor-pointer hover:scale-110 transition pointer-events-auto"
                      title="Play Reel Preview"
                    >
                      <Play className="w-5 h-5 ml-0.5 fill-white" />
                    </button>

                    <button
                      onClick={() => handleCopyUrl(reel.url)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/20 hover:bg-white/30 backdrop-blur text-white text-[10px] font-medium cursor-pointer transition shadow pointer-events-auto"
                    >
                      {copiedUrl === reel.url ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied URL</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Bottom Filename & Meta Bar */}
                  <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black via-black/85 to-transparent text-[9px] text-slate-300 z-10 space-y-0.5 pointer-events-none">
                    <div className="font-mono truncate">{reel.filename}</div>
                    <div className="flex items-center justify-between text-[8px] text-slate-400 font-sans">
                      <span>{formatFileSize(reel.size) || "Video"}</span>
                      {reel.createdAt && <span>{formatDate(reel.createdAt)}</span>}
                    </div>
                  </div>

                  {/* Deleting overlay */}
                  {isDeleting && (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-xs flex flex-col items-center justify-center gap-1.5 z-20">
                      <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
                      <span className="text-[10px] text-rose-300 font-semibold">Deleting reel...</span>
                    </div>
                  )}
                </>
              ) : (
                /* Empty Slot Placeholder */
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full h-full flex flex-col items-center justify-center p-3 text-center cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 group-hover:text-pink-400 group-hover:border-pink-500/30 transition mb-2">
                    <Plus className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-400 group-hover:text-white transition">
                    Slot {slot.slot}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5">Click to upload</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Video Preview Modal */}
      {activeVideoModal && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveVideoModal(null)}
        >
          <div
            className="relative max-w-sm w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex flex-col gap-0.5 min-w-0 pr-2">
                <div className="flex items-center gap-1.5">
                  <Film className="w-4 h-4 text-pink-400 flex-shrink-0" />
                  <span className="text-xs font-bold text-white truncate max-w-[200px]">
                    {activeVideoModal.filename}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                  {activeVideoModal.size && (
                    <span className="text-slate-300 font-medium">
                      {formatFileSize(activeVideoModal.size)}
                    </span>
                  )}
                  {activeVideoModal.createdAt && (
                    <span>• {formatDate(activeVideoModal.createdAt)}</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-[9/16] w-full bg-black flex items-center justify-center">
              <video
                src={activeVideoModal.url}
                controls
                autoPlay
                playsInline
                loop
                className="w-full h-full object-contain"
              />
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
              <button
                onClick={() => handleCopyUrl(activeVideoModal.url)}
                className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white cursor-pointer"
              >
                {copiedUrl === activeVideoModal.url ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  const fname = activeVideoModal.filename;
                  setActiveVideoModal(null);
                  handleDelete(fname);
                }}
                className="inline-flex items-center gap-1 text-rose-400 hover:text-rose-300 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReelManagement;
