"use client";

import React, { useEffect, useState } from "react";
import {
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
} from "lucide-react";
import { contentApi } from "@/lib/api/content";
import { aboutStatsApi } from "@/lib/api/about-stats";
import { AboutStatData } from "@/types";
import { ImageUploadWithCrop } from "@/components/admin/ImageUploadWithCrop";

function cleanText(text?: string): string {
  if (!text) return "";
  return text
    .replace(/<br\s*[\/]?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export default function AdminAboutPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Form state
  const [content, setContent] = useState({
    about_eyebrow: "TENTANG GLOBALLINK",
    about_title: "PT. MEDIALINK GLOBAL MANDIRI —",
    about_title_highlight: "Smart IT Solution.",
    about_description:
      "Didirikan sejak tahun 2010, Globallink (PT. Medialink Global Mandiri) berkomitmen melayani dan memenuhi seluruh kebutuhan telekomunikasi masyarakat Indonesia, khususnya di bidang jaringan internet. Dengan tagline 'Smart IT Solution', kami hadir mendampingi percepatan transformasi digital dengan solusi yang aplikatif, adaptif, dan berstandar internasional.",
    about_mission_badge: "MISI KAMI",
    about_mission_statement:
      "Menyediakan solusi yang tepat guna sesuai situasi dan kondisi industri telekomunikasi di Indonesia, serta memberikan total solution dalam rangka transformasi teknologi nusantara.",
    about_image: "/images/about-buildings-bg.jpg",
  });

  // Key stats
  const [stats, setStats] = useState<Array<Partial<AboutStatData>>>([
    { value: "14+", label: "Tahun Pengalaman", description: "Sejak 2010", sortOrder: 1 },
    { value: "99.9%", label: "SLA Garansi Uptime", description: "Keandalan tinggi", sortOrder: 2 },
    { value: "34+", label: "Provinsi Terkoneksi", description: "Seluruh Indonesia", sortOrder: 3 },
    { value: "24/7", label: "Dukungan NOC Standby", description: "Engineer bersertifikasi", sortOrder: 4 },
  ]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [contentRes, statsRes] = await Promise.all([
          contentApi.getByGroup("about"),
          aboutStatsApi.getAll(),
        ]);
        if (contentRes) {
          setContent((prev) => ({
            ...prev,
            ...contentRes,
            about_eyebrow: cleanText(contentRes.about_eyebrow || prev.about_eyebrow),
            about_title: cleanText(contentRes.about_title || prev.about_title),
            about_title_highlight: cleanText(
              contentRes.about_title_highlight || prev.about_title_highlight
            ),
            about_description: cleanText(contentRes.about_description || prev.about_description),
            about_mission_badge: cleanText(contentRes.about_mission_badge || prev.about_mission_badge),
            about_mission_statement: cleanText(contentRes.about_mission_statement || prev.about_mission_statement),
          }));
        }
        if (statsRes && statsRes.length > 0) {
          setStats(statsRes);
        }
      } catch (err) {
        console.error("Gagal memuat data tentang kami:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleStatChange = (index: number, field: string, val: string) => {
    setStats((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleAddStat = () => {
    setStats((prev) => [
      ...prev,
      { value: "100%", label: "Statistik Baru", description: "Deskripsi", sortOrder: prev.length + 1 },
    ]);
  };

  const handleRemoveStat = (index: number) => {
    setStats((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setErrorMessage("");

    try {
      const items = Object.entries(content).map(([key, value]) => ({
        key,
        value,
        group: "about",
      }));

      await Promise.all([
        contentApi.bulkUpdate(items),
        aboutStatsApi.bulkSave(stats),
      ]);

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal menyimpan perubahan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="w-8 h-8 text-[#0066ff] animate-spin" />
        <p className="text-sm font-medium text-slate-500">Memuat data manajemen tentang kami...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Manajemen Tentang Kami</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Ubah deskripsi profil perusahaan, visi, misi, dan data statistik pencapaian.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Informasi Pokok */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-7 space-y-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Narasi & Profil Perusahaan
          </h2>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-900 dark:text-slate-200">Eyebrow Teks</label>
            <input
              type="text"
              value={content.about_eyebrow}
              onChange={(e) => setContent({ ...content, about_eyebrow: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-900 dark:text-slate-200">Judul Utama (Baris 1)</label>
              <input
                type="text"
                value={content.about_title}
                onChange={(e) => setContent({ ...content, about_title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff]"
                placeholder="Teknologi yang Menggerakkan"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-900 dark:text-slate-200">
                Judul Teks Sorotan <span className="text-[#0055d4] dark:text-blue-400">(Warna Biru / Gradient)</span>
              </label>
              <input
                type="text"
                value={content.about_title_highlight}
                onChange={(e) => setContent({ ...content, about_title_highlight: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20 text-sm font-semibold text-[#0055d4] dark:text-blue-400 focus:outline-none focus:border-[#0066ff]"
                placeholder="Bisnis ke Masa Depan."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-900 dark:text-slate-200">Deskripsi Lengkap</label>
            <textarea
              rows={4}
              value={content.about_description}
              onChange={(e) => setContent({ ...content, about_description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff] leading-relaxed resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Badge Misi</label>
              <input
                type="text"
                value={content.about_mission_badge}
                onChange={(e) => setContent({ ...content, about_mission_badge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff]"
              />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Pernyataan Misi</label>
              <input
                type="text"
                value={content.about_mission_statement}
                onChange={(e) => setContent({ ...content, about_mission_statement: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff]"
              />
            </div>
          </div>

          {/* Gambar Gedung / Perusahaan */}
          <div className="pt-2">
            <ImageUploadWithCrop
              label="Foto Gedung / Kantor"
              value={content.about_image}
              onChange={(url) => setContent({ ...content, about_image: url })}
              onDelete={() => setContent({ ...content, about_image: "" })}
              minWidth={800}
              minHeight={600}
              aspectRatio={4 / 3}
              aspectRatioLabel="4:3 (Skyscraper/Gedung)"
              previewAspectClass="aspect-[4/3]"
              helperText="Format JPG, PNG, atau WebP. Gambar yang lebih besar dari standar dapat dipotong (crop) presisi."
            />
          </div>
        </div>

        {/* Card 2: Metrik & Statistik */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-7 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Kartu Metrik & Statistik Pencapaian
            </h2>
            <button
              type="button"
              onClick={handleAddStat}
              className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Metrik</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.map((st, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">
                    Metrik #{idx + 1}
                  </span>
                  {stats.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStat(idx)}
                      className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 p-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">Angka / Nilai</label>
                  <input
                    type="text"
                    value={st.value || ""}
                    onChange={(e) => handleStatChange(idx, "value", e.target.value)}
                    placeholder="Contoh: 99.9%"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-[#0066ff] dark:text-blue-400 focus:outline-none focus:border-[#0066ff]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300">Label Statistik</label>
                  <input
                    type="text"
                    value={st.label || ""}
                    onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                    placeholder="Contoh: SLA Garansi Uptime"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feedback alerts */}
        {saveSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 shadow-sm animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Data profil Tentang Kami berhasil disimpan!</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2.5 shadow-sm">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Save button */}
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
