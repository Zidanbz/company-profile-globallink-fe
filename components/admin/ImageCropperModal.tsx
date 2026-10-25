"use client";

import React, { useState, useCallback, useEffect } from "react";
import Cropper, { Area } from "react-easy-crop";
import {
  AlertTriangle,
  Crop,
  ZoomIn,
  ZoomOut,
  RotateCw,
  UploadCloud,
  X,
  CheckCircle2,
  RefreshCw,
  Loader2,
  Maximize2,
  Info,
  Sparkles,
  Check,
} from "lucide-react";
import getCroppedImg, { PixelCrop } from "@/lib/cropImage";

export interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
  fileName: string;
  fileMimeType?: string;
  sourceDimensions: { width: number; height: number };
  minWidth?: number;
  minHeight?: number;
  aspectRatio?: number | null; // e.g. 16/9, 4/3, 1, or null for auto/free
  aspectRatioLabel?: string; // e.g. "Auto / Sesuai Logo"
  onCropComplete: (croppedBlob: Blob, croppedUrl: string) => Promise<void> | void;
  onSelectAnotherFile: () => void;
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  fileName,
  fileMimeType = "image/jpeg",
  sourceDimensions,
  minWidth = 800,
  minHeight = 450,
  aspectRatio,
  aspectRatioLabel = "16:9",
  onCropComplete,
  onSelectAnotherFile,
}) => {
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [ignoreWarning, setIgnoreWarning] = useState<boolean>(false);

  // Natural aspect ratio of the loaded source image
  const originalRatio =
    sourceDimensions.width > 0 && sourceDimensions.height > 0
      ? sourceDimensions.width / sourceDimensions.height
      : 1;

  // Active aspect ratio selection
  // If aspectRatio is explicitly null or undefined, default to "auto" (matches logo's natural ratio)
  const [selectedRatioMode, setSelectedRatioMode] = useState<
    "auto" | "preset" | "free" | "1:1" | "16:9"
  >(aspectRatio === null ? "auto" : typeof aspectRatio === "number" ? "preset" : "auto");

  // Reset controls whenever a new image or modal opens
  useEffect(() => {
    if (isOpen) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
      setIgnoreWarning(false);
      setSelectedRatioMode(
        aspectRatio === null ? "auto" : typeof aspectRatio === "number" ? "preset" : "auto"
      );
    }
  }, [isOpen, imageSrc, aspectRatio]);

  const onCropChange = (newCrop: { x: number; y: number }) => {
    setCrop(newCrop);
  };

  const onZoomChange = (newZoom: number) => {
    setZoom(newZoom);
  };

  const onCropAreaComplete = useCallback(
    (_croppedArea: Area, areaPixels: Area) => {
      setCroppedAreaPixels(areaPixels);
    },
    []
  );

  if (!isOpen || !imageSrc) return null;

  const isTooSmall =
    !ignoreWarning &&
    (sourceDimensions.width < minWidth || sourceDimensions.height < minHeight);

  // Determine active aspect value passed to Cropper
  const activeAspect = (() => {
    switch (selectedRatioMode) {
      case "auto":
        return originalRatio;
      case "preset":
        return typeof aspectRatio === "number" ? aspectRatio : originalRatio;
      case "1:1":
        return 1;
      case "16:9":
        return 16 / 9;
      case "free":
        return undefined;
      default:
        return originalRatio;
    }
  })();

  const handleApplyCrop = async () => {
    if (!croppedAreaPixels || !imageSrc) return;
    try {
      setIsProcessing(true);
      const { blob, url } = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation,
        { horizontal: false, vertical: false },
        fileMimeType.includes("png") ? "image/png" : "image/jpeg",
        0.95
      );
      await onCropComplete(blob, url);
      onClose();
    } catch (error) {
      console.error("Gagal melakukan crop gambar:", error);
      alert("Terjadi kesalahan saat memotong gambar. Silakan coba lagi.");
    } finally {
      setIsProcessing(false);
    }
  };

  // One-click Auto-Fit: use 100% of the full image without any cropping cutoff
  const handleUseFullImage = async () => {
    if (!imageSrc) return;
    try {
      setIsProcessing(true);
      const fullCrop: PixelCrop = {
        x: 0,
        y: 0,
        width: sourceDimensions.width,
        height: sourceDimensions.height,
      };
      const { blob, url } = await getCroppedImg(
        imageSrc,
        fullCrop,
        rotation,
        { horizontal: false, vertical: false },
        fileMimeType.includes("png") ? "image/png" : "image/jpeg",
        0.95
      );
      await onCropComplete(blob, url);
      onClose();
    } catch (error) {
      console.error("Gagal menggunakan gambar utuh:", error);
      alert("Terjadi kesalahan saat memproses gambar utuh. Silakan coba lagi.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isTooSmall
                  ? "bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400"
                  : "bg-blue-100 dark:bg-blue-950/50 text-[#0066ff] dark:text-blue-400"
              }`}
            >
              {isTooSmall ? (
                <AlertTriangle className="w-5 h-5" />
              ) : (
                <Crop className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {isTooSmall ? "Dimensi Gambar Tidak Sesuai" : "Penyesuaian & Pemotongan Gambar (Crop)"}
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs sm:max-w-md">
                {fileName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {isTooSmall ? (
          /* Warning Dialog: Image is Too Small */
          <div className="p-6 sm:p-8 flex flex-col items-center text-center space-y-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-500 animate-bounce">
              <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <div className="space-y-2 max-w-lg">
              <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Resolusi Gambar di Bawah Standar Minimum
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Gambar yang Anda pilih berukuran{" "}
                <span className="font-bold text-red-500">
                  {sourceDimensions.width} × {sourceDimensions.height} px
                </span>
                . Standar minimum untuk bagian ini adalah{" "}
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {minWidth} × {minHeight} px
                </span>
                .
              </p>
              <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-[11px] sm:text-xs text-amber-800 dark:text-amber-300 text-left flex items-start gap-2.5 mt-3">
                <Info className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                <p>
                  Gambar beresolusi kecil mungkin terlihat kurang tajam pada layar monitor & smartphone modern, namun Anda tetap dapat memilih untuk melanjutkan jika logo sudah sesuai.
                </p>
              </div>
            </div>

            {/* Thumbnail preview */}
            <div className="p-2 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 max-w-xs">
              <img
                src={imageSrc}
                alt="Selected"
                className="max-h-28 rounded-xl object-contain mx-auto"
              />
              <div className="mt-1.5 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Terdeteksi: {sourceDimensions.width} × {sourceDimensions.height} px
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-md pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => setIgnoreWarning(true)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 text-xs font-bold transition-colors"
              >
                Tetap Lanjutkan
              </button>
              <button
                type="button"
                onClick={onSelectAnotherFile}
                className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-[#0066ff] hover:bg-[#0052cc] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Pilih Gambar Lain</span>
              </button>
            </div>
          </div>
        ) : (
          /* Cropper Workspace */
          <div className="flex-1 flex flex-col min-h-0">
            {/* Top Toolbar: Resolution Info & Aspect Ratio Selectors */}
            <div className="bg-slate-50 dark:bg-slate-950/80 px-4 sm:px-6 py-2.5 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
                  <Maximize2 className="w-3.5 h-3.5 text-[#0066ff]" />
                  Asli:{" "}
                  <strong className="font-mono text-slate-900 dark:text-white">
                    {sourceDimensions.width} × {sourceDimensions.height} px
                  </strong>
                </span>

                {croppedAreaPixels && (
                  <span className="hidden sm:inline font-mono font-bold text-[#0066ff] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-900 text-[11px]">
                    Crop: {Math.round(croppedAreaPixels.width)} × {Math.round(croppedAreaPixels.height)} px
                  </span>
                )}
              </div>

              {/* Ratio Mode Switcher Pills */}
              <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
                <button
                  type="button"
                  onClick={() => setSelectedRatioMode("auto")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                    selectedRatioMode === "auto"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                  title="Sistem otomatis menyesuaikan rasio kotak crop dengan dimensi logo asli"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Auto Logo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRatioMode("free")}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    selectedRatioMode === "free"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                  title="Crop bebas tanpa batas rasio"
                >
                  Bebas
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedRatioMode("1:1")}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    selectedRatioMode === "1:1"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                  title="Rasio persegi 1:1"
                >
                  1:1
                </button>

                {typeof aspectRatio === "number" && aspectRatio !== 1 && aspectRatio !== 16 / 9 && (
                  <button
                    type="button"
                    onClick={() => setSelectedRatioMode("preset")}
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      selectedRatioMode === "preset"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {aspectRatioLabel}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedRatioMode("16:9")}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    selectedRatioMode === "16:9"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                  title="Rasio banner landscape 16:9"
                >
                  16:9
                </button>
              </div>
            </div>

            {/* Cropper Canvas Container */}
            <div className="relative flex-1 min-h-[340px] sm:min-h-[400px] bg-slate-950">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={activeAspect}
                onCropChange={onCropChange}
                onCropComplete={onCropAreaComplete}
                onZoomChange={onZoomChange}
                showGrid={true}
              />
            </div>

            {/* Controls Bar */}
            <div className="p-4 sm:p-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Zoom control */}
                <div className="flex items-center gap-2.5 min-w-[200px] flex-1">
                  <ZoomOut className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="range"
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.05}
                    aria-labelledby="Zoom"
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0066ff]"
                  />
                  <ZoomIn className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 w-10 text-right shrink-0">
                    {zoom.toFixed(1)}x
                  </span>
                </div>

                {/* Rotate button */}
                <button
                  type="button"
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 transition-colors shrink-0"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Putar 90°</span>
                </button>
              </div>

              {/* Bottom Action Buttons */}
              <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 gap-2.5">
                <button
                  type="button"
                  onClick={onSelectAnotherFile}
                  disabled={isProcessing}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Pilih File Lain</span>
                </button>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isProcessing}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    Batal
                  </button>

                  {/* Auto-Fit Full Logo without any cropping */}
                  <button
                    type="button"
                    onClick={handleUseFullImage}
                    disabled={isProcessing}
                    className="px-4 py-2.5 rounded-xl border border-emerald-300 dark:border-emerald-700/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-50"
                    title="Gunakan 100% seluruh gambar logo tanpa memotong sisi mana pun"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Gunakan Logo Utuh (Auto-Fit)</span>
                  </button>

                  {/* Apply Crop */}
                  <button
                    type="button"
                    onClick={handleApplyCrop}
                    disabled={isProcessing}
                    className="px-5 py-2.5 rounded-xl bg-[#0066ff] hover:bg-[#0052cc] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.01] disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Memproses...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-4 h-4" />
                        <span>Terapkan Crop & Unggah</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

