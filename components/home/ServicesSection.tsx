"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { Container } from "../base/Container";
import { Modal } from "../base/Modal";
import { servicesApi } from "@/lib/api/services";
import { contentApi } from "@/lib/api/content";
import { ServiceItemData } from "@/types";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Phone,
  Compass,
  Code,
  Clock,
  Zap,
} from "lucide-react";

export const SERVICE_THEME_IMAGES: Record<string, string> = {
  "internet-service": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80",
  "smart-cctv": "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80",
  "skystar": "https://images.unsplash.com/photo-1517976487507-5b3b4b45a9b7?auto=format&fit=crop&w=1200&q=80",
  "purchasing": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
  "it-consulting": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
  "managed-service": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
};

export const DEFAULT_TECH_PILLS: Record<string, string[]> = {
  "internet-service": ["Fiber Optic", "Dedicated 1:1", "99.9% SLA", "IPv4/IPv6", "Metro-E", "BGP Peering"],
  "smart-cctv": ["AI Analytics", "4K UHD", "Face Recognition", "Cloud & NVR", "H.265+", "Motion Alert"],
  "skystar": ["VSAT Satellite", "Ku-Band & C-Band", "Remote 3T", "High Availability", "VoIP Ready"],
  "purchasing": ["Enterprise Hardware", "Official Warranty", "Server & Storage", "Cisco & Mikrotik", "Fast Delivery"],
  "it-consulting": ["IT Architecture", "Security Audit", "Infrastructure Audit", "Disaster Recovery", "Cloud Strategy"],
  "managed-service": ["24/7 NOC", "SLA Guarantee", "Incident Management", "Preventive Maintenance", "Proactive Alert"],
};
import { motion, useInView } from "framer-motion";

