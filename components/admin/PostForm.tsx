"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Post, PostStatus } from "@/types";
import { postsApi } from "@/lib/api/posts";
import { Input } from "../base/Input";
import { Textarea } from "../base/Textarea";
import { Select } from "../base/Select";
import { Button } from "../base/Button";
import { Card } from "../base/Card";
import { RichTextEditor } from "./RichTextEditor";
import { Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ImageUploadWithCrop } from "./ImageUploadWithCrop";

export interface PostFormProps {
  initialData?: Post;
  isEditing?: boolean;
}

export const PostForm: React.FC<PostFormProps> = ({
  initialData,
  isEditing = false,
}) => {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData?.thumbnailUrl || "");
  const [status, setStatus] = useState<PostStatus>(initialData?.status || "DRAFT");

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = "Judul artikel wajib diisi";
    if (!content.trim() || content === "<p></p>") newErrors.content = "Konten artikel wajib diisi";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const payload = {
        title,
        slug: slug.trim() ? slug : undefined,
        excerpt: excerpt.trim() ? excerpt : undefined,
        content,
        thumbnailUrl: thumbnailUrl.trim() ? thumbnailUrl : undefined,
        status,
      };

      if (isEditing && initialData) {
        await postsApi.updatePost(initialData.id, payload);
      } else {
        await postsApi.createPost(payload);
      }

      router.push("/admin/posts");
      router.refresh();
    } catch (err: any) {
      setErrors({ global: err.message || "Terjadi kesalahan saat menyimpan artikel." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/posts">
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
            >
              Kembali
            </Button>
          </Link>
          <h2 className="text-xl font-bold text-slate-900">
            {isEditing ? "Edit Artikel" : "Buat Artikel Baru"}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="submit"
            isLoading={submitting}
            leftIcon={<Save className="w-4 h-4" />}
          >
            {isEditing ? "Perbarui Artikel" : "Simpan Artikel"}
          </Button>
        </div>
      </div>

      {errors.global && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
          {errors.global}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Content */}
        <div className="lg:col-span-8 space-y-6">
          <Card padding="lg" className="space-y-6">
            <Input
              label="Judul Artikel *"
              placeholder="Contoh: Modernisasi Jaringan Serat Optik Nasional"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title}
            />

            <Input
              label="Custom Slug (Opsional - Otomatis dibuat jika kosong)"
              placeholder="modernisasi-jaringan-serat-optik"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              helperText="Digunakan untuk URL SEO yang ramah mesin pencari."
            />

            <Textarea
              label="Ringkasan (Excerpt)"
              placeholder="Ringkasan singkat 1-2 kalimat untuk preview artikel..."
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />

            <RichTextEditor
              content={content}
              onChange={setContent}
              error={errors.content}
            />
          </Card>
        </div>

        {/* Right Column: Settings & Thumbnail */}
        <div className="lg:col-span-4 space-y-6">
          <Card padding="lg" className="space-y-6">
            <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-3">
              Status & Visibilitas
            </h3>

            <Select
              label="Status Publikasi"
              value={status}
              onChange={(e) => setStatus(e.target.value as PostStatus)}
              options={[
                { label: "Draft (Belum Tampil di Publik)", value: "DRAFT" },
                { label: "Published (Terbit untuk Publik)", value: "PUBLISHED" },
                { label: "Archived (Diarsipkan)", value: "ARCHIVED" },
              ]}
            />
          </Card>

          <Card padding="lg" className="space-y-4">
            <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-3">
              Thumbnail Artikel
            </h3>

            <ImageUploadWithCrop
              value={thumbnailUrl}
              onChange={(url) => setThumbnailUrl(url)}
              onDelete={() => setThumbnailUrl("")}
              minWidth={800}
              minHeight={450}
              aspectRatio={16 / 9}
              aspectRatioLabel="16:9 Landscape"
              previewAspectClass="aspect-video"
              placeholderText="Pilih gambar thumbnail artikel"
              helperText="Format JPG, PNG, atau WebP. Gambar yang lebih besar dari standar dapat dipotong (crop) presisi."
            />
          </Card>
        </div>
      </div>
    </form>
  );
};
