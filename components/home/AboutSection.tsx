"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "../base/Container";
import { 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  Globe2, 
  Award, 
  Users2 
} from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedCounter } from "../base/AnimatedCounter";
import { contentApi } from "@/lib/api/content";
import { aboutStatsApi } from "@/lib/api/about-stats";
import { AboutStatData } from "@/types";

// Helper to clean legacy HTML tags if any exist
function cleanText(text?: string): string {
  if (!text) return "";
  return text
    .replace(/<br\s*[\/]?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export const AboutSection: React.FC = () => {
  const [content, setContent] = useState({
    about_eyebrow: "Tentang Globallink",
    about_title: "Teknologi yang Menggerakkan",
    about_title_highlight: "Bisnis ke Masa Depan.",
    about_description:
      "Globallink adalah penyedia solusi teknologi informasi dan infrastruktur jaringan terkemuka di Indonesia. Kami berdedikasi untuk memberikan konektivitas berkecepatan tinggi, aman, dan andal bagi korporasi, instansi pemerintah, dan penyedia layanan.",
    about_mission_badge: "MISI KAMI",
    about_mission_statement:
      "Menjadi mitra terpercaya dalam transformasi digital nusantara dengan menghadirkan solusi jaringan cerdas berstandar global.",
    about_image: "/images/about-buildings-bg.jpg",
  });

  const [stats, setStats] = useState<AboutStatData[]>([
    { id: 1, value: "200+", label: "Klien Korporat", description: null, sortOrder: 1 },
    { id: 2, value: "15+", label: "Tahun Pengalaman", description: null, sortOrder: 2 },
    { id: 3, value: "99.9%", label: "Uptime Jaringan", description: null, sortOrder: 3 },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aboutRes, statsRes] = await Promise.all([
          contentApi.getByGroup("about"),
          aboutStatsApi.getAll(),
        ]);
        if (aboutRes) {
          setContent((prev) => ({ ...prev, ...aboutRes }));
        }
        if (statsRes && statsRes.length > 0) {
          setStats(statsRes);
        }
      } catch (err) {
        // fallback
      }
    };
    fetchData();
  }, []);

  return (
    <section id="tentang-kami" className="relative min-h-[95vh] pt-36 pb-36 flex items-center overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-200">
      {/* Top Wave Divider */}
      <div className="absolute -top-[1px] left-0 right-0 z-10 pointer-events-none leading-none text-white dark:text-[#0b132b] transition-colors duration-200">
        <svg
          viewBox="0 0 1440 100"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block align-top"
          preserveAspectRatio="none"
        >
          <path
            d="M0 0H1440V30C1080 80 540 15 0 65V0Z"
          />
        </svg>
      </div>

      {/* Background Photography */}
      <motion.div
        initial={{ opacity: 0.9, scale: 1.03 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 z-0 origin-center"
      >
        <img
          src={content.about_image || "/images/about-buildings-bg.jpg"}
          alt="Modern Architecture Globallink Skyscraper Headquarters"
          className="w-full h-full object-cover object-center dark:brightness-[0.45] transition-[filter] duration-300"
        />
        {/* Light Mode Gradient Overlay */}
        <div 
          className="absolute inset-0 w-full pointer-events-none dark:hidden"
          style={{
            background: "linear-gradient(to right, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.96) 28%, rgba(255, 255, 255, 0.82) 50%, rgba(255, 255, 255, 0.45) 75%, rgba(255, 255, 255, 0.08) 100%)"
          }}
        />
        {/* Dark Mode Gradient Overlay */}
        <div 
          className="absolute inset-0 w-full pointer-events-none hidden dark:block"
          style={{
            background: "linear-gradient(to right, rgba(2, 6, 23, 0.95) 0%, rgba(2, 6, 23, 0.85) 30%, rgba(2, 6, 23, 0.55) 60%, rgba(2, 6, 23, 0.20) 100%)"
          }}
        />
        {/* Subtle Dot Matrix Pattern */}
        <div
          className="absolute inset-0 opacity-[0.18] dark:opacity-[0.12] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(15, 23, 42, 0.14) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </motion.div>

      <Container size="xl" className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Narrative */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className="lg:col-span-8 space-y-7 text-left max-w-2xl"
          >
            {/* Eyebrow */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="text-[11px] font-bold tracking-[0.2em] text-slate-700 dark:text-slate-300 uppercase"
            >
              {content.about_eyebrow}
            </motion.p>

            {/* Headline */}
            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-slate-950 dark:text-white leading-[1.12] tracking-tight"
            >
              {cleanText(content.about_title)}{" "}
              {content.about_title_highlight && (
                <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-slate-900 dark:from-blue-400 dark:via-indigo-300 dark:to-white bg-clip-text text-transparent block sm:inline">
                  {cleanText(content.about_title_highlight)}
                </span>
              )}
            </motion.h2>

            {/* Body */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal"
            >
              {content.about_description}
            </motion.p>

            {/* Value Pillars */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1"
            >
              <div className="p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Infrastruktur Aman</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-1">Proteksi data & koneksi enterprise terenkripsi</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">SLA 99.9% Terjamin</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-1">Jaminan ketersediaan jaringan non-stop</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mb-2">
                  <Users2 className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Tim Ahli 24/7</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-1">Engineer bersertifikasi siaga setiap saat</p>
              </div>
            </motion.div>

            {/* Dynamic Stats Row */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="pt-2 border-t border-slate-200/80 dark:border-slate-800"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                {stats.slice(0, 4).map((st, i) => (
                  <div
                    key={st.id || i}
                    className="p-4 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-xs text-left hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white block">
                      <AnimatedCounter value={st.value} duration={1.2} />
                    </span>
                    <span className="text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 block mt-0.5">
                      {st.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Links */}
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/#kontak"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-slate-950 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 group"
                >
                  <span>Kenali Lebih Dekat</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>

                <Link
                  href="/#layanan"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-900 dark:text-slate-100 text-xs font-semibold transition-all duration-200 hover:bg-white dark:hover:bg-slate-800 hover:-translate-y-0.5 shadow-xs"
                >
                  <span>Lihat Seluruh Layanan</span>
                </Link>
              </div>
            </motion.div>

          </motion.div>

          {/* Right Column Floating Line-Accent Highlights (Cardless, Seamless) */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="lg:col-span-4 hidden lg:flex flex-col gap-7 items-end"
          >
            {/* Node 1: Jaringan Nasional */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="pl-5 border-l-2 border-blue-600/50 hover:border-blue-600 transition-colors max-w-xs text-left"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
                </span>
                <span className="text-[10px] font-bold tracking-[0.16em] text-slate-700 dark:text-slate-300 uppercase">
                  Jaringan Nasional
                </span>
              </div>
              <p className="text-base font-extrabold text-slate-950 dark:text-white tracking-tight">Cakupan Nusantara</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal mt-1">
                Menghubungkan jaringan data center & fiber optic di lebih dari 34 provinsi seluruh Indonesia.
              </p>
            </motion.div>

            {/* Node 2: 24/7 NOC Active */}
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              className="pl-5 border-l-2 border-indigo-600/50 hover:border-indigo-600 transition-colors max-w-xs text-left"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600" />
                </span>
                <span className="text-[10px] font-bold tracking-[0.16em] text-slate-700 dark:text-slate-300 uppercase">
                  Network Monitoring
                </span>
              </div>
              <p className="text-base font-extrabold text-slate-950 dark:text-white tracking-tight">24/7 NOC Active</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal mt-1">
                Pemantauan traffic dan latensi simetris secara proaktif dan real-time tanpa henti.
              </p>
            </motion.div>
          </motion.div>

        </div>
      </Container>

      {/* Bottom Wave Divider */}
      <div className="absolute -bottom-[1px] left-0 right-0 z-10 pointer-events-none leading-none text-white dark:text-slate-950 transition-colors duration-200">
        <svg
          viewBox="0 0 1440 100"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block align-bottom"
          preserveAspectRatio="none"
        >
          <path
            d="M0 40C320 90 640 0 1040 50C1240 75 1360 85 1440 85V100H0V40Z"
          />
        </svg>
      </div>
    </section>
  );
};
