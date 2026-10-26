"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Briefcase,
  Building2,
  FileText,
  Mail,
  Settings,
  LogOut,
  Globe,
  Award,
  MapPin,
  PanelBottom,
  BarChart3,
} from "lucide-react";
import { authApi } from "@/lib/api/auth";
import { contactApi } from "@/lib/api/contact";
import { cn } from "@/lib/utils/cn";

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await contactApi.getUnreadCount();
        if (res && typeof res.unreadCount === "number") {
          setUnreadCount(res.unreadCount);
        }
      } catch (err) {
        // silent fallback
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, []);

  const menuUtama = [
    { label: "Beranda", href: "/admin", icon: Home, exact: true },
    { label: "Layanan", href: "/admin/services", icon: Briefcase },
    { label: "Titik Peta", href: "/admin/map", icon: MapPin },
    { label: "Mitra & Client", href: "/admin/partners", icon: Award },
    { label: "Tentang Kami", href: "/admin/about", icon: Building2 },
    { label: "Blog", href: "/admin/posts", icon: FileText },
    {
      label: "Kontak",
      href: "/admin/contact",
      icon: Mail,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { label: "Footer", href: "/admin/footer", icon: PanelBottom },
    { label: "Analitik", href: "/admin/analytics", icon: BarChart3 },
  ];

  const menuSistem = [
    { label: "Pengaturan", href: "/admin/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    if (confirm("Apakah Anda yakin ingin keluar dari Admin Panel?")) {
      try {
        await authApi.logout();
      } catch (err) {
        console.warn("Logout error:", err);
      } finally {
        router.push("/admin/login");
      }
    }
  };

  const isItemActive = (href: string, exact: boolean = false) => {
    if (exact || href === "/admin") {
      return pathname === "/admin" || pathname === "/admin/beranda";
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 min-h-screen flex flex-col justify-between p-5 z-20 shrink-0 select-none transition-colors duration-200">
      <div>
        {/* Brand Logo */}
        <div className="px-2 py-3 mb-6">
          <Link href="/admin" className="inline-block">
            <img
              src="/images/logo-globallink-blue.png"
              alt="Globallink Smart IT Solution"
              className="h-9 w-auto object-contain dark:hidden"
            />
            <img
              src="/images/logo-globallink-white.png"
              alt="Globallink Smart IT Solution"
              className="h-9 w-auto object-contain hidden dark:block"
            />
          </Link>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-6">
          {/* MENU UTAMA */}
          <div>
            <p className="px-3 text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase mb-2">
              MENU UTAMA
            </p>
            <nav className="space-y-1">
              {menuUtama.map((item) => {
                const Icon = item.icon;
                const active = isItemActive(item.href, item.exact);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150",
                      active
                        ? "bg-[#dbeafe] dark:bg-blue-950/70 text-[#1d4ed8] dark:text-blue-400 shadow-xs"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          "w-4 h-4",
                          active ? "text-[#1d4ed8] dark:text-blue-400" : "text-slate-500 dark:text-slate-400"
                        )}
                      />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-red-500 text-white animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* SISTEM */}
          <div>
            <p className="px-3 text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase mb-2">
              SISTEM
            </p>
            <nav className="space-y-1">
              {menuSistem.map((item) => {
                const Icon = item.icon;
                const active = pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150",
                      active
                        ? "bg-[#dbeafe] dark:bg-blue-950/70 text-[#1d4ed8] dark:text-blue-400 shadow-xs"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4",
                        active ? "text-[#1d4ed8] dark:text-blue-400" : "text-slate-500 dark:text-slate-400"
                      )}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-150 text-left"
              >
                <LogOut className="w-4 h-4 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400" />
                <span>Keluar</span>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Footer Branding & Public Site link */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Lihat Website Publik ↗</span>
        </Link>
        <p className="px-3 text-[11px] text-slate-400 dark:text-slate-500 font-medium">
          Globallink Smart IT Solution © 2026
        </p>
      </div>
    </aside>
  );
};