function cleanText(text?: string): string {
  if (!text) return "";
  return text
    .replace(/<br\s*[\/]?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/* ─── Default fallback services ─── */
const DEFAULT_SERVICES: ServiceItemData[] = [
  {
    id: 1,
    title: "Internet Service",
    slug: "internet-service",
    description:
      "Penyedia jaringan internet bandwidth tinggi berkecepatan prima, stabil, dan teruji skala nasional untuk operasional bisnis tanpa jeda.",
    icon: "Network",
    badge: "Dedicated Bandwidth",
    features: JSON.stringify(["Low Latency Metro-E", "24/7 NOC Monitoring", "Bandwidth Simetris 1:1"]),
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 2,
    title: "Smart CCTV & AI Monitoring",
    slug: "smart-cctv",
    description:
      "Sistem pengawasan pintar terintegrasi dengan teknologi AI, deteksi objek otomatis, penyimpanan cloud aman, dan pemantauan real-time 24/7.",
    icon: "Shield",
    badge: "Smart Surveillance",
    features: JSON.stringify(["Face & Object Recognition", "Cloud & On-premise Storage", "Live Remote Monitoring 24/7"]),
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 3,
    title: "Skystar Satellite (VSAT)",
    slug: "skystar",
    description:
      "Solusi komunikasi satelit berkecepatan tinggi untuk lokasi terpencil, lepas pantai, perkebunan, dan area pertambangan di seluruh nusantara.",
    icon: "Radio",
    badge: "Remote Satellite 3T",
    features: JSON.stringify(["Jangkauan Seluruh Indonesia", "Anti-Cuaca Ekstrem", "Cepat Terpasang"]),
    sortOrder: 3,
    isActive: true,
  },
  {
    id: 4,
    title: "Hardware Procurement",
    slug: "purchasing",
    description:
      "Penyediaan perangkat keras IT, server, switch, router, dan workstation berkualitas tinggi bergaransi resmi dengan harga kompetitif.",
    icon: "Cpu",
    badge: "Enterprise Hardware",
    features: JSON.stringify(["Hardware Resmi Bergaransi", "Server & Networking Devices", "Best Price Enterprise"]),
    sortOrder: 4,
    isActive: true,
  },
  {
    id: 5,
    title: "IT Consulting & Security",
    slug: "it-consulting",
    description:
      "Layanan audit keamanan siber, perancangan arsitektur jaringan, dan konsultasi transformasi digital untuk meningkatkan efisiensi TI perusahaan.",
    icon: "Server",
    badge: "Cyber Security & Architecture",
    features: JSON.stringify(["Cyber Security Assessment", "Digital Transformation Road", "Cost Optimization"]),
    sortOrder: 5,
    isActive: true,
  },
  {
    id: 6,
    title: "Managed Service & NOC 24/7",
    slug: "managed-service",
    description:
      "Pemeliharaan preventif, pengelolaan infrastruktur jaringan menyeluruh, serta dukungan teknis Network Operation Center siaga penuh 24/7.",
    icon: "Network",
    badge: "24/7 Dedicated SLA",
    features: JSON.stringify(["24/7 Dedicated NOC Team", "Preventive Maintenance", "Fast Incident Response"]),
    sortOrder: 6,
    isActive: true,
  },
];

/* ─── SVG Icons ─── */
const ServiceIcon: React.FC<{ id: string; className?: string }> = ({
  id,
  className = "w-6 h-6",
}) => {
  const svgBase = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    className,
  };

  switch (id) {
    case "internet-service":
      return (
        <svg {...svgBase}>
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
    case "smart-cctv":
      return (
        <svg {...svgBase}>
          <path d="M16.7 8A3 3 0 0 0 14 6h-4a3 3 0 0 0-2.7 2L6 14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l-1.3-6z" />
          <circle cx="12" cy="11" r="2.5" />
          <path d="M12 16v4" />
          <path d="M8 20h8" />
        </svg>
      );
    case "skystar":
      return (
        <svg {...svgBase}>
          <path d="M4 10a7.5 7.5 0 0 0 10 10l2-2a7.5 7.5 0 0 0-10-10l-2 2z" />
          <path d="M8 14l-4 4" />
          <path d="M16 6l3-3" />
          <path d="M19 9l2-2" />
          <circle cx="12" cy="12" r="1.5" />
        </svg>
      );
    case "purchasing":
      return (
        <svg {...svgBase}>
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      );
    case "it-consulting":
      return (
        <svg {...svgBase}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      );
    case "managed-service":
    default:
      return (
        <svg {...svgBase}>
          <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
          <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
          <line x1="6" y1="6" x2="6.01" y2="6" />
          <line x1="6" y1="18" x2="6.01" y2="18" />
        </svg>
      );
  }
};

/* ─────────────────────────────────────── */
export const ServicesSection: React.FC = () => {
  const [servicesList, setServicesList] = useState<ServiceItemData[]>(DEFAULT_SERVICES);
  const [sectionMeta, setSectionMeta] = useState({
    services_eyebrow: "Our Solutions & Services",
    services_title: "Satu Jaringan.",
    services_title_highlight: "Banyak Kemungkinan.",
    services_subtitle:
      "Kami menyediakan layanan teknologi dan infrastruktur terlengkap untuk mendukung pertumbuhan bisnis Anda di era digital.",
  });

  const [selectedService, setSelectedService] = useState<ServiceItemData | null>(null);
  const [activeIndex, setActiveIndex]         = useState(0);
  const [exitingIndex, setExitingIndex]       = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused]               = useState(false);
  const [containerWidth, setContainerWidth]   = useState<number>(420);
  const [isMobile, setIsMobile]               = useState<boolean>(false);

  const sectionRef = useRef<HTMLElement>(null);
  const isInView   = useInView(sectionRef, { once: true, margin: "-100px" });

  /* ── responsive dimension calculation ── */
  useEffect(() => {
    const updateDimensions = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      if (stackContainerRef.current) {
        setContainerWidth(stackContainerRef.current.clientWidth);
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const cardWidth = isMobile
    ? Math.max(280, Math.min(containerWidth - 24, 380))
    : 420;
  const cardHeight = isMobile ? 380 : 400;

  const getStackConfig = (pos: number) => {
    if (isMobile) {
      switch (pos) {
        case -1:
          return { x: -(cardWidth + 40), scale: 0.9, opacity: 0, zIndex: 0 };
        case 0:
          return { x: 0, scale: 1, opacity: 1, zIndex: 30 };
        case 1:
          return { x: 18, scale: 0.95, opacity: 0.65, zIndex: 20 };
        case 2:
          return { x: 30, scale: 0.89, opacity: 0.35, zIndex: 10 };
        default:
          return { x: 42, scale: 0.82, opacity: 0, zIndex: 0 };
      }
    }
    // Desktop layout
    switch (pos) {
      case -1:
        return { x: -560, scale: 0.88, opacity: 0, zIndex: 0 };
      case 0:
        return { x: 0, scale: 1, opacity: 1, zIndex: 30 };
      case 1:
        return { x: 300, scale: 0.94, opacity: 0.85, zIndex: 20 };
      case 2:
        return { x: 375, scale: 0.88, opacity: 0.45, zIndex: 10 };
      default:
        return { x: 420, scale: 0.84, opacity: 0, zIndex: 0 };
    }
  };

  /* ── fetch data ── */
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const [items, meta] = await Promise.all([
          servicesApi.getAllPublic(),
          contentApi.getByGroup("services"),
        ]);
        if (items && items.length > 0) setServicesList(items);
        if (meta) {
          setSectionMeta((prev) => ({
            ...prev,
            ...meta,
            services_eyebrow:        cleanText(meta.services_eyebrow        || prev.services_eyebrow),
            services_title:           cleanText(meta.services_title           || prev.services_title),
            services_title_highlight: cleanText(meta.services_title_highlight || prev.services_title_highlight),
            services_subtitle:        cleanText(meta.services_subtitle        || prev.services_subtitle),
          }));
        }
      } catch (_) {}
    };
    fetchServices();
  }, []);

  const totalCards = servicesList.length;

  /* ── navigation ── */
  const goNext = useCallback(() => {
    if (isTransitioning || totalCards === 0) return;
    setIsTransitioning(true);
    const outgoing = activeIndex;
    setExitingIndex(outgoing);
    setActiveIndex((prev) => (prev + 1) % totalCards);
    setTimeout(() => {
      setExitingIndex(null);
      setIsTransitioning(false);
    }, 650);
  }, [isTransitioning, activeIndex, totalCards]);

  const goPrev = useCallback(() => {
    if (isTransitioning || totalCards === 0) return;
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev - 1 + totalCards) % totalCards);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 650);
  }, [isTransitioning, totalCards]);

  /* ── mouse wheel scroll ── */
  const stackContainerRef = useRef<HTMLDivElement>(null);
  const lastWheelTime = useRef<number>(0);

  useEffect(() => {
    const el = stackContainerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      // Ignore tiny jitter
      if (Math.abs(e.deltaY) < 15 && Math.abs(e.deltaX) < 15) return;

      // Prevent page from scrolling while interacting with card carousel
      e.preventDefault();

      const now = Date.now();
      if (now - lastWheelTime.current < 600) return;

      if (e.deltaY > 15 || e.deltaX > 15) {
        lastWheelTime.current = now;
        goNext();
      } else if (e.deltaY < -15 || e.deltaX < -15) {
        lastWheelTime.current = now;
        goPrev();
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, [goNext, goPrev]);

  /* ── auto-advance ── */
  useEffect(() => {
    if (isPaused || isTransitioning || totalCards === 0) return;
    const timer = setInterval(goNext, 4500);
    return () => clearInterval(timer);
  }, [isPaused, isTransitioning, totalCards, goNext]);

  /* ── drag / swipe ── */
  const dragStartX = useRef<number | null>(null);

  const onDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    dragStartX.current = "touches" in e ? e.touches[0].clientX : e.clientX;
    setIsPaused(true);
  };
  const onDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (dragStartX.current === null) return;
    const clientX = "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
    const diff = dragStartX.current - clientX;
    if (diff > 50)       goNext();
    else if (diff < -50) goPrev();
    dragStartX.current = null;
    setIsPaused(false);
  };

  /* ── helpers ── */
  const parseFeatures = (featuresJson?: string | null): string[] => {
    if (!featuresJson) return ["SLA Jaringan 99.9%", "Dukungan 24/7"];
    try {
      const parsed = JSON.parse(featuresJson);
      return Array.isArray(parsed) ? parsed : [featuresJson];
    } catch {
      return [featuresJson];
    }
  };

  /* ─────────────── RENDER ─────────────── */
  return (
    <section
      ref={sectionRef}
      id="layanan"
      className="relative overflow-hidden bg-white dark:bg-[#0b132b] py-16 sm:py-24 lg:py-32 scroll-mt-24 sm:scroll-mt-28 transition-colors duration-200"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <Container size="xl" className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

          {/* ── Left column ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-6 text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-slate-700 dark:text-slate-300">
                {sectionMeta.services_eyebrow}
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-[50px] font-extrabold text-slate-950 dark:text-white leading-[1.15] tracking-tight">
              {sectionMeta.services_title} <br />
              <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-slate-900 dark:from-blue-400 dark:via-indigo-300 dark:to-white bg-clip-text text-transparent">
                {sectionMeta.services_title_highlight}
              </span>
            </h2>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-normal max-w-md">
              {sectionMeta.services_subtitle}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
                <div className="text-lg sm:text-xl font-extrabold text-slate-950 dark:text-white">99.9% SLA</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">Ketersediaan Jaringan</div>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
                <div className="text-lg sm:text-xl font-extrabold text-emerald-600 dark:text-emerald-400">24/7 Standby</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">NOC Engineer Support</div>
              </div>
            </div>
          </motion.div>

          {/* ── Right column: Stacked Carousel ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative select-none w-full"
          >
            {/* ── Card Stack ── */}
            <div
              ref={stackContainerRef}
              className="relative overflow-hidden py-3 w-full"
              style={{ height: cardHeight + 24 }}
              onMouseDown={onDragStart}
              onMouseUp={onDragEnd}
              onTouchStart={onDragStart}
              onTouchEnd={onDragEnd}
            >
              {servicesList.map((service, index) => {
                const total   = totalCards;
                const isExiting = index === exitingIndex;

                /* calculate stack position */
                let stackPos: number;
                if (isExiting) {
                  stackPos = -1; // exit to left
                } else {
                  stackPos = ((index - activeIndex) % total + total) % total;
                  if (stackPos > 2) stackPos = 99; // hidden behind
                }

                const cfg      = getStackConfig(stackPos);
                const isActive = stackPos === 0;
                const features = parseFeatures(service.features);
                const badgeText = service.badge || "Enterprise Grade";

                return (
                  <motion.div
                    key={service.id}
                    animate={{ x: cfg.x, scale: cfg.scale, opacity: cfg.opacity }}
                    transition={{
                      x:       { duration: 0.65, ease: [0.32, 0.72, 0, 1] },
                      scale:   { duration: 0.65, ease: [0.32, 0.72, 0, 1] },
                      opacity: { duration: 0.45, ease: "easeInOut" },
                    }}
                    style={{
                      position: "absolute",
                      top: 12,
                      left: 0,
                      width: cardWidth,
                      height: cardHeight,
                      zIndex: cfg.zIndex,
                      transformOrigin: "left center",
                    }}
                    onClick={() => {
                      if (isActive && !isTransitioning) setSelectedService(service);
                    }}
                    className={isActive ? "cursor-pointer" : "pointer-events-none"}
                  >
                    {/* ── Card Shell ── */}
                    <div
                      className={`
                        relative w-full h-full rounded-[22px] sm:rounded-[28px] overflow-hidden
                        flex flex-col justify-between p-5 sm:p-7 md:p-8
                        shadow-lg
                        ${isActive
                          ? "bg-gradient-to-br from-[#2563eb] via-[#1e54d4] to-[#1941ba]"
                          : "bg-gradient-to-br from-[#2d6be0] via-[#2457cc] to-[#1e45b2]"
                        }
                      `}
                    >
                      {/* ── Top row: icon + badge ── */}
                      <div className="relative z-10">
                        <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 bg-white/15 border border-white/20 text-white">
                            <ServiceIcon id={service.slug} className="w-5 h-5 sm:w-6 sm:h-6" />
                          </div>
                          <span className="px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-semibold tracking-wide bg-white/15 border border-white/20 text-white shrink-0 truncate max-w-[160px] sm:max-w-none">
                            {badgeText}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl sm:text-[23px] md:text-[25px] font-bold text-white mb-2 sm:mb-3 leading-snug tracking-tight">
                          {service.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs sm:text-sm text-white/85 leading-relaxed mb-4 sm:mb-5 line-clamp-3">
                          {service.description}
                        </p>

                        {/* Feature pills */}
                        {features.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                            {features.slice(0, 2).map((feat, fIdx) => (
                              <span
                                key={fIdx}
                                className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/15 border border-white/20 text-[10px] sm:text-[11px] font-medium text-white truncate max-w-[135px] sm:max-w-none"
                              >
                                <span className="text-cyan-300 text-[10px]">✓</span>
                                <span className="truncate">{feat}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* ── Bottom row ── */}
                      <div
                        className={`relative z-10 pt-3 sm:pt-4 mt-2 border-t border-white/15 flex items-center justify-between transition-all duration-300 ${
                          isActive
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-1 pointer-events-none"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          <span className="relative flex h-2 w-2 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
                          </span>
                          <span className="text-[11px] sm:text-xs font-semibold text-white/90 tracking-wide truncate max-w-[140px] sm:max-w-[230px]">
                            {service.badge || "Dedicated Bandwidth"}
                          </span>
                        </div>

                        <div className="w-9 h-9 sm:w-11 sm:h-11 shrink-0 rounded-full bg-white/20 hover:bg-white text-white hover:text-[#1d4ed8] border border-white/25 flex items-center justify-center transition-all duration-300 group">
                          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* ── Controls row ── */}
            <div className="mt-6 flex items-center justify-center lg:justify-start">
              {/* Dot indicators */}
              <div className="flex items-center gap-1.5">
                {servicesList.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Go to card ${i + 1}`}
                    onClick={() => {
                      if (isTransitioning) return;
                      if (i > activeIndex) {
                        // animate forward
                        setIsTransitioning(true);
                        setExitingIndex(activeIndex);
                        setActiveIndex(i);
                        setTimeout(() => { setExitingIndex(null); setIsTransitioning(false); }, 700);
                      } else if (i < activeIndex) {
                        goPrev();
                      }
                    }}
                    className={`h-[5px] rounded-full transition-all duration-300 ${
                      i === activeIndex
                        ? "w-7 bg-blue-600 dark:bg-blue-400"
                        : "w-[5px] bg-slate-300 dark:bg-slate-600 hover:bg-slate-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </Container>

      {/* ── Service Detail Modal (Exact shape from reference portfolio) ── */}
      {selectedService && (
        <Modal
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
          maxWidth="4xl"
          className="!p-0 overflow-hidden border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0c1322]"
        >
          {(() => {
            const features = parseFeatures(selectedService.features);
            const bannerImg =
              selectedService.imageUrl ||
              SERVICE_THEME_IMAGES[selectedService.slug] ||
              "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1200&q=80";
            const techPills =
              DEFAULT_TECH_PILLS[selectedService.slug] || [
                "SLA 99.9%",
                "Dedicated 1:1",
                "24/7 NOC Support",
                "Fiber Optic / Satelit",
                "Enterprise Grade",
                "High Speed",
              ];

            return (
              <div className="flex flex-col">
                {/* ── Top Visual Showcase Banner (Flush to Top) ── */}
                <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-slate-950 flex flex-col justify-end p-6 sm:p-8">
                  {/* Background Image */}
                  <img
                    src={bannerImg}
                    alt={selectedService.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                  />
                  {/* Gradient overlays for high contrast readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/65 to-black/30" />
                  <div className="absolute inset-0 bg-radial-at-c from-transparent via-black/20 to-black/60 pointer-events-none" />

                  {/* Banner Content (Bottom aligned) */}
                  <div className="relative z-10 space-y-2.5 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-md shadow-blue-600/30">
                        {selectedService.badge || "ENTERPRISE SOLUTION"}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-slate-200 bg-white/10 backdrop-blur-md border border-white/20">
                        <Clock className="w-3 h-3 text-cyan-300" />
                        <span>SLA 99.9% Uptime</span>
                      </span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight uppercase leading-tight drop-shadow-md">
                      {selectedService.title}
                    </h2>
                  </div>
                </div>

                {/* ── Lower Body (2 Columns Structure matching reference) ── */}
                <div className="p-6 sm:p-8 bg-white dark:bg-[#0c1322]">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
                    {/* Left Column (~60%): Project Overview & Key Features */}
                    <div className="lg:col-span-7 space-y-6">
                      {/* Section: Project Overview */}
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2 text-xs font-black tracking-wider text-blue-600 dark:text-cyan-400 uppercase">
                          <Compass className="w-4 h-4 shrink-0" />
                          <span>PROJECT OVERVIEW</span>
                        </div>
                        <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                          {selectedService.description}
                        </p>
                      </div>

                      {/* Section: Key Features */}
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center gap-2 text-xs font-black tracking-wider text-blue-600 dark:text-cyan-400 uppercase">
                          <ShieldCheck className="w-4 h-4 shrink-0" />
                          <span>KEY FEATURES</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {features.map((feat, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                              <span className="truncate">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column (~40%): Tech Stack Card + Prominent Action Buttons */}
                    <div className="lg:col-span-5 space-y-4">
                      {/* Tech Stack Card */}
                      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#121c32] border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xs">
                        <div className="flex items-center gap-2 text-xs font-black tracking-wider text-slate-900 dark:text-white uppercase">
                          <Code className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0" />
                          <span>TECH STACK & SPESIFIKASI</span>
                        </div>

                        {/* Tech Pills */}
                        <div className="flex flex-wrap gap-2">
                          {techPills.map((pill, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-2xs"
                            >
                              {pill}
                            </span>
                          ))}
                        </div>

                        {/* Live Preview / Lihat Detail Layanan Button inside the card */}
                        <div className="pt-2">
                          <Link
                            href={`/services/${selectedService.slug}`}
                            onClick={() => setSelectedService(null)}
                            className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-black text-xs sm:text-sm shadow-md shadow-blue-500/30 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 group uppercase tracking-wider"
                          >
                            <span>LIHAT DETAIL LAYANAN</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>

                      {/* Secondary WhatsApp Button */}
                      <a
                        href={`https://wa.me/6281188990000?text=${encodeURIComponent(
                          `Halo Globallink, saya ingin konsultasi mengenai layanan ${selectedService.title}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs sm:text-sm shadow-xs transition-all duration-200 hover:-translate-y-0.5"
                      >
                        <Phone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Konsultasi WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}
    </section>
  );
};
