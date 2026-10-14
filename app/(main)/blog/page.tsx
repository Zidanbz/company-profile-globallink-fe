import React from "react";
import { Metadata } from "next";
import { Container } from "@/components/base/Container";
import { BlogList } from "@/components/blog/BlogList";

export const metadata: Metadata = {
  title: "Blog & Aktivitas | Globallink — Smart IT Solution",
  description:
    "Wawasan, berita teknologi, dan perkembangan infrastruktur jaringan terkini dari Globallink.",
};

export default function BlogPage() {
  return (
    <div className="pt-32 pb-24 bg-white dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Container size="xl" className="space-y-12">
        {/* Header */}
        <div className="max-w-2xl text-left space-y-4">
          <span className="text-xs font-bold tracking-widest text-brand-600 dark:text-brand-400 uppercase block">
            BLOG & AKTIVITAS
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Wawasan & Kabar Terbaru
          </h1>
          <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Ikuti informasi terkini mengenai perkembangan infrastruktur digital nusantara,
            tips keamanan siber, dan update teknologi dari Globallink.
          </p>
        </div>

        {/* Blog Interactive List */}
        <BlogList />
      </Container>
    </div>
  );
}
