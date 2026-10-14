"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "../base/Container";
import { ArrowRight, MessageSquare, Headphones, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { contentApi } from "@/lib/api/content";

export const CtaSection: React.FC = () => {
  const [data, setData] = useState({
    cta_headline: "Siap Menghubungkan Bisnis Anda ke Tingkat Berikutnya?",
    cta_subheadline:
      "Konsultasikan kebutuhan infrastruktur jaringan dan solusi teknologi enterprise bersama tim spesialis Globallink sekarang.",
    cta_button_text: "Hubungi Tim Ahli Kami",
    cta_button_link: "/#kontak",
    cta_background_image: "/images/cta-connectivity-banner.jpg",
  });

  useEffect(() => {
    const fetchCta = async () => {
      try {
        const res = await contentApi.getByGroup("cta");
        if (res) {
          setData((prev) => ({ ...prev, ...res }));
        }
      } catch (err) {
        // fallback
      }
    };
    fetchCta();
  }, []);

  return (
    <section className="relative pt-32 pb-36 overflow-hidden min-h-[520px] flex items-center bg-[#07132b]">
      {/* Top Wave Divider */}
      <div className="absolute -top-[1px] left-0 right-0 z-10 pointer-events-none leading-none text-white dark:text-slate-950 transition-colors duration-200">
        <svg
          viewBox="0 0 1440 100"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto block align-top"
          preserveAspectRatio="none"
        >
          <path
            d="M0 0H1440V25C1080 80 540 10 0 60V0Z"
          />
        </svg>
      </div>

      {/* Background Photography */}
      <motion.div
        initial={{ scale: 1.05, opacity: 0.9 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 z-0 origin-center"
      >
        <img
          src={data.cta_background_image || "/images/cta-connectivity-banner.jpg"}
          alt="Globallink Connected Smart City Infrastructure"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07132b]/92 via-[#0a193b]/80 to-[#07132b]/92" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#07132b]/80 via-transparent to-[#07132b]/90" />
      </motion.div>

      <Container size="xl" className="relative z-10">
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
          className="text-center max-w-3xl mx-auto space-y-6"
        >
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
            }}
            className="text-[11px] font-bold tracking-[0.2em] text-cyan-400 uppercase"
          >
            Konsultasi Enterprise & Dukungan 24/7
          </motion.p>

          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
            }}
            className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-white leading-[1.18] tracking-tight"
          >
            {data.cta_headline}
          </motion.h2>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
            }}
            className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal"
          >
            {data.cta_subheadline}
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
            }}
            className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2 text-xs font-semibold text-slate-300"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>Respon Cepat &lt; 15 Menit</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-slate-500 hidden sm:block" />
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-cyan-400" />
              <span>Dukungan NOC 24 Jam</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-slate-500 hidden sm:block" />
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Jaminan SLA 99.9%</span>
            </div>
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
            }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <Link
              href={data.cta_button_link || "/#kontak"}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#0055d4] to-cyan-500 hover:from-[#0047b3] hover:to-cyan-600 text-white text-xs sm:text-sm font-bold shadow-xl shadow-blue-500/30 hover:shadow-cyan-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{data.cta_button_text || "Hubungi Tim Ahli Kami"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>

            <a
              href="https://wa.me/6281188990000"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-bold hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <span>Hubungi via WhatsApp</span>
            </a>
          </motion.div>
        </motion.div>
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
