"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Container } from "../base/Container";
import { MapLocation, MapLocationCategory } from "@/types";
import { mapApi } from "@/lib/api/map";
import { 
  Sparkles, 
  MapPin, 
  Radio, 
  Database, 
  Wifi, 
  Satellite, 
  Building2, 
  Navigation2,
  CheckCircle2,
  Layers,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";

// Dynamic import Leaflet with SSR false
const LeafletMap = dynamic(() => import("../map/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[540px] rounded-3xl bg-slate-900/90 flex flex-col items-center justify-center text-white">
      <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin mb-3" />
      <span className="text-sm font-semibold tracking-wide text-cyan-400">
        Menyiapkan Peta Jaringan Interaktif...
      </span>
    </div>
  ),
});

// Rich Default Locations across Indonesia
const DEFAULT_LOCATIONS: MapLocation[] = [
  {
    id: 1,
    name: "Head Office & 24/7 Primary NOC Jakarta",
    category: "OFFICE" as MapLocationCategory,
    latitude: -6.2088,
    longitude: 106.8456,
    description: "Pusat komando jaringan terpadu, monitoring traffic real-time, dan kantor operasional utama.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Tier-3 Cyber Data Center Interconnection",
    category: "DATA_CENTER" as MapLocationCategory,
    latitude: -6.2297,
    longitude: 106.8295,
    description: "Pusat interkoneksi backbone utama ke OpenIXP, IIX, dan global Tier-1 cloud exchanges.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Submarine Cable Landing Station Batam",
    category: "FIBER_OPTIC" as MapLocationCategory,
    latitude: 1.1301,
    longitude: 104.0529,
    description: "Gerbang kabel optik bawah laut internasional menghubungkan backbone Indonesia dengan rute global.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: "POP Regional Surabaya Gubeng",
    category: "POP" as MapLocationCategory,
    latitude: -7.2654,
    longitude: 112.7521,
    description: "Hub distribusi bandwidth transmisi serat optik Jawa Timur dan gateway jalur laut timur.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 5,
    name: "POP Bandung Dago Metro FO",
    category: "POP" as MapLocationCategory,
    latitude: -6.9039,
    longitude: 107.6186,
    description: "Ring jaringan metro fiber optic berkapasitas tinggi untuk korporasi dan riset teknologi.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 6,
    name: "POP Medan Petisah & Sumatera Node",
    category: "POP" as MapLocationCategory,
    latitude: 3.5952,
    longitude: 98.6722,
    description: "Sentra jaringan serat optik Sumatera bagian utara dan interkoneksi kawasan industri.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 7,
    name: "Regional NOC & POP Hub Makassar",
    category: "OFFICE" as MapLocationCategory,
    latitude: -5.1477,
    longitude: 119.4327,
    description: "Pusat transmisi data backbone untuk kepulauan Sulawesi, Maluku, dan Indonesia Timur.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 8,
    name: "POP Denpasar Bali High-Speed Node",
    category: "POP" as MapLocationCategory,
    latitude: -8.6705,
    longitude: 115.2126,
    description: "Layanan konektivitas hospitality enterprise, perbankan, dan bisnis internasional Bali & NTB.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 9,
    name: "POP Balikpapan & IKN Nusantara Gateway",
    category: "FIBER_OPTIC" as MapLocationCategory,
    latitude: -1.2654,
    longitude: 116.8312,
    description: "Infrastruktur serat optik redundant mendukung operasional industri energi dan kawasan IKN.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 10,
    name: "SkyNet VSAT Hub Kepulauan Natuna",
    category: "COVERAGE" as MapLocationCategory,
    latitude: 3.9456,
    longitude: 108.1428,
    description: "Stasiun bumi satelit broadband menghubungkan pos perbatasan dan industri maritim 3T.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 11,
    name: "POP Manado & Pasifik Fiber Route",
    category: "POP" as MapLocationCategory,
    latitude: 1.4748,
    longitude: 124.8428,
    description: "Gerbang kabel laut rute Pasifik utara dan interkoneksi Sulawesi Utara.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 12,
    name: "SkyNet VSAT Hub Raja Ampat Papua",
    category: "COVERAGE" as MapLocationCategory,
    latitude: -0.5897,
    longitude: 130.6521,
    description: "Konektivitas satelit broadband menjangkau area kepulauan terpencil dan kawasan konservasi.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 13,
    name: "POP Jayapura & Papua Backbone Terminal",
    category: "POP" as MapLocationCategory,
    latitude: -2.5337,
    longitude: 140.7181,
    description: "Terminasi jaringan kabel optik Palapa Ring Timur melayani instansi dan korporasi Papua.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const CATEGORY_TABS = [
  { id: "ALL", label: "Semua Titik", icon: <Layers className="w-3.5 h-3.5" /> },
  { id: "FIBER_OPTIC", label: "Fiber Optic", icon: <Wifi className="w-3.5 h-3.5" /> },
  { id: "DATA_CENTER", label: "Data Center", icon: <Database className="w-3.5 h-3.5" /> },
  { id: "POP", label: "Point of Presence (POP)", icon: <Radio className="w-3.5 h-3.5" /> },
  { id: "COVERAGE", label: "SkyNet VSAT 3T", icon: <Satellite className="w-3.5 h-3.5" /> },
  { id: "OFFICE", label: "NOC & Kantor", icon: <Building2 className="w-3.5 h-3.5" /> },
];

export const MapSection: React.FC = () => {
  const [locations, setLocations] = useState<MapLocation[]>(DEFAULT_LOCATIONS);
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [activeLocation, setActiveLocation] = useState<MapLocation | null>(null);

  useEffect(() => {
    mapApi
      .getPublicLocations()
      .then((data) => {
        if (data && data.length > 0) {
          setLocations(data);
        }
      })
      .catch(() => {});
  }, []);

  // Quick navigation cities
  const quickCities = [
    { name: "Jakarta (Pusat NOC)", id: 1 },
    { name: "Surabaya (Jawa Timur)", id: 4 },
    { name: "Makassar (Regional Hub)", id: 7 },
    { name: "Batam (Kabel Laut)", id: 3 },
    { name: "Bali (Denpasar Node)", id: 8 },
    { name: "Balikpapan (IKN Gateway)", id: 9 },
    { name: "Jayapura (Papua Backbone)", id: 13 },
  ];

  return (
    <section id="infrastruktur" className="pt-24 pb-32 bg-white dark:bg-slate-950 relative overflow-hidden scroll-mt-24 sm:scroll-mt-28 transition-colors duration-200">
      {/* Ambient background decoration */}
      <div className="absolute top-1/4 -right-48 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -left-48 w-96 h-96 bg-cyan-400/10 dark:bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <Container size="xl" className="relative z-10">
        
        {/* Section Header with Staggered Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl space-y-4 text-left mb-10"
        >
          <p className="text-[11px] font-bold tracking-[0.2em] text-[#0055d4] dark:text-blue-400 uppercase">
            Peta Sebaran Jaringan & Infrastruktur Nasional
          </p>

          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0a193b] dark:text-white leading-[1.25] sm:leading-[1.28] lg:leading-[1.3] tracking-tight">
            Jaringan yang <br className="hidden sm:inline" />
            <span className="inline-block mt-1 sm:mt-1.5 bg-gradient-to-r from-[#0055d4] via-blue-600 to-indigo-600 dark:from-blue-400 dark:via-indigo-300 dark:to-white bg-clip-text text-transparent">
              Menyatukan Seluruh Indonesia.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-normal max-w-2xl">
            Eksplorasi titik-titik Point of Presence (POP), stasiun kabel optik bawah laut, Tier-3 data center, dan stasiun bumi satelit VSAT kami yang aktif melayani kebutuhan digital nusantara.
          </p>
        </motion.div>

        {/* Category Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="flex flex-wrap items-center gap-2 mb-6"
        >
          {CATEGORY_TABS.map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(tab.id);
                  setActiveLocation(null);
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#0055d4] text-white shadow-md shadow-blue-500/25 scale-105"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-slate-800 hover:text-[#0055d4] dark:hover:text-blue-400"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Map Container & Quick City Navigator */}
        <div className="space-y-4">
          <div className="relative">
            {/* Live Leaflet Map Component */}
            <LeafletMap
              locations={locations}
              selectedCategory={selectedCategory}
              activeLocation={activeLocation}
            />

            {/* Floating Quick City Locator on Bottom of Map */}
            <div className="absolute bottom-4 left-4 right-4 z-[400] flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-x-auto">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 shrink-0 mr-2">
                <Navigation2 className="w-3.5 h-3.5 text-[#0055d4] dark:text-blue-400" />
                <span>Pilih Kota Cepat:</span>
              </div>
              {quickCities.map((city) => {
                const target = locations.find((l) => l.id === city.id) || locations[0];
                const isSelected = activeLocation?.id === target.id;
                return (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => {
                      setActiveLocation(target);
                      setSelectedCategory("ALL");
                    }}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all shrink-0 cursor-pointer ${
                      isSelected
                        ? "bg-[#0055d4] text-white shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-[#0055d4] dark:hover:text-blue-400 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {city.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </Container>
    </section>
  );
};
