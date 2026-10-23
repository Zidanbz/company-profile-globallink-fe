"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "../base/Container";
import { Post } from "@/types";
import { postsApi } from "@/lib/api/posts";
import { 
  ArrowRight, 
  Calendar, 
  Clock, 
  Sparkles, 
  Layers, 
  Radio, 
  Cpu, 
  Eye,
  TrendingUp,
  Tag
} from "lucide-react";
import { motion } from "framer-motion";

interface BlogCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const BLOG_CATEGORIES: BlogCategory[] = [
  { id: "all", label: "Semua Berita", icon: <Layers className="w-3.5 h-3.5" /> },
  { id: "fiber", label: "Infrastruktur FO", icon: <Radio className="w-3.5 h-3.5" /> },
  { id: "project", label: "Proyek Lapangan", icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { id: "smart", label: "Smart Solutions", icon: <Cpu className="w-3.5 h-3.5" /> },
];

const FALLBACK_BLOGS = [
  {
    id: 1,
    title: "Ekspansi Jaringan Fiber Optic untuk Mendukung Kawasan Industri Nasional",
    slug: "ekspansi-fiber-optic-industri",
    excerpt: "Peningkatan kapasitas backbone FO berskala nasional guna mempercepat koneksi operasional dan transmisi data enterprise 24/7 di kawasan industri strategis.",
    content: "",
    thumbnailUrl: "/images/blog-fiber-optic.jpg",
    status: "PUBLISHED" as const,
    publishedAt: "2026-09-20T00:00:00Z",
    createdAt: "2026-09-20T00:00:00Z",
    updatedAt: "2026-09-20T00:00:00Z",
    category: "fiber",
    readTime: "4 Menit Baca",
    tagLabel: "Fiber Optic",
  },
  {
    id: 2,
    title: "Deploy Satelit VSAT SkyStar di Wilayah Kepulauan Terpencil 3T",
    slug: "deploy-vsat-skystar-3t",
    excerpt: "Distribusi koneksi broadband satelit Globallink area terpencil memfasilitasi kebutuhan telekomunikasi maritim dan pemerataan digital nusantara.",
    content: "",
    thumbnailUrl: "/images/blog-vsat-satellite.jpg",
    status: "PUBLISHED" as const,
    publishedAt: "2026-09-18T00:00:00Z",
    createdAt: "2026-09-18T00:00:00Z",
    updatedAt: "2026-09-18T00:00:00Z",
    category: "project",
    readTime: "3 Menit Baca",
    tagLabel: "Satelit VSAT",
  },
  {
    id: 3,
    title: "Penerapan Smart CCTV & AI Analytics untuk Efisiensi Pengawasan Korporasi",
    slug: "smart-cctv-ai-analytics",
    excerpt: "Integrasi sistem pengawasan cerdas berbasis AI untuk kontrol operasional, identifikasi otomatis, dan visual monitoring terpusat real-time.",
    content: "",
    thumbnailUrl: "/images/blog-smart-cctv.jpg",
    status: "PUBLISHED" as const,
    publishedAt: "2026-09-15T00:00:00Z",
    createdAt: "2026-09-15T00:00:00Z",
    updatedAt: "2026-09-15T00:00:00Z",
    category: "smart",
    readTime: "5 Menit Baca",
    tagLabel: "Smart AI CCTV",
  },
];

export const BlogSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [posts, setPosts] = useState<any[]>(FALLBACK_BLOGS);

  useEffect(() => {
    postsApi
      .getPublicPosts({ limit: 6, sortBy: "publishedAt", sortOrder: "desc" })
      .then((res) => {
        if (res.posts && res.posts.length > 0) {
          // Merge API posts with fallback images for rich display
          const mapped = res.posts.map((p: any, idx) => ({
            ...p,
            category: p.category || (idx % 3 === 0 ? "fiber" : idx % 3 === 1 ? "smart" : "project"),
            thumbnailUrl: p.thumbnailUrl || FALLBACK_BLOGS[idx % FALLBACK_BLOGS.length].thumbnailUrl,
            readTime: "4 Menit Baca",
            tagLabel: p.category === "fiber" ? "Fiber Optic" : p.category === "smart" ? "Smart Solutions" : "Proyek Lapangan",
          }));
          setPosts(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const filteredPosts = activeCategory === "all" 
    ? posts 
    : posts.filter((p: any) => p.category === activeCategory);

  const featuredPost = filteredPosts[0] || posts[0];
  const gridPosts = filteredPosts.length > 1 ? filteredPosts.slice(1, 4) : posts.slice(1, 4);

  return (
    <section id="blog" className="pt-16 sm:pt-20 pb-16 sm:pb-20 bg-white dark:bg-slate-950 relative overflow-hidden scroll-mt-24 sm:scroll-mt-28 transition-colors duration-200">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -right-48 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -left-48 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <Container size="xl" className="relative z-10">
        
        {/* Section Header with Staggered Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-12 space-y-4"
        >
          <p className="text-[11px] font-bold tracking-[0.2em] text-[#0055d4] dark:text-blue-400 uppercase">
            Wawasan & Berita Terbaru
          </p>

          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0a193b] dark:text-white leading-[1.15] tracking-tight">
            Kabar Terkini & <br />
            <span className="bg-gradient-to-r from-[#0055d4] via-blue-600 to-indigo-600 dark:from-blue-400 dark:via-indigo-300 dark:to-white bg-clip-text text-transparent">
              Aktivitas Globallink
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
            Ikuti perkembangan instalasi jaringan, peluncuran teknologi mutakhir, serta dokumentasi proyek strategis kami di seluruh nusantara.
          </p>
        </motion.div>

        {/* Filter Category Tabs with Smooth Interactive Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-2.5 mb-12"
        >
          {BLOG_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#0055d4] text-white shadow-lg shadow-blue-500/25 scale-105"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-slate-800 hover:text-[#0055d4] dark:hover:text-blue-400"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Featured Big Bento Card */}
        {featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="mb-12"
          >
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="group relative grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white/95 dark:bg-slate-900/90 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-7 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 overflow-hidden block"
            >
              {/* Image Box */}
              <div className="lg:col-span-7 relative rounded-2xl overflow-hidden aspect-[16/10] bg-slate-900 shadow-md">
                <img
                  src={featuredPost.thumbnailUrl || "/images/blog-fiber-optic.jpg"}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                
                {/* Subtle gradient sheen */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a193b]/60 via-transparent to-transparent opacity-80" />

                {/* Floating Tag over Image */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-full bg-[#0055d4] text-white text-[11px] font-bold tracking-wider uppercase shadow-md backdrop-blur-sm flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    <span>Utama</span>
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-white/90 dark:bg-slate-800 text-[#0a193b] dark:text-slate-200 text-[11px] font-bold shadow-md backdrop-blur-sm">
                    {featuredPost.tagLabel || "Infrastruktur FO"}
                  </span>
                </div>
              </div>

              {/* Text & Meta Content */}
              <div className="lg:col-span-5 flex flex-col justify-between py-2 space-y-5 text-left">
                <div className="space-y-4">
                  {/* Meta date & read time */}
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5 text-[#0055d4] dark:text-blue-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(featuredPost.publishedAt || Date.now()).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
                    </div>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                    <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{featuredPost.readTime || "4 Menit Baca"}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0a193b] dark:text-white leading-[1.25] tracking-tight group-hover:text-[#0055d4] dark:group-hover:text-blue-400 transition-colors duration-200">
                    {featuredPost.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-sm sm:text-[15px] text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                    {featuredPost.excerpt}
                  </p>
                </div>

                {/* Action CTA */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-xs font-bold text-[#0055d4] dark:text-blue-400 group-hover:gap-3 transition-all duration-200">
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                  <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-slate-800 text-[#0055d4] dark:text-blue-400 flex items-center justify-center group-hover:bg-[#0055d4] group-hover:text-white transition-all duration-200">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* 3 Grid Articles with Staggered Entrance */}
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {gridPosts.map((post, idx) => (
            <motion.div
              key={post.id || idx}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
              }}
              whileHover={{ y: -5, transition: { duration: 0.25, ease: "easeOut" } }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group bg-white/95 dark:bg-slate-900/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 flex flex-col justify-between h-full"
              >
                <div>
                  {/* Thumbnail Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                    <img
                      src={post.thumbnailUrl || "/images/blog-fiber-optic.jpg"}
                      alt={post.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a193b]/40 via-transparent to-transparent opacity-60" />

                    {/* Category Pill Tag */}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-white/95 dark:bg-slate-800 backdrop-blur-md text-[10px] font-bold text-[#0a193b] dark:text-slate-200 shadow-sm">
                        {post.tagLabel || (idx === 0 ? "Satelit VSAT" : idx === 1 ? "Smart AI CCTV" : "Infrastruktur")}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 text-left space-y-3">
                    {/* Date & Read time */}
                    <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(post.publishedAt || Date.now()).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                      <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                      <span>{post.readTime || "3 Menit"}</span>
                    </div>

                    {/* Title */}
                    <h4 className="text-base sm:text-lg font-bold text-[#0a193b] dark:text-white leading-snug group-hover:text-[#0055d4] dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2">
                      {post.title}
                    </h4>

                    {/* Excerpt */}
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-6 pb-6 pt-2 border-t border-slate-100/80 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-[#0055d4] dark:text-blue-400">
                  <span>Baca Artikel</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Blog Posts CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 text-center"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#0a193b] dark:bg-blue-600 hover:bg-[#0055d4] dark:hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group"
          >
            <span>Jelajahi Semua Berita & Dokumentasi</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>

      </Container>
    </section>
  );
};
