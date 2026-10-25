"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "../base/Container";
import { Instagram, Phone, Mail, MapPin } from "lucide-react";
import { contentApi } from "@/lib/api/content";

export const Footer: React.FC = () => {
  const [content, setContent] = useState({
    footer_description:
      "Didirikan sejak tahun 2010, Globallink berkomitmen menghadirkan solusi infrastruktur jaringan dan teknologi terintegrasi untuk Indonesia. Menghubungkan bisnis dengan konektivitas tanpa batas.",
    footer_address:
      "Jl. Urip Sumoharjo No. 20 – Graha Pena Lantai 3 Kav (317-318), Makassar, Sulawesi Selatan",
    footer_phone: "+62 813 1717 1759",
    footer_email: "info@globallink.net.id",
    footer_instagram_handle: "@Globallink.id",
    footer_instagram_url: "https://instagram.com/globallink.id",
    footer_copyright_text: "© 2025 Globallink · Hak cipta dilindungi undang-undang.",
    footer_privacy_url: "/#kontak",
    footer_terms_url: "/#kontak",
  });

  useEffect(() => {
    const fetchFooterContent = async () => {
      try {
        const [footerRes, settingsRes] = await Promise.all([
          contentApi.getByGroup("footer").catch(() => ({} as Record<string, string>)),
          contentApi.getByGroup("settings").catch(() => ({} as Record<string, string>)),
        ]);

        const settings = (settingsRes || {}) as Record<string, string>;
        const footer = (footerRes || {}) as Record<string, string>;

        setContent((prev) => ({
          ...prev,
          ...(settings["copyright_text"] ? { footer_copyright_text: settings["copyright_text"] } : {}),
          ...(settings["social_instagram"] ? { footer_instagram_url: settings["social_instagram"] } : {}),
          ...footer,
        }));
      } catch (err) {
        // graceful silent fallback
      }
    };
    fetchFooterContent();
  }, []);

  return (
    <footer className="w-full bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 transition-colors duration-200">
      {/* Main Footer Content */}
      <div className="py-14">
        <Container size="xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Column 1: Company Info */}
            <div className="space-y-4">
              <img
                src="/images/globallink-logo.png"
                alt="Globallink"
                className="h-10 sm:h-11 w-auto object-contain dark:hidden"
              />
              <img
                src="/images/globallink-logo-white.png"
                alt="Globallink"
                className="h-10 sm:h-11 w-auto object-contain hidden dark:block"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-[260px]">
                {content.footer_description}
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a
                  href={content.footer_instagram_url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-[#0055d4] dark:hover:bg-blue-600 hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Column 2: Tautan Cepat */}
            <div>
              <h4 className="text-xs font-bold text-[#0a193b] dark:text-white uppercase tracking-wider mb-5">
                Tautan Cepat
              </h4>
              <ul className="space-y-2.5">
                {[
                  { label: "Beranda", href: "/" },
                  { label: "Tentang Kami", href: "/#tentang-kami" },
                  { label: "Layanan Bernilai Tambah", href: "/#layanan" },
                  { label: "Infrastruktur", href: "/#infrastruktur" },
                  { label: "Kabar & Aktivitas", href: "/#blog" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs text-slate-500 dark:text-slate-400 hover:text-[#0055d4] dark:hover:text-blue-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Produk & Layanan */}
            <div>
              <h4 className="text-xs font-bold text-[#0a193b] dark:text-white uppercase tracking-wider mb-5">
                Produk & Layanan
              </h4>
              <ul className="space-y-2.5">
                {[
                  "Layanan Internet",
                  "Smart CCTV",
                  "SkyStar VSAT",
                  "Purchasing Perangkat",
                  "Konsultasi IT",
                  "Managed Service",
                ].map((item) => (
                  <li key={item}>
                    <Link
                      href="/#layanan"
                      className="text-xs text-slate-500 dark:text-slate-400 hover:text-[#0055d4] dark:hover:text-blue-400 transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Hubungi Kami */}
            <div>
              <h4 className="text-xs font-bold text-[#0a193b] dark:text-white uppercase tracking-wider mb-5">
                Hubungi Kami
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                  <span className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {content.footer_address}
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Telepon / WhatsApp:{" "}
                    <strong className="text-[#0a193b] dark:text-white">
                      {content.footer_phone}
                    </strong>
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Email:{" "}
                    <strong className="text-[#0a193b] dark:text-white">
                      {content.footer_email}
                    </strong>
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Instagram className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Instagram:{" "}
                    <a
                      href={content.footer_instagram_url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-[#0a193b] dark:text-white hover:text-[#0055d4] dark:hover:text-blue-400 transition-colors"
                    >
                      {content.footer_instagram_handle}
                    </a>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-slate-100 dark:border-slate-800 py-5">
        <Container size="xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              {content.footer_copyright_text}
            </p>
            <div className="flex items-center gap-5 text-[11px] text-slate-400 dark:text-slate-500">
              <Link
                href={content.footer_privacy_url}
                className="hover:text-[#0055d4] dark:hover:text-blue-400 transition-colors"
              >
                Kebijakan Privasi
              </Link>
              <Link
                href={content.footer_terms_url}
                className="hover:text-[#0055d4] dark:hover:text-blue-400 transition-colors"
              >
                Syarat & Ketentuan
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
};
