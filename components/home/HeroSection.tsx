"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "../base/Container";
import { 
  ArrowRight, 
  Globe2, 
  Wifi, 
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { contentApi } from "@/lib/api/content";
import { CardSpotlight } from "@/components/ui/card-spotlight";

function cleanText(text?: string): string {
  if (!text) return "";
  return text
    .replace(/<br\s*[\/]?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export const HeroSection: React.FC = () => {
  const [data, setData] = useState({
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
  });

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await contentApi.getByGroup("hero");
        if (res) {
          setData((prev) => ({
            ...prev,
            ...res,
            hero_eyebrow: cleanText(res.hero_eyebrow || prev.hero_eyebrow),
            hero_headline: cleanText(res.hero_headline || prev.hero_headline),
            hero_headline_highlight: cleanText(
              res.hero_headline_highlight || prev.hero_headline_highlight
            ),
            hero_subheadline: cleanText(res.hero_subheadline || prev.hero_subheadline),
          }));
        }
      } catch (err) {
        // Fallback to default
      }
    };
    fetchHero();
  }, []);

  return (
    <section id="beranda" className="relative min-h-[90vh] pt-32 pb-24 flex items-center overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-200">
      {/* Background: Modern Architecture Glass Buildings */}
      <motion.div
        initial={{ scale: 1.04, opacity: 0.85 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 z-0 origin-center"
      >
        <img
          src={data.hero_image || "/images/hero-buildings.jpg"}
          alt="Modern glass skyscraper buildings"
          className="w-full h-full object-cover object-center dark:brightness-[0.45] transition-[filter] duration-300"
        />
        
        {/* Light Mode Gradient Overlay */}
        <div 
          className="absolute inset-0 w-full pointer-events-none dark:hidden"
          style={{
            background: "linear-gradient(to right, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.96) 28%, rgba(255, 255, 255, 0.82) 50%, rgba(255, 255, 255, 0.45) 75%, rgba(255, 255, 255, 0.08) 100%)"
          }}
        />

        {/* Dark Mode Gradient Overlay: Subtle deep night veil allowing architecture lights to remain visible */}
        <div 
          className="absolute inset-0 w-full pointer-events-none hidden dark:block"
          style={{
            background: "linear-gradient(to right, rgba(2, 6, 23, 0.95) 0%, rgba(2, 6, 23, 0.85) 35%, rgba(2, 6, 23, 0.55) 65%, rgba(2, 6, 23, 0.20) 100%)"
          }}
        />

        {/* Subtle Dot Matrix Pattern */}
        <div
          className="absolute inset-0 opacity-[0.20] dark:opacity-[0.10] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(15, 23, 42, 0.14) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </motion.div>

      <Container size="xl" className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.12,
                  delayChildren: 0.1,
                },
              },
            }}
            className="lg:col-span-7 space-y-7 text-left max-w-2xl"
          >
            {/* Headline with High-End Human-Crafted Typography */}
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-slate-950 dark:text-white leading-[1.08] tracking-tight"
            >
              {data.hero_headline} <br />
              <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-slate-900 dark:from-blue-400 dark:via-indigo-300 dark:to-white bg-clip-text text-transparent">
                {data.hero_headline_highlight}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl font-normal"
            >
              {data.hero_subheadline}
            </motion.p>

            {/* Aceternity Style CTA Buttons */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="flex flex-wrap items-center gap-4 pt-1"
            >
              <Link
                href={data.hero_cta_primary_link || "/#layanan"}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-slate-950 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white text-sm font-semibold shadow-xl shadow-slate-950/10 dark:shadow-blue-600/20 hover:shadow-2xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 group"
              >
                <span>{data.hero_cta_primary_text || "Jelajahi Layanan"}</span>
                <ArrowRight className="w-4 h-4 text-slate-300 dark:text-white group-hover:translate-x-1.5 transition-transform duration-200" />
              </Link>

              <Link
                href={data.hero_cta_secondary_link || "/#kontak"}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-slate-300/90 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-600 text-sm font-semibold text-slate-900 dark:text-slate-100 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 group backdrop-blur-sm shadow-xs"
              >
                <span>{data.hero_cta_secondary_text || "Konsultasi Sekarang"}</span>
                <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white group-hover:translate-x-1.5 transition-all duration-200" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Right Floating Metric HUD (Cardless, Seamless Line-Accent Atmosphere) */}
          <div className="lg:col-span-5 hidden lg:flex flex-col gap-9 items-end relative">
            
            {/* Metric 1: 100 Gbps Backbone */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="pl-5 border-l-2 border-blue-600/50 hover:border-blue-600 transition-colors max-w-xs text-left"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
                </span>
                <span className="text-[10px] font-bold tracking-[0.16em] text-slate-700 dark:text-slate-300 uppercase">
                  Core Backbone Capacity
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl sm:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight">100</span>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">Gbps</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal mt-1.5">
                Redundansi rute ganda otomatis dengan koneksi langsung ke OpenIXP & Tier-1 Exchanges.
              </p>
            </motion.div>

            {/* Metric 2: 38+ Provinsi */}
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              className="pl-5 border-l-2 border-indigo-600/50 hover:border-indigo-600 transition-colors max-w-xs text-left"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600" />
                </span>
                <span className="text-[10px] font-bold tracking-[0.16em] text-slate-700 dark:text-slate-300 uppercase">
                  Jangkauan Nasional
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl sm:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight">38+</span>
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Provinsi</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal mt-1.5">
                Integrasi serat optik bawah laut dan satelit SkyNet VSAT ke seluruh penjuru Indonesia.
              </p>
            </motion.div>

          </div>

        </div>

      </Container>

      {/* Elegant Curved Wave Transition Divider */}
      <div className="absolute -bottom-[1px] left-0 right-0 z-10 pointer-events-none leading-none text-white dark:text-[#0b132b] transition-colors duration-200">
        <svg
          viewBox="0 0 1440 80"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-12 sm:h-16 md:h-20 block align-bottom"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C320,60 640,10 1040,50 C1240,70 1360,80 1440,80 L1440,80 L0,80 Z"
          />
        </svg>
      </div>
    </section>
  );
};
