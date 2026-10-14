"use client";

import React, { useEffect, useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { contentApi } from "@/lib/api/content";
import { ImageUploadWithCrop } from "@/components/admin/ImageUploadWithCrop";

// Helper to strip HTML tags from legacy content
function cleanText(text?: string): string {
  if (!text) return "";
  return text
    .replace(/<br\s*[\/]?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export default function AdminBerandaPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Accordion toggle states
  const [heroOpen, setHeroOpen] = useState(true);
  const [ctaOpen, setCtaOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    // Hero
    hero_eyebrow: "CONNECTING BUSINESS TO WHAT'S NEXT",
    hero_headline: "Lebih dari Sekadar Koneksi,",
    hero_headline_highlight: "Ini Tentang Masa Depan.",
    hero_subheadline:
      "Globallink menghadirkan solusi jaringan dan teknologi terintegrasi untuk menghubungkan bisnis Anda dengan peluang tanpa batas.",
    hero_image: "/images/hero-buildings.jpg",
    hero_cta_primary_text: "Jelajahi Layanan",
    hero_cta_primary_link: "/#layanan",
    hero_cta_secondary_text: "Konsultasi Sekarang",
    hero_cta_secondary_link: "/#kontak",

    // CTA Banner
    cta_headline: "Siap Menghubungkan Bisnis Anda ke Tingkat Berikutnya?",
    cta_subheadline:
      "Konsultasikan kebutuhan infrastruktur jaringan dan solusi teknologi enterprise bersama tim spesialis Globallink sekarang.",
    cta_button_text: "Hubungi Tim Ahli Kami",
    cta_button_link: "/#kontak",
    cta_background_image: "/images/cta-connectivity-banner.jpg",
  });

  // Fetch initial content
  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        const res = await contentApi.getAll();
        if (res && res.dictionary) {
          const dict = res.dictionary;
          setFormData((prev) => ({
            ...prev,
            ...dict,
            hero_eyebrow: cleanText(dict.hero_eyebrow || prev.hero_eyebrow),
            hero_headline: cleanText(dict.hero_headline || prev.hero_headline),
            hero_headline_highlight: cleanText(dict.hero_headline_highlight || prev.hero_headline_highlight),
            hero_subheadline: cleanText(dict.hero_subheadline || prev.hero_subheadline),
            cta_headline: cleanText(dict.cta_headline || prev.cta_headline),
            cta_subheadline: cleanText(dict.cta_subheadline || prev.cta_subheadline),
          }));
        }
      } catch (err: any) {
        console.error("Gagal memuat konten:", err);
      } finally {
        setLoading(false);
      }
    };
    loadContent();
  }, []);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMessage("");

    try {
      const items = Object.entries(formData).map(([key, value]) => ({
        key,
        value,
        group: key.startsWith("hero") ? "hero" : key.startsWith("cta") ? "cta" : "general",
      }));

      await contentApi.bulkUpdate(items);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal menyimpan perubahan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="w-8 h-8 text-[#0066ff] animate-spin" />
        <p className="text-sm font-medium text-slate-500">Memuat data manajemen beranda...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Manajemen Beranda</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Ubah konten yang tampil di halaman utama website.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Accordion 1: Bagian Hero */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-200">
          <button
            type="button"
            onClick={() => setHeroOpen(!heroOpen)}
            className="w-full px-7 py-5 flex items-center justify-between text-left hover:bg-slate-50/60 dark:hover:bg-slate-800/60 transition-colors"
          >
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Bagian Hero</h2>
            {heroOpen ? (
              <ChevronUp className="w-5 h-5 text-slate-400 dark:text-slate-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400 dark:text-slate-500" />
            )}
          </button>

          {heroOpen && (
            <div className="px-7 pb-8 pt-2 space-y-6 border-t border-slate-100 dark:border-slate-800">
              {/* Eyebrow Text */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900 dark:text-slate-200">Eyebrow Text (Label Kecil)</label>
                <input
                  type="text"
                  value={formData.hero_eyebrow}
                  onChange={(e) => handleChange("hero_eyebrow", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0066ff]/20 focus:border-[#0066ff] transition-all"
                  placeholder="CONNECTING BUSINESS TO WHAT'S NEXT"
                />
              </div>

              {/* Headline Utama */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-900 dark:text-slate-200">Headline Utama (Baris 1)</label>
                  <input
                    type="text"
                    value={formData.hero_headline}
                    onChange={(e) => handleChange("hero_headline", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0066ff]/20 focus:border-[#0066ff] transition-all"
                    placeholder="Lebih dari Sekadar Koneksi,"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-900 dark:text-slate-200">
                    Headline Teks Sorotan <span className="text-[#0055d4] dark:text-blue-400 font-semibold">(Warna Biru)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.hero_headline_highlight}
                    onChange={(e) => handleChange("hero_headline_highlight", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/30 dark:bg-blue-950/40 text-sm font-semibold text-[#0055d4] dark:text-blue-400 placeholder-blue-300 dark:placeholder-blue-600 focus:outline-none focus:ring-2 focus:ring-[#0066ff]/20 focus:border-[#0066ff] transition-all"
                    placeholder="Ini Tentang Masa Depan."
                  />
                </div>
              </div>

              {/* Sub-headline */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900 dark:text-slate-200">Sub-headline (Deskripsi)</label>
                <textarea
                  rows={3}
                  value={formData.hero_subheadline}
                  onChange={(e) => handleChange("hero_subheadline", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0066ff]/20 focus:border-[#0066ff] transition-all resize-none leading-relaxed"
                  placeholder="Globallink menghadirkan solusi jaringan dan teknologi terintegrasi untuk menghubungkan bisnis Anda dengan peluang tanpa batas."
                />
              </div>

              {/* Gambar Hero */}
              <div className="pt-2">
                <ImageUploadWithCrop
                  label="Gambar Hero"
                  value={formData.hero_image}
                  onChange={(url) => handleChange("hero_image", url)}
                  onDelete={() => handleChange("hero_image", "")}
                  minWidth={1200}
                  minHeight={675}
                  aspectRatio={16 / 9}
                  aspectRatioLabel="16:9 Landscape"
                  previewAspectClass="aspect-video"
                  helperText="Format JPG, PNG, atau WebP. Gambar yang lebih besar dari standar dapat dipotong (crop) presisi."
                />
              </div>

              {/* Action Buttons Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Teks Tombol Utama (CTA 1)</label>
                  <input
                    type="text"
                    value={formData.hero_cta_primary_text}
                    onChange={(e) => handleChange("hero_cta_primary_text", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff]"
                  />
                  <input
                    type="text"
                    value={formData.hero_cta_primary_link}
                    onChange={(e) => handleChange("hero_cta_primary_link", e.target.value)}
                    placeholder="Link tujuan (contoh: /#layanan)"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-500 dark:text-slate-400 focus:outline-none focus:border-[#0066ff]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Teks Tombol Sekunder (CTA 2)</label>
                  <input
                    type="text"
                    value={formData.hero_cta_secondary_text}
                    onChange={(e) => handleChange("hero_cta_secondary_text", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff]"
                  />
                  <input
                    type="text"
                    value={formData.hero_cta_secondary_link}
                    onChange={(e) => handleChange("hero_cta_secondary_link", e.target.value)}
                    placeholder="Link tujuan (contoh: /#kontak)"
                    className="w-full px-3.5 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-500 dark:text-slate-400 focus:outline-none focus:border-[#0066ff]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Accordion 2: Bagian Banner CTA */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-200">
          <button
            type="button"
            onClick={() => setCtaOpen(!ctaOpen)}
            className="w-full px-7 py-5 flex items-center justify-between text-left hover:bg-slate-50/60 dark:hover:bg-slate-800/60 transition-colors"
          >
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Bagian Banner CTA</h2>
            {ctaOpen ? (
              <ChevronUp className="w-5 h-5 text-slate-400 dark:text-slate-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-slate-400 dark:text-slate-500" />
            )}
          </button>

          {ctaOpen && (
            <div className="px-7 pb-8 pt-2 space-y-6 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900 dark:text-slate-200">Headline Banner</label>
                <input
                  type="text"
                  value={formData.cta_headline}
                  onChange={(e) => handleChange("cta_headline", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0066ff]"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-900 dark:text-slate-200">Sub-headline Banner</label>
                <textarea
                  rows={2}
                  value={formData.cta_subheadline}
                  onChange={(e) => handleChange("cta_subheadline", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#0066ff] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Teks Tombol</label>
                  <input
                    type="text"
                    value={formData.cta_button_text}
                    onChange={(e) => handleChange("cta_button_text", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Link Tombol</label>
                  <input
                    type="text"
                    value={formData.cta_button_link}
                    onChange={(e) => handleChange("cta_button_link", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <ImageUploadWithCrop
                  label="Gambar Background Banner"
                  value={formData.cta_background_image}
                  onChange={(url) => handleChange("cta_background_image", url)}
                  onDelete={() => handleChange("cta_background_image", "")}
                  minWidth={1200}
                  minHeight={500}
                  aspectRatio={21 / 9}
                  aspectRatioLabel="21:9 Wide Banner"
                  previewAspectClass="aspect-[21/9]"
                  helperText="Format JPG, PNG, atau WebP. Gambar yang lebih besar dari standar dapat dipotong (crop) presisi."
                />
              </div>
            </div>
          )}
        </div>

        {/* Feedback alerts */}
        {saveSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 shadow-sm animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Perubahan konten beranda berhasil disimpan dan langsung diperbarui di website!</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2.5 shadow-sm">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Save Bar */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-7 py-3.5 rounded-xl bg-[#0066ff] hover:bg-[#0052cc] text-white text-sm font-bold shadow-md shadow-blue-500/25 flex items-center gap-2.5 transition-all duration-150 hover:-translate-y-0.5 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? "Menyimpan..." : "Simpan Perubahan"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
