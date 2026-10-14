"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Crop,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Info,
} from "lucide-react";
import { getImageDimensions } from "@/lib/cropImage";
import { ImageCropperModal } from "./ImageCropperModal";
import { uploadImage } from "@/lib/api/upload";

export interface ImageUploadWithCropProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  onDelete?: () => void;
  minWidth?: number; // Minimum recommended width in pixels
  minHeight?: number; // Minimum recommended height in pixels
  aspectRatio?: number; // e.g. 16/9, 4/3, 1/1
  aspectRatioLabel?: string; // e.g. "16:9 Landscape", "4:3", "1:1 Square"
  helperText?: string;
  previewAspectClass?: string; // e.g. "aspect-video", "aspect-[4/3]", "aspect-square"
  placeholderText?: string;
  className?: string;
  storeAsBase64?: boolean; // When true, converts image to HD Base64 directly for database storage (no local disk upload)
}

export const ImageUploadWithCrop: React.FC<ImageUploadWithCropProps> = ({
  label,
  value,
  onChange,
  onDelete,
  minWidth = 1200,
  minHeight = 675,
  aspectRatio = 16 / 9,
  aspectRatioLabel = "16:9",
  helperText,
  previewAspectClass = "aspect-video",
  placeholderText = "Belum ada gambar yang dipilih",
  className = "",
  storeAsBase64 = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [cropperOpen, setCropperOpen] = useState<boolean>(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [selectedFileMime, setSelectedFileMime] = useState<string>("image/jpeg");
  const [sourceDimensions, setSourceDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset value so user can re-select same file if needed
    e.target.value = "";

    try {
      const dimensions = await getImageDimensions(file);
      setSelectedImageSrc(dimensions.url);
      setSelectedFileName(file.name);
      setSelectedFileMime(file.type || "image/jpeg");
      setSourceDimensions({ width: dimensions.width, height: dimensions.height });
      setCropperOpen(true);
    } catch (err) {
      console.error("Gagal membaca file gambar:", err);
      alert("Gagal membaca file gambar. Pastikan file berformat JPG, PNG, atau WebP.");
    }
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    try {
      setIsUploading(true);

      if (storeAsBase64) {
        // Direct Base64 conversion - 100% saved in database, no local disk upload!
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(croppedBlob);
        });
        onChange(base64Data);
      } else {
        // Create a File from the Blob for server upload
        const ext = selectedFileMime.includes("png") ? "png" : "jpg";
        const croppedFile = new File(
          [croppedBlob],
          `cropped-${Date.now()}-${selectedFileName.replace(/\.[^/.]+$/, "")}.${ext}`,
          { type: selectedFileMime }
        );

        const uploadedUrl = await uploadImage(croppedFile);
        onChange(uploadedUrl);
      }
    } catch (err: any) {
      console.error("Processing failed:", err);
      alert(err.message || "Gagal memproses gambar.");
    } finally {
      setIsUploading(false);
      setCropperOpen(false);
    }
  };

  return (
    <div className={`space-y-2.5 ${className}`}>
      {/* Label and Standard Spec Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {label && (
          <label className="block text-sm font-bold text-slate-900 dark:text-slate-100">
            {label}
          </label>
        )}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/70 dark:border-blue-800/60 text-[11px] font-medium text-[#0066ff] dark:text-blue-300">
          <Info className="w-3 h-3 text-[#0066ff] dark:text-blue-400" />
          <span>
            Standar: Min <strong className="font-semibold">{minWidth}×{minHeight} px</strong> ({aspectRatioLabel})
          </span>
        </div>
      </div>

      {/* Upload Dropzone Container */}
      <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-950/40 hover:border-[#0066ff]/40 transition-colors">
        {value ? (
          <div className="w-full flex flex-col items-center">
            {/* Image Preview */}
            <div
              className={`relative w-full max-w-lg ${previewAspectClass} rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 mb-4 bg-slate-900/5 group`}
            >
              <img
                src={value}
                alt={label || "Preview Image"}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <span className="text-white text-xs font-medium truncate">{value}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-4 py-2.5 rounded-xl bg-[#0066ff] hover:bg-[#0052cc] text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <span>{isUploading ? "Mengunggah..." : "Ganti & Crop Foto"}</span>
              </button>

              {onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  disabled={isUploading}
                  className="px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Hapus</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center text-center">
            <div
              className={`w-full max-w-md ${previewAspectClass} rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 mb-4 flex flex-col items-center justify-center bg-slate-100/70 dark:bg-slate-900/50 text-slate-400 p-6 space-y-2`}
            >
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-500">
                <ImageIcon className="w-6 h-6" />
              </div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{placeholderText}</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Otomatis mendeteksi resolusi & membuka alat crop
              </p>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-5 py-2.5 rounded-xl bg-[#0066ff] hover:bg-[#0052cc] text-white text-xs font-semibold flex items-center gap-2 shadow-sm transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              <span>{isUploading ? "Mengunggah..." : "Pilih & Unggah Gambar"}</span>
            </button>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/jpeg,image/png,image/webp,image/jpg"
          className="hidden"
        />

        {/* Helper Note */}
        {helperText && (
          <p className="mt-3 text-xs text-slate-400 dark:text-slate-500 text-center max-w-md">
            {helperText}
          </p>
        )}
      </div>

      {/* Cropper & Resolution Validator Modal */}
      <ImageCropperModal
        isOpen={cropperOpen}
        onClose={() => setCropperOpen(false)}
        imageSrc={selectedImageSrc}
        fileName={selectedFileName}
        fileMimeType={selectedFileMime}
        sourceDimensions={sourceDimensions}
        minWidth={minWidth}
        minHeight={minHeight}
        aspectRatio={aspectRatio}
        aspectRatioLabel={aspectRatioLabel}
        onCropComplete={handleCropComplete}
        onSelectAnotherFile={() => {
          setCropperOpen(false);
          fileInputRef.current?.click();
        }}
      />
    </div>
  );
};
