"use client";

import React, { useEffect, useState } from "react";
import {
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  PanelBottom,
  Building2,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Linkedin,
  Facebook,
  ShieldCheck,
  Eye,
  ExternalLink,
} from "lucide-react";
import { contentApi } from "@/lib/api/content";

export default function AdminFooterPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    footer_description:
      "Didirikan sejak tahun 2010, Globallink berkomitmen menghadirkan solusi infrastruktur jaringan dan teknologi terintegrasi untuk Indonesia. Menghubungkan bisnis dengan konektivitas tanpa batas.",
    footer_address:
      "Jl. Urip Sumoharjo No. 20 – Graha Pena Lantai 3 Kav (317-318), Makassar, Sulawesi Selatan",
    footer_phone: "+62 813 1717 1759",
    footer_email: "info@globallink.net.id",
    footer_instagram_handle: "@Globallink.id",
    footer_instagram_url: "https://instagram.com/globallink.id",
    footer_linkedin_url: "https://linkedin.com/company/globallink",
    footer_facebook_url: "https://facebook.com/globallink.id",
    footer_copyright_text: "© 2025 Globallink · Hak cipta dilindungi undang-undang.",
    footer_privacy_url: "/#kontak",
    footer_terms_url: "/#kontak",
  });

  useEffect(() => {
    const loadFooterData = async () => {
      try {
        setLoading(true);
        // Load data from footer group, and fallback check on settings / contact
        const [footerRes, settingsRes, contactRes] = await Promise.all([
          contentApi.getByGroup("footer").catch(() => ({} as Record<string, string>)),
          contentApi.getByGroup("settings").catch(() => ({} as Record<string, string>)),
          contentApi.getByGroup("contact").catch(() => ({} as Record<string, string>)),
        ]);

        const settings = (settingsRes || {}) as Record<string, string>;
        const contact = (contactRes || {}) as Record<string, string>;
        const footer = (footerRes || {}) as Record<string, string>;

        setFormData((prev) => ({
          ...prev,
          ...(settings["copyright_text"] ? { footer_copyright_text: settings["copyright_text"] } : {}),
          ...(settings["social_instagram"] ? { footer_instagram_url: settings["social_instagram"] } : {}),
          ...(settings["social_linkedin"] ? { footer_linkedin_url: settings["social_linkedin"] } : {}),
          ...(settings["social_facebook"] ? { footer_facebook_url: settings["social_facebook"] } : {}),
          ...(contact["contact_address"] ? { footer_address: contact["contact_address"] } : {}),
          ...(contact["contact_phone"] ? { footer_phone: contact["contact_phone"] } : {}),
          ...(contact["contact_email"] ? { footer_email: contact["contact_email"] } : {}),
          ...footer,
        }));
      } catch (err: any) {
        console.error("Gagal memuat konten footer:", err);
        setErrorMessage("Gagal memuat konfigurasi footer dari server.");
      } finally {
        setLoading(false);
      }
    };
    loadFooterData();
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
      const items = [
        ...Object.entries(formData).map(([key, value]) => ({
          key,
          value,
          group: "footer",
        })),
        // Sync shared keys for backward compatibility
        { key: "copyright_text", value: formData.footer_copyright_text, group: "settings" },
        { key: "social_instagram", value: formData.footer_instagram_url, group: "settings" },
        { key: "social_linkedin", value: formData.footer_linkedin_url, group: "settings" },
        { key: "social_facebook", value: formData.footer_facebook_url, group: "settings" },
      ];

      await contentApi.bulkUpdate(items);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4500);
    } catch (err: any) {
      setErrorMessage(err.message || "Gagal menyimpan perubahan footer.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 space-y-4">
        <Loader2 className="w-8 h-8 text-[#0066ff] animate-spin" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Memuat konfigurasi footer...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-24">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 flex items-center justify-center text-[#0066ff] dark:text-blue-400">
              <PanelBottom className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Kelola Konten Footer
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
            Atur deskripsi singkat, informasi kontak langsung, tautan sosial media, dan hak cipta di bagian bawah seluruh halaman publik.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-[#0066ff] hover:bg-[#0052cc] text-white text-sm font-semibold shadow-md shadow-blue-500/20 flex items-center gap-2 self-start sm:self-auto transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? "Menyimpan..." : "Simpan Perubahan"}</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm font-medium flex items-center gap-3 shadow-sm animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Pengaturan footer berhasil disimpan dan disinkronkan ke halaman publik!</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-sm font-medium flex items-center gap-3 shadow-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Deskripsi Profil Perusahaan */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 space-y-5 shadow-sm">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Building2 className="w-4 h-4 text-[#0066ff] dark:text-blue-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Profil Ringkas Footer (Kolom 1)
            </h2>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
              Deskripsi Singkat Perusahaan
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Teks ini tampil tepat di bawah logo Globallink di kolom pertama footer.
            </p>
            <textarea
              rows={3}
              value={formData.footer_description}
              onChange={(e) => handleChange("footer_description", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff] leading-relaxed resize-y"
              placeholder="Masukkan deskripsi singkat perusahaan..."
            />
          </div>
        </div>

        {/* Card 2: Informasi Kontak */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 space-y-5 shadow-sm">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <MapPin className="w-4 h-4 text-[#0066ff] dark:text-blue-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Informasi Kontak Langsung (Kolom Hubungi Kami)
            </h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Alamat Kantor Operasional</span>
              </label>
              <textarea
                rows={2}
                value={formData.footer_address}
                onChange={(e) => handleChange("footer_address", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff] leading-relaxed resize-none"
                placeholder="Jl. Urip Sumoharjo..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>No. Telepon / WhatsApp</span>
                </label>
                <input
                  type="text"
                  value={formData.footer_phone}
                  onChange={(e) => handleChange("footer_phone", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff]"
                  placeholder="+62 813 1717 1759"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>Alamat Email Resmi</span>
                </label>
                <input
                  type="email"
                  value={formData.footer_email}
                  onChange={(e) => handleChange("footer_email", e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff]"
                  placeholder="info@globallink.net.id"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Media Sosial */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 space-y-5 shadow-sm">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <Instagram className="w-4 h-4 text-pink-600 dark:text-pink-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Media Sosial & Tautan Terkait
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                <span>Instagram URL</span>
              </label>
              <input
                type="text"
                value={formData.footer_instagram_url}
                onChange={(e) => handleChange("footer_instagram_url", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff]"
                placeholder="https://instagram.com/globallink.id"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Instagram className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                <span>Teks Display Instagram di Hubungi Kami</span>
              </label>
              <input
                type="text"
                value={formData.footer_instagram_handle}
                onChange={(e) => handleChange("footer_instagram_handle", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff]"
                placeholder="@Globallink.id"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Linkedin className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
                <span>LinkedIn URL</span>
              </label>
              <input
                type="text"
                value={formData.footer_linkedin_url}
                onChange={(e) => handleChange("footer_linkedin_url", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff]"
                placeholder="https://linkedin.com/company/globallink"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Facebook className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>Facebook URL</span>
              </label>
              <input
                type="text"
                value={formData.footer_facebook_url}
                onChange={(e) => handleChange("footer_facebook_url", e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff]"
                placeholder="https://facebook.com/globallink.id"
              />
            </div>
          </div>
        </div>

        {/* Card 4: Copyright & Kebijakan */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 space-y-5 shadow-sm">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-800">
            <ShieldCheck className="w-4 h-4 text-[#0066ff] dark:text-blue-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Baris Hak Cipta & Tautan Hukum (Bottom Bar)
            </h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                Teks Hak Cipta (Copyright Notice)
              </label>
              <input
                type="text"
                value={formData.footer_copyright_text}
                onChange={(e) => handleChange("footer_copyright_text", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff]"
                placeholder="© 2025 Globallink · Hak cipta dilindungi undang-undang."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Tautan Kebijakan Privasi
                </label>
                <input
                  type="text"
                  value={formData.footer_privacy_url}
                  onChange={(e) => handleChange("footer_privacy_url", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff]"
                  placeholder="/#kontak"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Tautan Syarat & Ketentuan
                </label>
                <input
                  type="text"
                  value={formData.footer_terms_url}
                  onChange={(e) => handleChange("footer_terms_url", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:border-[#0066ff]"
                  placeholder="/#kontak"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Interactive Footer Preview */}
        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-[#0066ff]" />
              Pratinjau Langsung Tampilan Footer (Live Preview)
            </span>
            <span className="text-[11px] text-slate-400 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700">
              Sinkron Real-time
            </span>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 text-xs text-slate-600 dark:text-slate-300 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <div className="font-bold text-sm text-[#0a193b] dark:text-white">
                  Globallink — Smart IT Solution
                </div>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
                  {formData.footer_description || "(Deskripsi singkat perusahaan...)"}
                </p>
                <div className="flex items-center gap-2 pt-1 text-[#0066ff]">
                  <span className="text-[11px] font-semibold flex items-center gap-1">
                    <Instagram className="w-3 h-3" />
                    {formData.footer_instagram_handle || "@Globallink.id"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-xs uppercase tracking-wider text-[#0a193b] dark:text-white">
                  Hubungi Kami
                </div>
                <div className="text-[11px] space-y-1 text-slate-500 dark:text-slate-400">
                  <div>📍 {formData.footer_address || "Alamat kantor"}</div>
                  <div>📞 Telp/WA: <strong className="text-slate-800 dark:text-slate-200">{formData.footer_phone}</strong></div>
                  <div>✉️ Email: <strong className="text-slate-800 dark:text-slate-200">{formData.footer_email}</strong></div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
              <div>{formData.footer_copyright_text}</div>
              <div className="flex items-center gap-4">
                <span>Kebijakan Privasi</span>
                <span>•</span>
                <span>Syarat & Ketentuan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-xl bg-[#0066ff] hover:bg-[#0052cc] text-white text-sm font-bold shadow-md shadow-blue-500/25 flex items-center gap-2.5 transition-all duration-150 hover:-translate-y-0.5 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? "Menyimpan..." : "Simpan Seluruh Pengaturan Footer"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
