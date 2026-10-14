"use client";

import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Code2,
  Sparkles,
  Handshake,
  Building2,
  Layers,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { partnersApi } from "@/lib/api/partners";
import { PartnerLogoData } from "@/types";
import { Modal } from "@/components/base/Modal";
import { ImageUploadWithCrop } from "@/components/admin/ImageUploadWithCrop";

export default function AdminPartnersPage() {
  const [loading, setLoading] = useState(true);
  const [partners, setPartners] = useState<PartnerLogoData[]>([]);
  const [activeTab, setActiveTab] = useState<"ALL" | "PARTNER" | "CLIENT">("ALL");

  // Modal create/edit state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<PartnerLogoData | null>(null);
  const [logoInputType, setLogoInputType] = useState<"upload" | "svg">("upload");

  const [formData, setFormData] = useState({
    name: "",
    category: "PARTNER" as "PARTNER" | "CLIENT",
    logoUrl: "",
    svgContent: "",
    sortOrder: 0,
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);

  // Delete modal state
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const loadAll = async () => {
    try {
      setLoading(true);
      const data = await partnersApi.getAllAdmin();
      setPartners(data || []);
    } catch (err) {
      console.error("Gagal memuat data partner:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleOpenAdd = (defaultCategory?: "PARTNER" | "CLIENT") => {
    setEditingPartner(null);
    setLogoInputType("upload");
    const categoryToUse = defaultCategory || (activeTab === "CLIENT" ? "CLIENT" : "PARTNER");
    setFormData({
      name: "",
      category: categoryToUse,
      logoUrl: "",
      svgContent: "",
      sortOrder: (partners.length + 1) * 1,
      isActive: true,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (p: PartnerLogoData) => {
    setEditingPartner(p);
    setLogoInputType(p.svgContent ? "svg" : "upload");
    setFormData({
      name: p.name,
      category: (p.category?.toUpperCase() === "CLIENT" ? "CLIENT" : "PARTNER") as "PARTNER" | "CLIENT",
      logoUrl: p.logoUrl || "",
      svgContent: p.svgContent || "",
      sortOrder: p.sortOrder,
      isActive: p.isActive,
    });
    setModalOpen(true);
  };

  const handleSubmitPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.logoUrl && !formData.svgContent) {
      alert("Harap unggah gambar logo atau masukkan kode SVG logo.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        logoUrl: formData.logoUrl,
        svgContent: formData.svgContent || undefined,
        sortOrder: Number(formData.sortOrder),
        isActive: formData.isActive,
      };

      if (editingPartner) {
        await partnersApi.update(editingPartner.id, payload);
      } else {
        await partnersApi.create(payload);
      }

      setModalOpen(false);
      await loadAll();
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan data logo");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await partnersApi.delete(deleteId);
      setDeleteId(null);
      await loadAll();
    } catch (err: any) {
      alert(err.message || "Gagal menghapus logo");
    }
  };

  const filteredPartners = partners.filter((p) => {
    if (activeTab === "ALL") return true;
    const cat = (p.category || "PARTNER").toUpperCase();
    return cat === activeTab;
  });

  const partnerCount = partners.filter((p) => (p.category || "PARTNER").toUpperCase() === "PARTNER").length;
  const clientCount = partners.filter((p) => (p.category || "").toUpperCase() === "CLIENT").length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="w-8 h-8 text-[#0066ff] animate-spin" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Memuat data logo mitra & klien...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Manajemen Logo Mitra & Client
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Kelola daftar logo Mitra & Partner serta Client yang tampil pada 2 baris section logo website.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleOpenAdd("PARTNER")}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Mitra & Partner</span>
          </button>
          <button
            onClick={() => handleOpenAdd("CLIENT")}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Client</span>
          </button>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 p-1.5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl w-fit shadow-xs">
        <button
          onClick={() => setActiveTab("ALL")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "ALL"
              ? "bg-slate-900 text-white dark:bg-slate-800 dark:text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Semua ({partners.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("PARTNER")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "PARTNER"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40"
          }`}
        >
          <Handshake className="w-3.5 h-3.5" />
          <span>Mitra & Partner ({partnerCount})</span>
        </button>

        <button
          onClick={() => setActiveTab("CLIENT")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "CLIENT"
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Client ({clientCount})</span>
        </button>
      </div>

      {/* Logos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPartners.map((item) => {
          const isClient = (item.category || "").toUpperCase() === "CLIENT";

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                        isClient
                          ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                          : "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                      }`}
                    >
                      {isClient ? "CLIENT" : "MITRA & PARTNER"}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-800">
                      #{item.sortOrder}
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      item.isActive
                        ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {item.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </div>

                {/* Logo Preview Canvas */}
                <div className="w-full h-24 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex items-center justify-center p-3 mb-4 text-slate-900 dark:text-slate-100 overflow-hidden">
                  {item.logoUrl ? (
                    <img
                      src={item.logoUrl}
                      alt={item.name}
                      className="max-h-16 max-w-[180px] object-contain transition-transform duration-200"
                    />
                  ) : item.svgContent ? (
                    <div
                      className="h-14 w-auto max-w-[180px] flex items-center justify-center [&>svg]:h-full [&>svg]:w-auto [&>svg]:max-w-[180px] [&>svg]:object-contain"
                      dangerouslySetInnerHTML={{ __html: item.svgContent }}
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                  )}
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-base text-center group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.name}
                </h3>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                  title="Edit Logo"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteId(item.id)}
                  className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                  title="Hapus Logo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredPartners.length === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <ImageIcon className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-white">
            Belum Ada Logo pada Kategori Ini
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Tambahkan logo baru untuk ditampilkan pada barisan logo website publik.
          </p>
          <button
            onClick={() => handleOpenAdd(activeTab === "CLIENT" ? "CLIENT" : "PARTNER")}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold inline-flex items-center gap-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Sekarang</span>
          </button>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editingPartner ? "Edit Logo" : "Tambah Logo Baru"}
        >
          <form onSubmit={handleSubmitPartner} className="space-y-4 pt-2">
            
            {/* Category Picker */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Kategori Logo *</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, category: "PARTNER" })}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    formData.category === "PARTNER"
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 shadow-xs"
                      : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <Handshake className="w-4 h-4" />
                  <span>Mitra & Partner</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, category: "CLIENT" })}
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    formData.category === "CLIENT"
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 shadow-xs"
                      : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Client</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Nama Perusahaan / Brand *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: Cisco Systems / Bank BCA"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Info Badge: Stored in Database */}
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200/80 dark:border-blue-900/60 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed">
                <strong>Penyimpanan Database HD:</strong> Seluruh logo mitra & klien disimpan langsung di dalam database (bukan di folder lokal server) dengan resolusi HD tajam tanpa risiko file hilang saat server restart.
              </p>
            </div>

            {/* Logo Input Type Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Metode Input Logo</label>
              <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setLogoInputType("upload")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    logoInputType === "upload"
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Gambar HD (Disimpan ke DB)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLogoInputType("svg")}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    logoInputType === "svg"
                      ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900"
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Vektor SVG HD Langsung</span>
                </button>
              </div>
            </div>

            {/* Option 1: File Upload directly stored as HD Base64 in Database */}
            {logoInputType === "upload" && (
              <div className="pt-1">
                <ImageUploadWithCrop
                  label="File Gambar Logo (HD)"
                  value={formData.logoUrl}
                  onChange={(url) => setFormData({ ...formData, logoUrl: url, svgContent: "" })}
                  onDelete={() => setFormData({ ...formData, logoUrl: "" })}
                  minWidth={200}
                  minHeight={80}
                  aspectRatio={1}
                  aspectRatioLabel="Bebas / 1:1"
                  previewAspectClass="aspect-video max-w-[220px]"
                  placeholderText="Pilih logo mitra/klien"
                  helperText="Format PNG transparan, WebP, atau JPG. Gambar akan dikonversi menjadi data HD dan disimpan 100% langsung di database."
                  storeAsBase64={true}
                />
              </div>
            )}

            {/* Option 2: Raw SVG Code or SVG File Picker */}
            {logoInputType === "svg" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Kode Elemen SVG (<code className="text-blue-600">&lt;svg&gt;...&lt;/svg&gt;</code>)
                  </label>
                  <label className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer flex items-center gap-1">
                    <Upload className="w-3 h-3" />
                    <span>Pilih File .SVG</span>
                    <input
                      type="file"
                      accept=".svg"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => {
                          const content = reader.result as string;
                          setFormData({ ...formData, svgContent: content, logoUrl: "" });
                        };
                        reader.readAsText(file);
                      }}
                    />
                  </label>
                </div>
                <textarea
                  rows={4}
                  value={formData.svgContent}
                  onChange={(e) => setFormData({ ...formData, svgContent: e.target.value, logoUrl: "" })}
                  placeholder='<svg viewBox="0 0 200 60" fill="none">...</svg>'
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-mono text-[11px] text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-600 resize-none"
                />

                {formData.svgContent && (
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                    <span className="text-[11px] text-slate-400 font-semibold">Preview Vektor HD:</span>
                    <div
                      className="h-10 w-auto max-w-[180px] flex items-center justify-center [&>svg]:h-full [&>svg]:w-auto [&>svg]:max-w-[180px]"
                      dangerouslySetInnerHTML={{ __html: formData.svgContent }}
                    />
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Nomor Urutan Tampil</label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1.5 flex flex-col justify-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Tampilkan Logo (Status Aktif)</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{editingPartner ? "Simpan Perubahan" : "Tambahkan Logo"}</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <Modal
          isOpen={Boolean(deleteId)}
          onClose={() => setDeleteId(null)}
          title="Konfirmasi Hapus Logo"
          maxWidth="sm"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Apakah Anda yakin ingin menghapus logo ini? Aksi ini tidak dapat dibatalkan dan logo akan langsung dihapus dari tampilan website.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                Hapus Logo
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
