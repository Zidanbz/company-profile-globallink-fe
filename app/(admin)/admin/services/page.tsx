"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Save,
  Network,
} from "lucide-react";
import { servicesApi } from "@/lib/api/services";
import { contentApi } from "@/lib/api/content";
import { ServiceItemData } from "@/types";
import { Modal } from "@/components/base/Modal";
import { ImageUploadWithCrop } from "@/components/admin/ImageUploadWithCrop";

function cleanText(text?: string): string {
  if (!text) return "";
  return text
    .replace(/<br\s*[\/]?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export default function AdminServicesPage() {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<ServiceItemData[]>([]);
  const [savingMeta, setSavingMeta] = useState(false);
  const [metaSuccess, setMetaSuccess] = useState(false);

  // Section meta
  const [meta, setMeta] = useState({
    services_eyebrow: "Our Services",
    services_title: "Satu Jaringan.",
    services_title_highlight: "Banyak Kemungkinan.",
    services_subtitle:
      "Kami menyediakan layanan teknologi dan infrastruktur terlengkap untuk mendukung pertumbuhan bisnis Anda di era digital.",
  });

  // Modal create/edit state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItemData | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    icon: "Network",
    badge: "",
    imageUrl: "",
    featuresText: "",
    sortOrder: 0,
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);

  // Delete modal state
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [svcData, metaRes] = await Promise.all([
        servicesApi.getAllAdmin(),
        contentApi.getByGroup("services"),
      ]);
      setServices(svcData || []);
      if (metaRes) {
        setMeta((prev) => ({
          ...prev,
          ...metaRes,
          services_eyebrow: cleanText(metaRes.services_eyebrow || prev.services_eyebrow),
          services_title: cleanText(metaRes.services_title || prev.services_title),
          services_title_highlight: cleanText(
            metaRes.services_title_highlight || prev.services_title_highlight
          ),
          services_subtitle: cleanText(metaRes.services_subtitle || prev.services_subtitle),
        }));
      }
    } catch (err) {
      console.error("Gagal memuat layanan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({
      title: "",
      slug: "",
      description: "",
      icon: "Network",
      badge: "Enterprise Solution",
      imageUrl: "",
      featuresText: "SLA Jaringan 99.9%\nDukungan 24/7\nKonektivitas Cepat",
      sortOrder: (services.length + 1) * 1,
      isActive: true,
    });
    setModalOpen(true);
  };

