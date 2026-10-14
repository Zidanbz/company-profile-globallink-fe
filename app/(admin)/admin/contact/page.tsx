"use client";

import React, { useEffect, useState } from "react";
import {
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Clock,
  Trash2,
  Check,
  Eye,
} from "lucide-react";
import { contentApi } from "@/lib/api/content";
import { contactApi } from "@/lib/api/contact";
import { ContactMessageData } from "@/types";
import { Modal } from "@/components/base/Modal";

export default function AdminContactPage() {
  const [activeTab, setActiveTab] = useState<"info" | "messages">("info");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Contact info
  const [formData, setFormData] = useState({
    contact_title: "Hubungi Kami",
    contact_subtitle:
      "Punya pertanyaan atau butuh konsultasi solusi jaringan? Tim ahli kami siap membantu Anda.",
    contact_address:
      "Jl. Urip Sumoharjo No. 20 – Graha Pena Lantai 3 Kav (317-318), Makassar, Sulawesi Selatan",
    contact_email: "info@globallink.net.id",
    contact_phone: "+62 813 1717 1759",
    contact_whatsapp: "+62 813 1717 1759",
    contact_working_hours: "Senin — Jumat 08.00 - 17.00 WIB (NOC 24/7/365)",
  });

  // Messages inbox
  const [messages, setMessages] = useState<ContactMessageData[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageData | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const loadData = async () => {
    try {
      setLoading(true);
      const [contentRes, messagesRes] = await Promise.all([
        contentApi.getByGroup("contact"),
        contactApi.getAllAdmin(1, 50),
      ]);
      if (contentRes) {
        setFormData((prev) => ({ ...prev, ...contentRes }));
      }
      if (messagesRes && messagesRes.items) {
        setMessages(messagesRes.items);
        setUnreadCount(messagesRes.items.filter((m) => !m.isRead).length);
      }
    } catch (err) {
      console.error("Gagal memuat data kontak:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      const items = Object.entries(formData).map(([key, value]) => ({
        key,
        value,
        group: "contact",
      }));
      await contentApi.bulkUpdate(items);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      alert(err.message || "Gagal menyimpan informasi kontak");
    } finally {
      setSaving(false);
    }
  };

  const handleOpenMessage = async (msg: ContactMessageData) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      try {
        await contactApi.markAsRead(msg.id, true);
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err) {
        // silent
      }
    }
  };

  const handleDeleteMessage = async (id: number) => {
    if (!confirm("Hapus pesan ini?")) return;
    try {
      await contactApi.delete(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (err: any) {
      alert(err.message || "Gagal menghapus pesan");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="w-8 h-8 text-[#0066ff] animate-spin" />
        <p className="text-sm font-medium text-slate-500">Memuat data kontak...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Page Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Manajemen Kontak & Kotak Masuk
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Kelola rincian kontak kantor dan baca pesan masuk dari pengunjung website.
          </p>
        </div>

        <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <button
            onClick={() => setActiveTab("info")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "info"
                ? "bg-[#0066ff] text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Informasi Kontak
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "messages"
                ? "bg-[#0066ff] text-white shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <span>Kotak Masuk Pesan</span>
            {unreadCount > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeTab === "messages" ? "bg-white text-blue-600" : "bg-red-500 text-white"
                }`}
              >
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeTab === "info" ? (
        /* Tab 1: Informasi Kontak Form */
        <form onSubmit={handleSaveInfo} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-7 space-y-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Rincian Kontak & Lokasi
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-900 dark:text-slate-200">Judul Bagian Kontak</label>
              <input
                type="text"
                value={formData.contact_title}
                onChange={(e) => setFormData({ ...formData, contact_title: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff]"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-900 dark:text-slate-200">Sub-headline Kontak</label>
              <input
                type="text"
                value={formData.contact_subtitle}
                onChange={(e) => setFormData({ ...formData, contact_subtitle: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-900 dark:text-slate-200">Alamat Lengkap Kantor</label>
            <textarea
              rows={2}
              value={formData.contact_address}
              onChange={(e) => setFormData({ ...formData, contact_address: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff] resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Email Resmi</label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff]"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Nomor Telepon Kantor</label>
              <input
                type="text"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff]"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Nomor WhatsApp Business</label>
              <input
                type="text"
                value={formData.contact_whatsapp}
                onChange={(e) => setFormData({ ...formData, contact_whatsapp: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff]"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Jam Operasional</label>
              <input
                type="text"
                value={formData.contact_working_hours}
                onChange={(e) => setFormData({ ...formData, contact_working_hours: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff]"
              />
            </div>
          </div>

          {saveSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2.5 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Informasi kontak berhasil disimpan!</span>
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
      ) : (
        /* Tab 2: Kotak Masuk Pesan */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Daftar Pesan Masuk ({messages.length})
            </h2>
          </div>

          {messages.length === 0 ? (
            <div className="p-12 text-center text-slate-400 dark:text-slate-500 text-xs">
              Belum ada pesan yang masuk dari pengunjung.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => handleOpenMessage(msg)}
                  className={`p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${
                    !msg.isRead ? "bg-blue-50/40 dark:bg-blue-950/20 font-semibold" : ""
                  }`}
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      {!msg.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#0066ff] shrink-0" />
                      )}
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{msg.name}</span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">({msg.email})</span>
                      {msg.phone && (
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          {msg.phone}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1">{msg.message}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">
                      {new Date(msg.createdAt).toLocaleString("id-ID", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleOpenMessage(msg)}
                      className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                      title="Lihat Rincian"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      title="Hapus Pesan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Message View Modal */}
      {selectedMessage && (
        <Modal
          isOpen={!!selectedMessage}
          onClose={() => setSelectedMessage(null)}
          title="Rincian Pesan Pengunjung"
        >
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400 dark:text-slate-500 font-medium">Pengirim:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{selectedMessage.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 dark:text-slate-500 font-medium">Email:</span>
                <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 dark:text-blue-400 font-medium underline">
                  {selectedMessage.email}
                </a>
              </div>
              {selectedMessage.phone && (
                <div className="flex justify-between">
                  <span className="text-slate-400 dark:text-slate-500 font-medium">No. Telepon / WA:</span>
                  <a href={`https://wa.me/${selectedMessage.phone.replace(/[^0-9]/g, "")}`} target="_blank" className="text-emerald-600 dark:text-emerald-400 font-medium underline">
                    {selectedMessage.phone}
                  </a>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400 dark:text-slate-500 font-medium">Waktu:</span>
                <span className="text-slate-600 dark:text-slate-400">
                  {new Date(selectedMessage.createdAt).toLocaleString("id-ID", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Isi Pesan:</label>
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                {selectedMessage.message}
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Tutup
              </button>
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: Informasi Solusi Jaringan Globallink`}
                className="px-5 py-2 rounded-xl bg-[#0066ff] hover:bg-[#0052cc] text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Balas via Email</span>
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
