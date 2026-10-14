"use client";

import React, { useState, useCallback } from "react";
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
  aspectRatio?: number; // e.g. 16/9, 4/3, 1
  aspectRatioLabel?: string; // e.g. "16:9 Landscape"
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
  aspectRatio = 16 / 9,
  aspectRatioLabel = "16:9",
  onCropComplete,
  onSelectAnotherFile,
}) => {
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<PixelCrop | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropAreaComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  if (!isOpen || !imageSrc) return null;

  const isTooSmall =
    sourceDimensions.width < minWidth || sourceDimensions.height < minHeight;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
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
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isTooSmall ? "Dimensi Gambar Tidak Sesuai" : "Penyesuaian & Pemotongan Gambar (Crop)"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-md">
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
          <div className="p-8 flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-950/30 border-2 border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-500 animate-bounce">
              <AlertTriangle className="w-10 h-10" />
            </div>

            <div className="space-y-2 max-w-lg">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                Resolusi Gambar di Bawah Standar Minimum
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Gambar yang Anda pilih berukuran{" "}
                <span className="font-bold text-red-500">
                  {sourceDimensions.width} × {sourceDimensions.height} px
                </span>
                . Standar minimum untuk bagian ini adalah{" "}
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {minWidth} × {minHeight} px
                </span>{" "}
                (Rasio {aspectRatioLabel}).
              </p>
              <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-800 dark:text-amber-300 text-left flex items-start gap-3 mt-4">
                <Info className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                <p>
                  Mengunggah gambar beresolusi lebih kecil dapat membuat tampilan website tampak <strong>pecah atau buram</strong> pada layar monitor & smartphone beresolusi tinggi.
                </p>
              </div>
            </div>

            {/* Thumbnail preview of small image */}
            <div className="p-2 border border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-950 max-w-xs">
              <img
                src={imageSrc}
                alt="Selected"
                className="max-h-36 rounded-xl object-contain mx-auto"
              />
              <div className="mt-2 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Terdeteksi: {sourceDimensions.width} × {sourceDimensions.height} px
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-3 w-full max-w-md pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={onSelectAnotherFile}
                className="flex-1 py-3 px-4 rounded-xl bg-[#0066ff] hover:bg-[#0052cc] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02]"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Pilih Gambar Lain</span>
              </button>
            </div>
          </div>
        ) : (
          /* Cropper Workspace */
          <div className="flex-1 flex flex-col min-h-0">
            {/* Resolution Header info bar */}
            <div className="bg-slate-50 dark:bg-slate-950/60 px-6 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 font-medium">
                  <Maximize2 className="w-3.5 h-3.5 text-[#0066ff]" />
                  Resolusi Asli: <strong className="font-mono text-slate-900 dark:text-white">{sourceDimensions.width} × {sourceDimensions.height} px</strong>
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-slate-500">
                  Target Rasio: <strong className="text-slate-800 dark:text-slate-200">{aspectRatioLabel}</strong>
                </span>
              </div>
              {croppedAreaPixels && (
                <div className="font-mono font-bold text-[#0066ff] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-900 text-[11px]">
                  Hasil Crop: {Math.round(croppedAreaPixels.width)} × {Math.round(croppedAreaPixels.height)} px
                </div>
              )}
            </div>

            {/* Cropper Canvas Container */}
            <div className="relative flex-1 min-h-[360px] md:min-h-[420px] bg-slate-950">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={aspectRatio}
                onCropChange={onCropChange}
                onCropComplete={onCropAreaComplete}
                onZoomChange={onZoomChange}
                showGrid={true}
              />
            </div>

            {/* Controls Bar */}
            <div className="p-5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Zoom control */}
                <div className="flex items-center gap-3 min-w-[200px] flex-1">
                  <ZoomOut className="w-4 h-4 text-slate-400" />
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
                  <ZoomIn className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 w-10 text-right">
                    {zoom.toFixed(1)}x
                  </span>
                </div>

                {/* Rotate button */}
                <button
                  type="button"
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2 transition-colors"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Putar 90°</span>
                </button>
              </div>

              {/* Bottom Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 gap-3">
                <button
                  type="button"
                  onClick={onSelectAnotherFile}
                  disabled={isProcessing}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Pilih File Lain</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isProcessing}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleApplyCrop}
                    disabled={isProcessing}
                    className="px-6 py-2.5 rounded-xl bg-[#0066ff] hover:bg-[#0052cc] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02] disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Memproses & Mengunggah...</span>
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
