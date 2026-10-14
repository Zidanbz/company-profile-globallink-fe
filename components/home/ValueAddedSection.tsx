"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "../base/Container";
import {
  ArrowRight,
  ShieldCheck,
  Radio,
  Sparkles,
  Search,
  CheckCircle2,
  ChevronRight,
  Smartphone,
  Globe,
  Wifi,
  Bell,
  Cpu,
} from "lucide-react";
import { motion } from "framer-motion";

export const ValueAddedSection: React.FC = () => {
  const [activeSidebarItem, setActiveSidebarItem] = useState("Active Routes");
  const [activeSegment, setActiveSegment] = useState<"primary" | "backup">("primary");

  return (
    <section
      id="value-added"
      className="relative pt-24 pb-32 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-200"
    >
      <Container size="xl" className="relative z-10">
        
        {/* ─── Section Header (Human-Crafted Editorial Typography) ─── */}
        <div className="max-w-2xl mb-12 sm:mb-16 text-left">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-slate-950 dark:text-white leading-[1.14] tracking-tight mb-3"
          >
            Infrastruktur Berkelas Dunia, <br />
            <span className="text-slate-500 dark:text-slate-400 font-semibold">
              Nilai Tambah Nyata untuk Bisnis.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base text-slate-600 dark:text-slate-400 leading-relaxed font-normal"
          >
            Dirancang dari awal untuk keandalan maksimal, kecepatan tanpa kompromi, dan transparansi monitoring penuh di genggaman Anda.
          </motion.p>
        </div>

        {/* ─── Architectural Dashed Grid Container ─── */}
        <div className="border border-dashed border-slate-300/90 dark:border-slate-800 rounded-3xl overflow-hidden bg-[#fafafa] dark:bg-slate-900/60 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-dashed divide-slate-300/90 dark:divide-slate-800">
            
            {/* ══════════════════════════════════════════════════════
                COLUMN 1: Human-Crafted Desktop App Workspace Mockup
               ══════════════════════════════════════════════════════ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-between p-6 sm:p-8 md:p-10"
            >
              {/* Canvas Frame with Subtle Dot Matrix */}
              <div className="relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-7 mb-8 overflow-hidden min-h-[390px] flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                
                {/* Dot Grid Background */}
                <div
                  className="absolute inset-0 opacity-[0.35] dark:opacity-[0.15] pointer-events-none"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, rgba(148, 163, 184, 0.4) 1px, transparent 1px)",
                    backgroundSize: "18px 18px",
                  }}
                />

                {/* macOS Desktop Application Window Mockup */}
                <div className="relative z-10 w-full rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/5 overflow-hidden text-left">
                  
                  {/* macOS Title Bar */}
                  <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 select-none">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] border border-[#e0443e]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] border border-[#dea123]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] border border-[#1aab29]" />
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-medium shadow-2xs">
                      <Search className="w-3 h-3 text-slate-400" />
                      <span>globallink-core / topology / ring-01</span>
                    </div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                      ● Live 100G
                    </span>
                  </div>

                  {/* Window Body: Sidebar + Main Topology Canvas */}
                  <div className="grid grid-cols-12 min-h-[220px]">
                    
                    {/* App Sidebar */}
                    <div className="col-span-4 bg-slate-50/60 dark:bg-slate-900/40 border-r border-slate-200/80 dark:border-slate-800 p-3 space-y-1 text-xs">
                      <p className="text-[9px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase px-2 mb-2">
                        Network Routing
                      </p>
                      {[
                        { label: "Active Routes", icon: Globe, count: "14" },
                        { label: "Dual Fiber Ring", icon: Wifi, count: "99.9%" },
                        { label: "Tier-1 Peering", icon: Cpu, count: "0.8ms" },
                        { label: "SkyNet VSAT", icon: Radio, count: "38 Prov" },
                      ].map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => setActiveSidebarItem(item.label)}
                          className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-left transition-all ${
                            activeSidebarItem === item.label
                              ? "bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 font-bold shadow-xs border border-slate-200/70 dark:border-slate-700"
                              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/50 font-normal"
                          }`}
                        >
                          <span className="truncate">{item.label}</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">{item.count}</span>
                        </button>
                      ))}
                    </div>

                    {/* Canvas Main Viewport */}
                    <div className="col-span-8 p-4 bg-white dark:bg-slate-950 flex flex-col justify-between relative overflow-hidden">
                      
                      {/* Top Node Breadcrumb */}
                      <div className="flex items-center justify-between text-[11px] mb-2">
                        <span className="font-bold text-slate-900 dark:text-white">JKT-Cyber2 ↔ SG-Equinix</span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-semibold border border-emerald-200/60 dark:border-emerald-800/60">
                          BGP Synced
                        </span>
                      </div>

                      {/* Interactive Route Nodes Diagram */}
                      <div className="space-y-2.5 my-auto">
                        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                            <div>
                              <p className="text-[11px] font-bold text-slate-900 dark:text-white leading-none">Primary DWDM Backbone</p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">103.148.88.0/24 • Direct Tier-1</p>
                            </div>
                          </div>
                          <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">0.8 ms</span>
                        </div>

                        <div className="p-2.5 rounded-lg bg-slate-50/70 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <div>
                              <p className="text-[11px] font-bold text-slate-900 dark:text-white leading-none">Redundant Failover Ring</p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Subsea Batam Landing Path</p>
                            </div>
                          </div>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                            Auto-Sync
                          </span>
                        </div>
                      </div>

                      {/* Floating Collaboration Cursor (Humanized Detail) */}
                      <motion.div
                        animate={{ x: [0, 15, 0], y: [0, -8, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute bottom-3 right-4 z-20 pointer-events-none flex items-center gap-1.5"
                      >
                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 drop-shadow-sm" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M3 3l7 18 3-7 7-3L3 3z" />
                        </svg>
                        <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-medium shadow-md">
                          Rian (Lead NOC)
                        </span>
                      </motion.div>

                    </div>
                  </div>

                </div>
              </div>

              {/* Bottom Numbered Block */}
              <div className="flex items-start gap-3.5 text-left">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  1
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 leading-snug">
                  <strong className="text-slate-950 dark:text-white font-bold">Arsitektur Jaringan Presisi</strong> — Dikonfigurasi dengan topologi dual-ring fiber optik 100 Gbps dan direct peering Tier-1 tanpa *single point of failure*.
                </div>
              </div>
            </motion.div>


            {/* ══════════════════════════════════════════════════════
                COLUMN 2: Human-Crafted Mobile App & Incident Device Frame
               ══════════════════════════════════════════════════════ */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex flex-col justify-between p-6 sm:p-8 md:p-10"
            >
              {/* Canvas Frame with Smartphone Device Mockup */}
              <div className="relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-7 mb-8 overflow-hidden min-h-[390px] flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                
                {/* Dot Grid Background */}
                <div
                  className="absolute inset-0 opacity-[0.35] dark:opacity-[0.15] pointer-events-none"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, rgba(148, 163, 184, 0.4) 1px, transparent 1px)",
                    backgroundSize: "18px 18px",
                  }}
                />

                {/* Smartphone Device Mockup (iPhone Pro Frame) */}
                <div className="relative z-10 w-[240px] rounded-[32px] bg-slate-950 p-2.5 shadow-2xl shadow-slate-950/20 border-2 border-slate-800 text-left">
                  
                  {/* Speaker & Dynamic Island */}
                  <div className="w-full flex justify-center pb-2 pt-1">
                    <div className="h-4 w-20 bg-slate-900 rounded-full flex items-center justify-between px-2 text-[8px] text-slate-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[7px] text-slate-300 font-semibold">NOC LIVE</span>
                      <Wifi className="w-2.5 h-2.5 text-slate-300" />
                    </div>
                  </div>

                  {/* Inside Screen Content (Globallink Client Portal App) */}
                  <div className="rounded-[22px] bg-white dark:bg-slate-900 p-3.5 space-y-2.5 text-slate-900 dark:text-white">
                    
                    {/* App Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                      <div>
                        <p className="text-[9px] text-slate-400 font-medium">Enterprise Portal</p>
                        <p className="text-[11px] font-extrabold text-slate-950 dark:text-white leading-tight">Globallink Monitor</p>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <Bell className="w-3 h-3" />
                      </div>
                    </div>

                    {/* Live Health Gauge Card */}
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-slate-900 to-slate-950 text-white space-y-1.5 border border-slate-800/80">
                      <div className="flex items-center justify-between text-[9px]">
                        <span className="text-slate-400">UPTIME SLA</span>
                        <span className="text-emerald-400 font-bold">99.99%</span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-lg font-extrabold text-white tracking-tight">850</span>
                        <span className="text-[10px] text-blue-400 font-semibold">/ 1000 Mbps</span>
                      </div>
                      <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full w-[85%] bg-blue-500 rounded-full" />
                      </div>
                    </div>

                    {/* Instant Push Alert Banner */}
                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 flex items-start gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[9px] font-bold text-emerald-900 dark:text-emerald-200 leading-tight">Failover Standby</p>
                        <p className="text-[8px] text-emerald-700 dark:text-emerald-300 leading-tight mt-0.5">Semua 16 node terverifikasi stabil.</p>
                      </div>
                    </div>

                  </div>
                </div>

              </div>

              {/* Bottom Numbered Block */}
              <div className="flex items-start gap-3.5 text-left">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  2
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 leading-snug">
                  <strong className="text-slate-950 dark:text-white font-bold">Monitoring & Respons Cepat 24/7</strong> — Pantauan telemetri *real-time* via portal klien dan tim teknis bersertifikasi yang siap merespons insiden seketika.
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* ─── Bottom Enterprise Assurance Banner ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 rounded-2xl p-6 sm:p-8 bg-slate-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800 shadow-md"
        >
          <div className="space-y-1 text-left">
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Pendampingan Penuh dari Konsultasi hingga Proyek Tuntas
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal max-w-2xl">
              Kami memastikan setiap konfigurasi, instalasi jaringan, dan integrasi sistem berjalan sesuai standar enterprise tertinggi.
            </p>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            <Link
              href="/#kontak"
              className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <span>Konsultasikan Kebutuhan Proyek</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
            </Link>
          </div>
        </motion.div>

      </Container>
    </section>
  );
};