function parseFeaturesHelper(raw?: string | null): string[] {
  if (!raw) return [];
  try {
    let parsed = JSON.parse(raw);
    if (typeof parsed === "string") {
      try {
        parsed = JSON.parse(parsed);
      } catch (_) {}
    }
    return Array.isArray(parsed) ? parsed : [raw];
  } catch (_) {
    return [raw];
  }
}

  const handleOpenEdit = (svc: ServiceItemData) => {
    setEditingService(svc);
    const featuresArray = parseFeaturesHelper(svc.features);
    setFormData({
      title: svc.title,
      slug: svc.slug,
      description: svc.description,
      icon: svc.icon || "Network",
      badge: svc.badge || "",
      imageUrl: svc.imageUrl || "",
      featuresText: featuresArray.join("\n"),
      sortOrder: svc.sortOrder,
      isActive: svc.isActive,
    });
    setModalOpen(true);
  };

  const handleSaveMeta = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingMeta(true);
    try {
      const items = [
        { key: "services_eyebrow", value: meta.services_eyebrow, group: "services" },
        { key: "services_title", value: meta.services_title, group: "services" },
        { key: "services_title_highlight", value: meta.services_title_highlight, group: "services" },
        { key: "services_subtitle", value: meta.services_subtitle, group: "services" },
      ];
      await contentApi.bulkUpdate(items);
      setMetaSuccess(true);
      setTimeout(() => setMetaSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan judul layanan");
    } finally {
      setSavingMeta(false);
    }
  };

  const handleSubmitService = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const features = formData.featuresText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        title: formData.title,
        slug: formData.slug || undefined,
        description: formData.description,
        icon: formData.icon,
        badge: formData.badge,
        imageUrl: formData.imageUrl || null,
        features: JSON.stringify(features),
        sortOrder: Number(formData.sortOrder),
        isActive: formData.isActive,
      };

      if (editingService) {
        await servicesApi.update(editingService.id, payload as any);
      } else {
        await servicesApi.create(payload as any);
      }

      setModalOpen(false);
      await loadAll();
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan data layanan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await servicesApi.delete(deleteId);
      setDeleteId(null);
      await loadAll();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus layanan");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="w-8 h-8 text-[#0066ff] animate-spin" />
        <p className="text-sm font-medium text-slate-500">Memuat data manajemen layanan...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Manajemen Layanan</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Kelola judul, deskripsi, dan daftar kartu layanan yang tampil pada halaman website.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-[#0066ff] hover:bg-[#0052cc] text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Layanan</span>
        </button>
      </div>

      {/* Section Headline Settings */}
      <form onSubmit={handleSaveMeta} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Judul & Teks Bagian Layanan</h2>
          <button
            type="submit"
            disabled={savingMeta}
            className="px-4 py-1.5 rounded-lg bg-slate-900 dark:bg-[#0066ff] hover:bg-slate-800 dark:hover:bg-blue-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            {savingMeta ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Simpan Teks</span>
          </button>
        </div>

        {metaSuccess && (
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Judul dan teks bagian layanan berhasil disimpan!</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Eyebrow Teks</label>
          <input
            type="text"
            value={meta.services_eyebrow}
            onChange={(e) => setMeta({ ...meta, services_eyebrow: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Judul Utama (Baris 1)</label>
            <input
              type="text"
              value={meta.services_title}
              onChange={(e) => setMeta({ ...meta, services_title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff]"
              placeholder="Satu Jaringan."
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Judul Teks Sorotan <span className="text-[#0055d4] dark:text-blue-400">(Warna Biru)</span>
            </label>
            <input
              type="text"
              value={meta.services_title_highlight}
              onChange={(e) => setMeta({ ...meta, services_title_highlight: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20 text-xs font-semibold text-[#0055d4] dark:text-blue-400 focus:outline-none focus:border-[#0066ff]"
              placeholder="Banyak Kemungkinan."
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Deskripsi Sub-headline</label>
          <textarea
            rows={2}
            value={meta.services_subtitle}
            onChange={(e) => setMeta({ ...meta, services_subtitle: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff] resize-none"
          />
        </div>
      </form>

      {/* Services Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((svc) => {
          const features = parseFeaturesHelper(svc.features);

          return (
            <div
              key={svc.id}
              className="bg-gradient-to-br from-[#bae6fd]/80 via-[#f4faff] via-40% to-white dark:from-[#0c4a6e]/50 dark:via-slate-900/95 dark:to-slate-900 rounded-2xl border border-sky-200/90 dark:border-slate-800 p-6 flex flex-col justify-between shadow-xs hover:border-[#00A3FF] dark:hover:border-[#38bdf8]/60 hover:shadow-md transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white via-sky-50 to-[#bae6fd] dark:bg-sky-950/60 text-[#0077e6] dark:text-[#38bdf8] flex items-center justify-center font-bold border border-sky-300/80 dark:border-sky-800/60 shadow-xs">
                    <Network className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-sky-50 dark:bg-sky-950/60 text-[#0066cc] dark:text-sky-300 border border-sky-200 dark:border-sky-800">
                      {svc.badge || "Solution"}
                    </span>
                    {!svc.isActive && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        Nonaktif
                      </span>
                    )}
                  </div>
                </div>

                {svc.imageUrl && (
                  <div className="mb-3.5 rounded-xl overflow-hidden aspect-[16/9] border border-sky-200/80 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
                    <img
                      src={svc.imageUrl}
                      alt={svc.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <h3 className="font-bold text-slate-900 dark:text-white text-base mb-2 group-hover:text-[#0066ff] dark:group-hover:text-blue-400 transition-colors">
                  {svc.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                  {svc.description}
                </p>

                {features.length > 0 && (
                  <div className="space-y-1 mb-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    {features.slice(0, 3).map((f, i) => (
                      <p key={i} className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span>{f}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Urutan #{svc.sortOrder}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(svc)}
                    className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                    title="Edit Layanan"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(svc.id)}
                    className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    title="Hapus Layanan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingService ? "Edit Layanan" : "Tambah Layanan Baru"}
        >
          <form onSubmit={handleSubmitService} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Nama Layanan *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Contoh: Internet Dedicated"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Badge / Tag</label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="Contoh: Dedicated Bandwidth"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Nomor Urut</label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Deskripsi Layanan *</label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Jelaskan ringkasan solusi layanan..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff] resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Fitur Unggulan (1 baris per fitur)
              </label>
              <textarea
                rows={3}
                value={formData.featuresText}
                onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                placeholder="SLA Jaringan 99.9%&#10;Bandwidth Simetris 1:1&#10;Dukungan 24/7"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff]"
              />
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Gambar Showcase Layanan (Tampil di Pop-up & Halaman Detail)
              </label>
              <ImageUploadWithCrop
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                onDelete={() => setFormData({ ...formData, imageUrl: "" })}
                aspectRatio={16 / 9}
                aspectRatioLabel="16:9 Landscape"
                minWidth={600}
                minHeight={338}
                previewAspectClass="aspect-[16/9] max-w-full"
                placeholderText="Upload gambar arsitektur / showcase layanan (16:9)"
                helperText="Format JPG, PNG, atau WebP. Gambar ini akan tampil sebagai showcase visual utama di modal pop-up dan halaman detail layanan."
                storeAsBase64={true}
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-[#0066ff] dark:bg-slate-950 dark:border-slate-800"
                />
                <span>Tampilkan Layanan di Website Publik</span>
              </label>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl bg-[#0066ff] hover:bg-[#0052cc] text-white text-xs font-bold shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{editingService ? "Simpan Perubahan" : "Tambahkan"}</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete confirmation modal */}
      {deleteId && (
        <Modal
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          title="Konfirmasi Hapus Layanan"
        >
          <div className="space-y-4 pt-2">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Apakah Anda yakin ingin menghapus layanan ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm"
              >
                Hapus
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
