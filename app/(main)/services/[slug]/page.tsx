"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Container } from "@/components/base/Container";
import { servicesApi } from "@/lib/api/services";
import { ServiceItemData } from "@/types";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MessageSquare,
  Clock,
  Zap,
  Server,
  Network,
  Cpu,
  Radio,
  Building,
  Award,
  ChevronRight,
  Loader2,
  HelpCircle,
  Sparkles,
  FileText,
  Headphones,
  Activity,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import { SERVICE_THEME_IMAGES } from "@/components/home/ServicesSection";

const DEFAULT_FALLBACK_SERVICES: Record<
  string,
  {
    title: string;
    badge: string;
    description: string;
    features: string[];
    useCases: { title: string; desc: string }[];
    specs: { label: string; value: string }[];
  }
> = {
  "internet-service": {
    title: "Internet Dedicated Service",
    badge: "Dedicated Bandwidth 1:1",
    description:
      "Layanan konektivitas internet pita lebar (high-bandwidth) khusus korporasi dengan rasio 1:1 simetris tanpa bagi (unshared), latensi sangat rendah, dan redundansi multi-backbone serat optik nasional.",
    features: [
      "Bandwidth Simetris 1:1 (Upload & Download sama cepat)",
      "SLA Jaminan Uptime 99.9% dengan kompensasi resmi",
      "Koneksi langsung ke OpenIXP, CD-IX, IIX, dan Tier-1 Global Upstream",
      "Alokasi Public IP Address (/29 atau sesuai kebutuhan)",
      "Dedicated MRTG / Cacti bandwidth monitoring dashboard real-time",
      "Dukungan teknisi lokal on-site siaga 24/7/365",
    ],
    useCases: [
      {
        title: "Kantor Pusat & Perbankan",
        desc: "Mendukung transaksi finansial real-time, akses cloud ERP, dan video conference multiparty tanpa hambatan jeda.",
      },
      {
        title: "Kawasan Industri & Pergudangan",
        desc: "Konektivitas stabil untuk otomasi pabrik, sistem IoT pergudangan, dan komunikasi logistik lintas pulau.",
      },
      {
        title: "Instansi Pemerintah & BUMN",
        desc: "Jaringan berkeamanan tinggi untuk sistem administrasi pemerintahan terpadu dan layanan publik digital.",
      },
      {
        title: "Pendidikan & Kampus",
        desc: "Pita lebar andal untuk ribuan mahasiswa, server e-learning kampus, dan riset akademik terdistribusi.",
      },
    ],
    specs: [
      { label: "Rasio Bandwidth", value: "1:1 Dedicated (Simetris)" },
      { label: "SLA Garansi Uptime", value: "99.9% Per Bulan" },
      { label: "Media Transmisi", value: "Fiber Optic (Metro-Ethernet)" },
      { label: "Latensi Domestik", value: "< 15 ms (Jakarta - Makassar Ring)" },
      { label: "IP Alokasi", value: "Public Static IP Included" },
      { label: "Technical Support", value: "NOC 24/7/365 Dedicated Helpdesk" },
    ],
  },
  "smart-cctv": {
    title: "Smart CCTV & AI Video Surveillance",
    badge: "AI Powered Surveillance",
    description:
      "Sistem pengawasan keamanan generasi mutakhir yang memadukan kamera resolusi tinggi Ultra-HD dengan algoritma kecerdasan buatan (AI) untuk deteksi pergerakan, pengenalan wajah, serta pemantauan aset secara real-time.",
    features: [
      "Analisis Cerdas AI: Face Recognition, Plate Number & Intrusion Detection",
      "Penyimpanan Fleksibel: On-premise NVR + Cloud Backup Terenkripsi",
      "Akses Live Monitoring via Smartphone, Tablet, & Central Control Room",
      "Kamera Tahan Cuaca Ekstrem IP67 dengan sensor Infrared Night-Vision",
      "Notifikasi Instan via WhatsApp & Email saat terjadi anomali perimeter",
      "Manajemen multi-cabang terpusat dalam satu dashboard VMS",
    ],
    useCases: [
      {
        title: "Keamanan Gedung Korporat & Hotel",
        desc: "Memantau akses pengunjung, lobi utama, area parkir, dan ruangan server secara otomatis 24 jam.",
      },
      {
        title: "Pabrik, Tambang & Konstruksi",
        desc: "Memastikan kepatuhan APD (Safety Helmet/Vest), deteksi bahaya perimeter, dan pencegahan sabotase aset.",
      },
      {
        title: "Komersial & Ritel Modern",
        desc: "Heatmap kepadatan pengunjung, analisis durasi belanja, dan pencegahan kehilangan inventaris barang.",
      },
    ],
    specs: [
      { label: "Resolusi Kamera", value: "4K UHD / 5MP Full Color Sensor" },
      { label: "Fitur AI", value: "Human/Vehicle Detection, Perimeter Guard" },
      { label: "Kompresi Video", value: "H.265+ (Hemat Penyimpanan 70%)" },
      { label: "Ketahanan Cuaca", value: "IP67 Weatherproof & Vandal Resistance" },
      { label: "Integrasi", value: "ONVIF & Third-party VMS Compatible" },
      { label: "Garansi Perangkat", value: "Garansi Resmi Part & On-Site Service" },
    ],
  },
  skystar: {
    title: "SkyStar Satellite VSAT Broadband",
    badge: "Solusi Terpencil & Wilayah 3T",
    description:
      "Konektivitas satelit broadband dua arah berkecepatan tinggi yang dirancang untuk menjangkau lokasi terluar, perkebunan, pertambangan pedalaman, dan operasional maritim yang belum terlayani kabel optik.",
    features: [
      "Cakupan Sinyal 100% Seluruh Nusantara (Ku-Band & C-Band High Throughput)",
      "Pemasangan Cepat (Rapid Deployment) di medan terisolir",
      "Tahan Kondisi Cuaca Tropis Ekstrem & Hujan Lebat",
      "Bandwidth Fleksibel: Kuota Terkelola atau Unlimited Dedicated Bandwidth",
      "Dukungan Integrasi VoIP Telepon Satelit & Backhaul BTS Seluler",
      "Monitoring Status Terminal Satelit 24/7 dari NOC",
    ],
    useCases: [
      {
        title: "Pertambangan & Energi Pedalaman",
        desc: "Komunikasi operasional alat berat, koordinasi camp karyawan, dan pengiriman data eksplorasi real-time.",
      },
      {
        title: "Perkebunan Sawit & Kehutanan",
        desc: "Menghubungkan pos perkebunan dan pabrik pengolahan kelapa sawit ke kantor pusat kota besar.",
      },
      {
        title: "Puskesmas & Sekolah Pedesaan",
        desc: "Mendukung program digitalisasi desa, telemedicine darurat, dan pembelajaran jarak jauh di pulau terluar.",
      },
    ],
    specs: [
      { label: "Frekuensi Satelit", value: "Ku-Band / C-Band High Throughput" },
      { label: "Diameter Antena", value: "1.2m - 1.8m Auto-Point / Fixed Dish" },
      { label: "Uptime Ketersediaan", value: "99.5% Link Availability" },
      { label: "Power Supply", value: "Kompatibel Genset & Solar Panel Surya" },
      { label: "Dukungan Layanan", value: "NOC Satelit 24/7 & Sparepart Ready" },
    ],
  },
  purchasing: {
    title: "Hardware Procurement & Networking Devices",
    badge: "Enterprise Official Hardware",
    description:
      "Penyediaan dan pengadaan perangkat keras infrastruktur TI resmi bergaransi untuk korporasi, meliputi server rackmount, switch core/distribution, enterprise router, firewall appliance, hingga access point industri.",
    features: [
      "Produk 100% Original dari Prinsipal Teknologi Terkemuka Dunia",
      "Dukungan Garansi Resmi Prinsipal & Kemudahan Klaim RMA",
      "Layanan Pra-Konfigurasi (Staging & Commissioning) sebelum dikirim",
      "Harga Korporasi Kompetitif dengan Skema Pembayaran Fleksibel (B2B)",
      "Konsultasi Pemilihan Sizing Spesifikasi sesuai kebutuhan arsitektur",
      "Ketersediaan Ready Stock untuk perangkat jaringan esensial",
    ],
    useCases: [
      {
        title: "Upgrade Data Center Korporat",
        desc: "Pengadaan server virtualisasi, switch spine-leaf 10G/40G, dan SAN storage berkinerja tinggi.",
      },
      {
        title: "Pembangunan Kantor Cabang Baru",
        desc: "Pengadaan paket lengkap: Router Gateway, Switch PoE, Access Point Wi-Fi 6, dan Rak Server.",
      },
    ],
    specs: [
      { label: "Kategori Produk", value: "Server, Switch, Router, Firewall, AP" },
      { label: "Garansi", value: "1 - 3 Tahun Garansi Resmi Prinsipal" },
      { label: "Layanan Tambahan", value: "Pre-configuration & Burn-in Test" },
      { label: "Pengiriman", value: "Ekspedisi Asuransi Seluruh Indonesia" },
    ],
  },
  "it-consulting": {
    title: "IT Consulting & Enterprise Architecture",
    badge: "Strategic Technology Advisory",
    description:
      "Layanan konsultasi strategis dan perencanaan transformasi digital yang membantu perusahaan merancang arsitektur jaringan yang aman, efisien, terukur (*scalable*), serta memitigasi risiko keamanan siber modern.",
    features: [
      "Audit & Asesmen Komprehensif Arsitektur Jaringan Eksisting",
      "Perancangan Desain Topologi Jaringan Enterprise Skalabilitas Tinggi",
      "Asesmen Kerentanan Keamanan Siber (Vulnerability Assessment & Pen-Test)",
      "Penyusunan Rencana Pemulihan Bencana (Disaster Recovery Plan / DRP)",
      "Optimasi Anggaran Belanja TI (Cost Optimization & TCO Analysis)",
      "Panduan Kepatuhan Regulasi Keamanan Data & Standar ISO/SNI",
    ],
    useCases: [
      {
        title: "Perusahaan Bertumbuh Pesat",
        desc: "Restrukturisasi arsitektur TI lama agar mampu mendukung lonjakan pengguna dan transaksi bisnis baru.",
      },
      {
        title: "Audit Keamanan Berkala",
        desc: "Menemukan celah keamanan sebelum dieksploitasi pihak luar dan mengamankan perimeter data penting.",
      },
    ],
    specs: [
      { label: "Format Output", value: "Laporan Asesmen, Blueprint & Roadmap TI" },
      { label: "Konsultan", value: "Certified Engineers (CCIE, CCNP, CISSP)" },
      { label: "Durasi Proyek", value: "Fleksibel (1 Bulan - Pendampingan Retainer)" },
    ],
  },
  "managed-service": {
    title: "Managed Service & 24/7 Network Operations",
    badge: "Proactive 24/7 IT Operation",
    description:
      "Pengelolaan dan pemeliharaan menyeluruh operasional jaringan TI perusahaan Anda oleh tim ahli Globallink secara proaktif, sehingga tim internal Anda dapat fokus sepenuhnya pada inovasi bisnis inti.",
    features: [
      "Pemantauan Proaktif 24/7/365 oleh Tim Network Operation Center (NOC)",
      "Deteksi Dini Insiden & Penanganan Cepat Sebelum Berdampak ke Bisnis",
      "Pemeliharaan Rutin (Preventive Maintenance) Fisik & Konfigurasi",
      "Manajemen Backup Konfigurasi dan Pembaruan Firmware Berkala",
      "Laporan Kinerja Bulanan Komprehensif (Traffic Analysis & Health Score)",
      "SLA Respon Insiden di Bawah 15 Menit",
    ],
    useCases: [
      {
        title: "Korporasi Tanpa Tim IT Khusus",
        desc: "Memiliki operasional jaringan sekelas korporasi multinasional tanpa biaya tinggi merekrut staf sendiri.",
      },
      {
        title: "Bisnis dengan Puluhan Cabang Tersebar",
        desc: "Standarisasi pengelolaan jaringan seluruh gerai/cabang di berbagai kota dengan satu SLA terpusat.",
      },
    ],
    specs: [
      { label: "Waktu Dukungan", value: "24 Jam x 7 Hari x 365 Hari Non-Stop" },
      { label: "Response Time SLA", value: "< 15 Menit untuk Tiket Kritis (P1)" },
      { label: "Metode Monitoring", value: "SNMP, Syslog & Real-time Flow Telemetry" },
      { label: "Pelaporan", value: "Executive Summary & Detail KPI Bulanan" },
    ],
  },
};

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "";

  const [service, setService] = useState<ServiceItemData | null>(null);
  const [allServices, setAllServices] = useState<ServiceItemData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [single, list] = await Promise.all([
          servicesApi.getBySlug(slug).catch(() => null),
          servicesApi.getAllPublic().catch(() => []),
        ]);
        if (single) {
          setService(single);
        }
        if (list && list.length > 0) {
          setAllServices(list);
        }
      } catch (err) {
        console.error("Error loading service:", err);
      } finally {
        setLoading(false);
      }
    };
    if (slug) {
      fetchData();
    }
  }, [slug]);

  const fallback = DEFAULT_FALLBACK_SERVICES[slug] || {
    title: service?.title || "Layanan Enterprise Globallink",
    badge: service?.badge || "Enterprise Solution",
    description:
      service?.description ||
      "Solusi jaringan dan infrastruktur digital berkualitas tinggi yang dirancang untuk mendukung kelangsungan bisnis Anda dengan keandalan maksimal.",
    features: [
      "Jaminan SLA Uptime 99.9%",
      "Dukungan Teknis NOC 24/7/365",
      "Perangkat Standar Enterprise",
      "Monitoring Kinerja Jaringan Real-Time",
    ],
    useCases: [
      {
        title: "Korporasi & Bisnis Enterprise",
        desc: "Dirancang khusus untuk kebutuhan konektivitas dan operasional tanpa jeda.",
      },
      {
        title: "Instansi Publik & Lembaga Pendidikan",
        desc: "Keandalan tinggi untuk ribuan pengguna dan sistem layanan terdistribusi.",
      },
    ],
    specs: [
      { label: "Ketersediaan Layanan", value: "SLA 99.9% High Availability" },
      { label: "Tim Dukungan", value: "NOC 24/7 Dedicated Support" },
      { label: "Jangkauan", value: "Skala Nasional Indonesia" },
    ],
  };

  const parsedFeatures: string[] = React.useMemo(() => {
    if (service?.features) {
      try {
        const arr = JSON.parse(service.features);
        if (Array.isArray(arr) && arr.length > 0) return arr;
      } catch {
        // use fallback
      }
    }
    return fallback.features;
  }, [service, fallback]);

  const displayTitle = service?.title || fallback.title;
  const displayBadge = service?.badge || fallback.badge;
  const displayDesc = service?.description || fallback.description;

  const showcaseImg =
    service?.imageUrl ||
    SERVICE_THEME_IMAGES[slug] ||
    "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1600&q=80";

  const relatedServices = allServices.filter((s) => s.slug !== slug);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-9 h-9 text-[#0066ff] animate-spin" />
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Memuat rincian layanan Globallink...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#070d19] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* ── Top Navigation & Breadcrumbs Bar ── */}
      <div className="pt-28 pb-4">
        <Container size="xl">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Beranda
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <Link href="/#layanan" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Layanan
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-none">
                {displayTitle}
              </span>
            </div>

            <Link
              href="/#layanan"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold shadow-2xs hover:shadow-xs transition-all duration-150"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Semua Layanan</span>
            </Link>
          </div>
        </Container>
      </div>

      {/* ── Immersive Split Hero Section (Hero + Showcase Visual Unified) ── */}
      <section className="relative pt-4 pb-16 overflow-hidden">
        {/* Glow ambient background effects */}
        <div className="absolute top-10 right-1/4 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-cyan-400/10 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <Container size="xl" className="relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Column (58%): Value Proposition & CTAs */}
            <div className="lg:col-span-7 space-y-6">

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-extrabold text-[#0a193b] dark:text-white tracking-tight leading-[1.14]">
                {displayTitle}
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal max-w-2xl">
                {displayDesc}
              </p>

              {/* Feature Chips */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>SLA Uptime 99.9%</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs">
                  <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>NOC Siaga 24/7/365</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-2xs">
                  <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Respon Cepat &lt; 15 Menit</span>
                </div>
              </div>

              {/* High-Converting CTA Actions */}
              <div className="flex flex-wrap items-center gap-3.5 pt-3">
                <a
                  href={`https://wa.me/6281188990000?text=${encodeURIComponent(
                    `Halo tim Globallink, saya ingin berdiskusi dan mengajukan penawaran untuk layanan ${displayTitle}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  <Phone className="w-4 h-4" />
                  <span>Konsultasi via WhatsApp</span>
                </a>

                <a
                  href="#spesifikasi"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 font-bold text-sm shadow-xs transition-all duration-200 hover:-translate-y-0.5"
                >
                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Spesifikasi & Proposal</span>
                </a>
              </div>
            </div>

            {/* Right Column (42%): The Visual Terminal Showcase Card */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative group rounded-3xl p-2.5 bg-gradient-to-b from-slate-200 via-slate-100 to-white dark:from-slate-700 dark:via-slate-800 dark:to-slate-900 shadow-2xl border border-slate-200/80 dark:border-slate-700/80"
              >
                {/* Visual Canvas Window */}
                <div className="relative h-[320px] sm:h-[380px] lg:h-[420px] w-full rounded-2xl overflow-hidden bg-slate-950">
                  <img
                    src={showcaseImg}
                    alt={displayTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent pointer-events-none" />

                  {/* Top Live Status Indicator */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold tracking-wide flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Live Infrastructure</span>
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-blue-600/90 text-white text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-sm">
                      {slug}
                    </span>
                  </div>

                  {/* Bottom Hardware Tagging */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 text-white space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200">{displayTitle}</span>
                      <span className="text-cyan-400 font-semibold text-[11px]">SLA 99.9%</span>
                    </div>
                    <p className="text-[11px] text-slate-300 line-clamp-1">
                      Infrastruktur berstandar enterprise dengan pemantauan proaktif NOC 24/7/365.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Key Performance Metrics Strip ── */}
      <section className="py-8 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800">
        <Container size="xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
            <div className="p-3 space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-cyan-400">99.9%</div>
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">Garansi SLA Ketersediaan</div>
            </div>
            <div className="p-3 space-y-1 pt-6 md:pt-3">
              <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-cyan-400">&lt; 15 Mnt</div>
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">Waktu Respon Cepat NOC</div>
            </div>
            <div className="p-3 space-y-1 pt-6 md:pt-3">
              <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-cyan-400">100% Simetris</div>
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">Kapasitas Dedicated B2B</div>
            </div>
            <div className="p-3 space-y-1 pt-6 md:pt-3">
              <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-cyan-400">24/7/365</div>
              <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">Dukungan Engineer On-Call</div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Features & Capabilities Grid ── */}
      <section className="py-20 bg-slate-50/70 dark:bg-[#070d19]">
        <Container size="xl">
          <div className="max-w-3xl mb-12 space-y-2">
            <span className="text-xs font-extrabold text-blue-600 dark:text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>KAPABILITAS & FITUR</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a193b] dark:text-white tracking-tight">
              Standar Keunggulan untuk Operasional Bisnis Anda
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Setiap komponen dirancang dengan keandalan maksimal untuk menjamin kelancaran bisnis tanpa henti.
            </p>
          </div>

          <div
            className={`grid gap-5 ${
              parsedFeatures.length === 4 || parsedFeatures.length <= 2
                ? "grid-cols-1 sm:grid-cols-2"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {parsedFeatures.map((feat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-200 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {feat}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Tersertifikasi standar operasional enterprise untuk memberikan kestabilan tinggi tanpa jeda.
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                  <span>Garansi Kualitas Globallink</span>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Technical Specifications Table & Industry Use Cases ── */}
      <section id="spesifikasi" className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
        <Container size="xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left: Use Cases (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-blue-600 dark:text-cyan-400 uppercase tracking-widest">
                  IMPLEMENTASI NYATA
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0a193b] dark:text-white tracking-tight">
                  Dirancang Khusus untuk Berbagai Sektor Industri
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Solusi fleksibel yang terbukti andal dalam mendukung operasional lintas industri di seluruh nusantara.
                </p>
              </div>

              <div className="space-y-4">
                {fallback.useCases.map((uc, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 transition-colors duration-200 space-y-2.5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                        0{i + 1}
                      </div>
                      <h4 className="text-base font-bold text-[#0a193b] dark:text-white">
                        {uc.title}
                      </h4>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-10">
                      {uc.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Technical Specs Card (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-7 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-2xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <Server className="w-5 h-5 text-cyan-400" />
                    <h4 className="text-base font-bold tracking-tight">
                      Spesifikasi & SLA Layanan
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-3 py-1 rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Active SLA</span>
                  </span>
                </div>

                <div className="space-y-3.5 text-xs">
                  {fallback.specs.map((sp, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-4 py-2 border-b border-slate-800/80"
                    >
                      <span className="text-slate-400 font-medium">{sp.label}</span>
                      <span className="text-white font-bold text-right">{sp.value}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <a
                    href={`https://wa.me/6281188990000?text=${encodeURIComponent(
                      `Halo tim Globallink, saya ingin meminta dokumen proposal teknis dan pricing untuk layanan ${displayTitle}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span>Minta Dokumen Proposal & Pricing</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* NOC Support Box */}
              <div className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Headphones className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h5 className="text-sm font-bold text-[#0a193b] dark:text-white">
                    Network Operation Center 24/7/365
                  </h5>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Setiap pelanggan bisnis mendapatkan akses langsung ke tim engineer NOC siaga tanpa antrean berbelit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Implementation Roadmap (Cara Kerja / 3-Step Process) ── */}
      <section className="py-20 bg-slate-50/70 dark:bg-[#070d19] border-t border-slate-200/80 dark:border-slate-800">
        <Container size="xl">
          <div className="max-w-3xl mx-auto text-center mb-14 space-y-2">
            <span className="text-xs font-extrabold text-blue-600 dark:text-cyan-400 uppercase tracking-widest">
              PROSES INTEGRASI
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0a193b] dark:text-white tracking-tight">
              Tahapan Mudah Implementasi Bersama Globallink
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Alur kerja terstruktur untuk memastikan instalasi dan migrasi berjalan mulus tanpa downtime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-md">
                1
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Analisis Kebutuhan & Survey
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Tim teknis melakukan analisis topologi dan survey on-site untuk merancang arsitektur yang paling optimal.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-sm shadow-md">
                2
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Instalasi & Pengujian SLA
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Pemasangan perangkat enterprise resmi dan uji transmisi menyeluruh hingga seluruh parameter SLA terpenuhi.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-sm shadow-md">
                3
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                Go-Live & NOC Monitoring 24/7
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Layanan aktif dan langsung dipantau secara real-time oleh tim NOC Globallink dengan jaminan respon cepat.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Related Services ── */}
      {relatedServices.length > 0 && (
        <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
          <Container size="xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#0a193b] dark:text-white tracking-tight">
                  Layanan Terintegrasi Lainnya
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Eksplorasi ekosistem solusi teknologi dan infrastruktur lengkap dari Globallink.
                </p>
              </div>

              <Link
                href="/#layanan"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline self-start sm:self-auto"
              >
                <span>Lihat Semua Layanan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedServices.slice(0, 3).map((rs) => (
                <Link
                  key={rs.id}
                  href={`/services/${rs.slug}`}
                  className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 shadow-2xs hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-1 rounded-md">
                      {rs.badge || "Enterprise"}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {rs.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {rs.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-cyan-400">
                    <span>Pelajari Selengkapnya</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* ── Bottom Dedicated Consultation Banner ── */}
      <section className="py-20 bg-gradient-to-r from-blue-700 via-[#0055d4] to-[#0a193b] text-white">
        <Container size="xl">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Ingin Menerapkan Solusi {displayTitle} di Perusahaan Anda?
            </h3>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed font-normal">
              Diskusikan kebutuhan kapasitas, rute fiber optic, penempatan kamera smart CCTV, atau lokasi satelit Anda bersama tim arsitek jaringan Globallink.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href={`https://wa.me/6281188990000?text=${encodeURIComponent(
                  `Halo, saya ingin jadwal konsultasi teknis terkait layanan ${displayTitle}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-white hover:bg-slate-100 text-[#0055d4] font-bold text-sm shadow-xl hover:-translate-y-0.5 transition-all"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Jadwalkan Konsultasi Gratis</span>
              </a>

              <Link
                href="/#kontak"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-sm backdrop-blur-md transition-all hover:-translate-y-0.5"
              >
                <span>Isi Formulir Kontak</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
