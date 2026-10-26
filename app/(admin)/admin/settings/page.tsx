"use client";

import React, { useEffect, useState } from "react";
import {
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Globe,
  Shield,
  Instagram,
  Linkedin,
  Facebook,
} from "lucide-react";
import { contentApi } from "@/lib/api/content";
import { ImageUploadWithCrop } from "@/components/admin/ImageUploadWithCrop";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formData, setFormData] = useState({
    site_name: "Globallink",
    site_tagline: "Smart IT Solution",
    site_logo: "/images/logo-globallink-blue.png",
    site_favicon: "/favicon.png",
    seo_meta_title:
      "Globallink — Smart IT Solution & High-Speed Network Infrastructure",
    seo_meta_description:
      "Penyedia infrastruktur jaringan, serat optik, internet service dedicated, smart CCTV, dan satelit terkemuka di Indonesia.",
    social_instagram: "https://instagram.com/globallink.id",
    social_linkedin: "https://linkedin.com/company/globallink",
    social_facebook: "https://facebook.com/globallink.id",
    copyright_text: "Globallink Smart IT Solution © 2026. All rights reserved.",
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const res = await contentApi.getByGroup("settings");
        if (res) {
          setFormData((prev) => ({ ...prev, ...res }));
        }
      } catch (err) {
        console.error("Gagal memuat pengaturan:", err);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    try {
      const items = Object.entries(formData).map(([key, value]) => ({
        key,
        value,
        group: "settings",
      }));
      await contentApi.bulkUpdate(items);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan pengaturan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="w-8 h-8 text-[#0066ff] animate-spin" />
        <p className="text-sm font-medium text-slate-500">Memuat pengaturan sistem...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Pengaturan Sistem</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Atur informasi umum website, logo, konfigurasi SEO, dan tautan media sosial.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Identitas Situs */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-7 space-y-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#0066ff] dark:text-blue-400" />
            <span>Identitas Perusahaan & Logo</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-900 dark:text-slate-200">Nama Perusahaan</label>
              <input
                type="text"
                value={formData.site_name}
                onChange={(e) => handleChange("site_name", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff]"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-900 dark:text-slate-200">Slogan / Tagline</label>
              <input
                type="text"
                value={formData.site_tagline}
                onChange={(e) => handleChange("site_tagline", e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff]"
              />
            </div>
          </div>

          <div className="pt-2">
            <ImageUploadWithCrop
              label="Logo Perusahaan"
              value={formData.site_logo}
              onChange={(url) => handleChange("site_logo", url)}
              onDelete={() => handleChange("site_logo", "")}
              minWidth={80}
              minHeight={25}
              aspectRatio={null}
              aspectRatioLabel="Auto / Sesuai Logo"
              previewAspectClass="aspect-[4/1] max-w-sm"
              placeholderText="Pilih gambar logo perusahaan"
              helperText="Format PNG transparan, WebP, atau SVG. Sistem otomatis menyesuaikan dengan proporsi logo asli."
            />
          </div>
        </div>

        {/* Card 2: SEO & Meta */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-7 space-y-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#0066ff] dark:text-blue-400" />
            <span>Search Engine Optimization (SEO)</span>
          </h2>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-900 dark:text-slate-200">Meta Title Default</label>
            <input
              type="text"
              value={formData.seo_meta_title}
              onChange={(e) => handleChange("seo_meta_title", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff]"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-900 dark:text-slate-200">Meta Description</label>
            <textarea
              rows={3}
              value={formData.seo_meta_description}
              onChange={(e) => handleChange("seo_meta_description", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff] resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Card 3: Media Sosial & Footer */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-7 space-y-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Media Sosial & Teks Footer
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                <span>Instagram URL</span>
              </label>
              <input
                type="text"
                value={formData.social_instagram}
                onChange={(e) => handleChange("social_instagram", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
                <span>LinkedIn URL</span>
              </label>
              <input
                type="text"
                value={formData.social_linkedin}
                onChange={(e) => handleChange("social_linkedin", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff]"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Facebook className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Facebook URL</span>
              </label>
              <input
                type="text"
                value={formData.social_facebook}
                onChange={(e) => handleChange("social_facebook", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff]"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Teks Hak Cipta Footer</label>
            <input
              type="text"
              value={formData.copyright_text}
              onChange={(e) => handleChange("copyright_text", e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff]"
            />
          </div>
        </div>

        {saveSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2.5 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Pengaturan sistem berhasil disimpan!</span>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-7 py-3.5 rounded-xl bg-[#0066ff] hover:bg-[#0052cc] text-white text-sm font-bold shadow-md shadow-blue-500/25 flex items-center gap-2.5 transition-all duration-150 hover:-translate-y-0.5 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? "Menyimpan..." : "Simpan Perubahan"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
