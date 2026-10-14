"use client";

import React, { useEffect, useState, useRef } from "react";
import { Container } from "../base/Container";
import { Modal } from "../base/Modal";
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  MessageCircle,
  Send,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { contentApi } from "@/lib/api/content";
import { contactApi } from "@/lib/api/contact";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const ContactSection: React.FC = () => {
  const [info, setInfo] = useState({
    contact_title: "Kirimkan Pertanyaan Anda",
    contact_subtitle:
      "Silakan lengkapi formulir di bawah ini. Tim kami akan menghubungi Anda dalam waktu singkat.",
    contact_address:
      "Jl. Urip Sumoharjo No. 20 – Graha Pena Lantai 3 Kav (317-318), Makassar, Sulawesi Selatan",
    contact_email: "info@globallink.net.id",
    contact_phone: "+62 813 1717 1759",
    contact_whatsapp: "+62 813 1717 1759",
    contact_working_hours: "Senin — Jumat 08.00 - 17.00 WIB (NOC 24/7/365)",
  });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // ── Modal Captcha State ──
  const [isCaptchaModalOpen, setIsCaptchaModalOpen] = useState(false);
  const [captchaCode, setCaptchaCode] = useState("");
  const [userCaptcha, setUserCaptcha] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setUserCaptcha("");
    setCaptchaError("");

    setTimeout(() => {
      drawCaptcha(code);
    }, 60);
  };

  const drawCaptcha = (code: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Random security lines
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = `rgba(${Math.floor(Math.random() * 80 + 30)}, ${Math.floor(
        Math.random() * 120 + 80
      )}, 220, 0.45)`;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Characters
    ctx.textBaseline = "middle";
    const startX = 14;
    const spacing = 24;

    for (let i = 0; i < code.length; i++) {
      ctx.save();
      const x = startX + i * spacing;
      const y = canvas.height / 2 + (Math.random() * 4 - 2);
      const angle = (Math.random() * 24 - 12) * (Math.PI / 180);
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.font = "bold 22px monospace";
      ctx.fillStyle = ["#0055d4", "#0f172a", "#1d4ed8", "#0284c7"][i % 4];
      ctx.fillText(code[i], 0, 0);
      ctx.restore();
    }

    // Security dots
    for (let i = 0; i < 28; i++) {
      ctx.fillStyle = `rgba(0, 85, 212, ${Math.random() * 0.4 + 0.1})`;
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        1.2,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  };

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await contentApi.getByGroup("contact");
        if (res) {
          setInfo((prev) => ({ ...prev, ...res }));
        }
      } catch (err) {
        // fallback
      }
    };
    fetchInfo();
  }, []);

  // 1. Validasi awal form saat tombol "Kirim Pesan Sekarang" ditekan
  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      return;
    }

    // Semua field valid -> Munculkan pop-up modal captcha!
    setIsCaptchaModalOpen(true);
    setUserCaptcha("");
    setCaptchaError("");
    setTimeout(() => {
      generateCaptcha();
    }, 100);
  };

  // 2. Verifikasi captcha di dalam modal lalu kirim data
  const handleVerifyAndSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!userCaptcha.trim()) {
      setCaptchaError("Silakan masukkan kode captcha terlebih dahulu.");
      return;
    }

    if (userCaptcha.trim().toUpperCase() !== captchaCode) {
      setCaptchaError("Kode captcha salah. Silakan coba lagi.");
      generateCaptcha();
      return;
    }

    setSubmitting(true);
    setCaptchaError("");

    try {
      await contactApi.submit({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.service
          ? `Permintaan Layanan: ${formData.service}`
          : "Pertanyaan Solusi Jaringan",
        message: formData.message.trim(),
      });

      // Tutup modal dan tampilkan status sukses
      setIsCaptchaModalOpen(false);
      setSuccess(true);
      setFormData({
        name: "",
        phone: "",
        email: "",
        service: "",
        message: "",
      });
      setUserCaptcha("");
      setTimeout(() => setSuccess(false), 6000);
    } catch (err: any) {
      setCaptchaError(err.message || "Gagal mengirimkan pesan. Silakan coba lagi.");
      generateCaptcha();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="kontak"
      className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden transition-colors duration-200"
    >
      <Container size="xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Contact Form with Motion */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-8 sm:p-10 shadow-sm text-left"
          >
            <h3 className="text-xl font-bold text-[#0a193b] dark:text-white mb-2">
              {info.contact_title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
              {info.contact_subtitle}
            </p>

            {success && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2.5 shadow-sm animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  Terima kasih! Pesan Anda telah kami terima dan tim spesialis Globallink akan segera menghubungi Anda.
                </span>
              </div>
            )}

            <form onSubmit={handleInitialSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 block">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="Masukkan nama lengkap Anda"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 block">
                    Nomor Telepon / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="tel"
                    required
                    placeholder="0813 xxxx xxxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 block">
                    Alamat Email Perusahaan <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    required
                    placeholder="email@perusahaan.co.id"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 block">
                    Layanan yang Dibutuhkan
                  </label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="flex h-11 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0055d4] transition-all"
                  >
                    <option value="">Layanan Internet Dedicated</option>
                    <option value="Internet Service">Internet Service</option>
                    <option value="Smart CCTV">Smart CCTV</option>
                    <option value="SkyStar VSAT">SkyStar VSAT</option>
                    <option value="Purchasing">Purchasing</option>
                    <option value="IT Consulting">IT Consulting</option>
                    <option value="Managed Service">Managed Service</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 block">
                  Pesan / Kebutuhan Proyek <span className="text-red-500">*</span>
                </label>
                <Textarea
                  required
                  rows={4}
                  placeholder="Jelaskan secara ringkas spesifikasi teknis, perkiraan kapasitas, area, serta kendala yang dihadapi..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                size="lg"
                className="rounded-full px-8 gap-2.5 font-bold shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Pesan Sekarang</span>
              </Button>
            </form>
          </motion.div>

          {/* Right: Contact Info with Motion */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="space-y-6 text-left"
          >
            {/* Office Info Card */}
            <div className="bg-[#0055d4] rounded-2xl p-8 text-white shadow-lg shadow-blue-500/15">
              <h4 className="text-lg font-bold mb-1">
                Kantor Operasional & Pusat Dukungan
              </h4>
              <div className="space-y-4 mt-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-blue-200" />
                  <p className="text-sm text-blue-100 leading-relaxed">
                    {info.contact_address}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 mt-0.5 shrink-0 text-blue-200" />
                  <p className="text-sm text-blue-100">
                    Jam Operasional: {info.contact_working_hours}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Contact Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={`tel:${info.contact_phone}`}
                className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#0055d4] dark:hover:border-blue-500 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-slate-800 text-[#0055d4] dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:bg-[#0055d4] group-hover:text-white transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Telepon Langsung
                  </div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-white mt-0.5">
                    {info.contact_phone}
                  </div>
                </div>
              </a>

              <a
                href={`https://wa.me/${info.contact_whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    WhatsApp Hotline
                  </div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-white mt-0.5">
                    {info.contact_whatsapp}
                  </div>
                </div>
              </a>

              <a
                href={`mailto:${info.contact_email}`}
                className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#0055d4] dark:hover:border-blue-500 transition-all sm:col-span-2 group"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-slate-800 text-[#0055d4] dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:bg-[#0055d4] group-hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    Kirim Email Resmi
                  </div>
                  <div className="text-sm font-semibold text-slate-800 dark:text-white mt-0.5">
                    {info.contact_email}
                  </div>
                </div>
              </a>
            </div>
          </motion.div>
        </div>
      </Container>

      {/* ── POP-UP MODAL VERIFIKASI CAPTCHA ── */}
      <Modal
        isOpen={isCaptchaModalOpen}
        onClose={() => {
          if (!submitting) {
            setIsCaptchaModalOpen(false);
            setCaptchaError("");
          }
        }}
        maxWidth="md"
      >
        <div className="space-y-5 text-left">
          {/* Header */}
          <div className="flex items-center gap-3.5 pb-1 border-b border-slate-100 dark:border-slate-800">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#0055d4] dark:text-blue-400 flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#0a193b] dark:text-white tracking-tight">
                Verifikasi Keamanan
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Ketik kode captcha berikut untuk mengonfirmasi pengiriman pesan Anda.
              </p>
            </div>
          </div>

          {/* Captcha Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                Kode Captcha
              </span>
              <button
                type="button"
                onClick={generateCaptcha}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 font-semibold transition-colors"
                title="Ganti Kode Baru"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Ganti Kode Baru</span>
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Canvas Visual Code */}
              <div className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-1 flex items-center justify-center shrink-0 shadow-2xs select-none">
                <canvas
                  ref={canvasRef}
                  width={140}
                  height={42}
                  className="rounded-lg"
                />
              </div>

              {/* Input Text */}
              <div className="flex-1">
                <Input
                  autoFocus
                  type="text"
                  maxLength={6}
                  placeholder="Ketik 5 kode di samping"
                  value={userCaptcha}
                  onChange={(e) => {
                    setUserCaptcha(e.target.value.toUpperCase());
                    setCaptchaError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleVerifyAndSend();
                    }
                  }}
                  className={`h-11 font-mono tracking-widest uppercase text-sm ${
                    captchaError ? "border-red-500 ring-1 ring-red-500" : ""
                  }`}
                />
              </div>
            </div>

            {captchaError && (
              <p className="text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{captchaError}</span>
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsCaptchaModalOpen(false);
                setCaptchaError("");
              }}
              disabled={submitting}
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleVerifyAndSend}
              disabled={submitting}
              className="rounded-full px-6 gap-2 font-bold shadow-md shadow-blue-500/20"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Mengirimkan...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Verifikasi & Kirim</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </section>
  );
};
