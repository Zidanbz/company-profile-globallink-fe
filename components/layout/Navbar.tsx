"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { motion, AnimatePresence } from "framer-motion";

import { ThemeToggle } from "@/components/theme/ThemeToggle";

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("beranda");
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const pathname = usePathname();

  // Scrollspy & scroll state detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);

      if (pathname === "/") {
        const sections = [
          { id: "beranda", offset: 0 },
          { id: "layanan", el: document.getElementById("layanan") },
          { id: "tentang-kami", el: document.getElementById("tentang-kami") },
          { id: "value-added", el: document.getElementById("value-added") },
          { id: "blog", el: document.getElementById("blog") },
          { id: "kontak", el: document.getElementById("kontak") },
        ];

        const scrollPosition = window.scrollY + 200;

        let currentSection = "beranda";
        for (const section of sections) {
          if (section.id === "beranda") {
            currentSection = "beranda";
          } else if (section.el) {
            const top = section.el.offsetTop;
            if (scrollPosition >= top) {
              currentSection = section.id;
            }
          }
        }
        setActiveSection(currentSection);
      }
    };

    if (pathname.startsWith("/blog")) {
      setActiveSection("blog");
    } else if (pathname === "/") {
      handleScroll();
    } else {
      setActiveSection("");
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const navLinks = [
    { label: "Beranda", id: "beranda", href: "/#beranda" },
    { label: "Layanan", id: "layanan", href: "/#layanan" },
    { label: "Tentang Kami", id: "tentang-kami", href: "/#tentang-kami" },
    { label: "Blog", id: "blog", href: "/blog" },
    { label: "Kontak", id: "kontak", href: "/#kontak" },
  ];

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    id: string
  ) => {
    if (pathname === "/" && href.startsWith("/#")) {
      e.preventDefault();
      const targetEl = document.getElementById(id);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth" });
        setActiveSection(id);
        window.history.pushState(null, "", `#${id}`);
      }
    }
  };

  return (
    <>
      {/* ── Dimmed Backdrop for Mobile Menu ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <header className="fixed top-0 inset-x-0 z-50 px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4 pointer-events-none">
        <div
          className={cn(
            "max-w-6xl mx-auto transition-all duration-300 pointer-events-auto",
            mobileMenuOpen
              ? "rounded-3xl bg-white/98 dark:bg-slate-950/98 backdrop-blur-2xl border border-slate-200/90 dark:border-slate-800 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] py-3.5 px-5 sm:px-7"
              : isScrolled
              ? "rounded-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border border-white/80 dark:border-slate-800/80 shadow-[0_12px_35px_-6px_rgba(0,85,212,0.12),0_4px_12px_rgba(0,0,0,0.04)] py-2.5 px-4 sm:px-6"
              : "rounded-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border border-white/50 dark:border-slate-800/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] py-3 px-5 sm:px-7"
          )}
        >
          <div className="flex items-center justify-between">
            
            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-2 group shrink-0 py-0.5">
              <img
                src="/images/logo-globallink-blue.png"
                alt="Globallink"
                className="h-6 sm:h-7 md:h-[30px] w-auto object-contain transition-transform duration-200 group-hover:scale-105 dark:hidden"
              />
              <img
                src="/images/logo-globallink-white.png"
                alt="Globallink"
                className="h-6 sm:h-7 md:h-[30px] w-auto object-contain transition-transform duration-200 group-hover:scale-105 hidden dark:block"
              />
            </Link>

            {/* ── Center Nav Links with Floating Sliding Highlight ── */}
            <nav
              onMouseLeave={() => setHoveredLink(null)}
              className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-slate-100/70 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm"
            >
              {navLinks.map((link) => {
                const isActive =
                  (pathname === "/" && activeSection === link.id) ||
                  (pathname.startsWith("/blog") && link.id === "blog");
                const isHovered = hoveredLink === link.id;

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onMouseEnter={() => setHoveredLink(link.id)}
                    onClick={(e) => handleNavClick(e, link.href, link.id)}
                    className={cn(
                      "relative px-4 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 select-none",
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                    )}
                  >
                    {/* Sliding active pill indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-active-pill"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        className="absolute inset-0 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-slate-200/60 dark:border-slate-700/60 z-0"
                      />
                    )}

                    {/* Hover background effect */}
                    {!isActive && isHovered && (
                      <motion.div
                        layoutId="navbar-hover-pill"
                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                        className="absolute inset-0 rounded-full bg-white/70 dark:bg-slate-700/50 z-0"
                      />
                    )}

                    <span className="relative z-10">{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* ── Right Actions: Dark/Light Mode Switch + Mobile Toggle ── */}
            <div className="flex items-center gap-2">
              <ThemeToggle />

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-full bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-colors"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* ── Mobile Dropdown Menu ── */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="md:hidden mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-1 overflow-hidden"
              >
                {navLinks.map((link) => {
                  const isActive =
                    (pathname === "/" && activeSection === link.id) ||
                    (pathname.startsWith("/blog") && link.id === "blog");

                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={(e) => {
                        handleNavClick(e, link.href, link.id);
                        setMobileMenuOpen(false);
                      }}
                      className={cn(
                        "text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-between",
                        isActive
                          ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/70"
                      )}
                    >
                      <span>{link.label}</span>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
                      )}
                    </Link>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </>
  );
};
