"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Bell } from "lucide-react";
import { contactApi } from "@/lib/api/contact";
import { User } from "@/types";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export const AdminHeader: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    // Format Indonesian date
    try {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      };
      const formatted = new Intl.DateTimeFormat("id-ID", options).format(now);
      setFormattedDate(formatted);
    } catch (e) {
      setFormattedDate("Kamis, 24 September 2026");
    }

    const raw = localStorage.getItem("globallink_user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch (e) {
        // fallback
      }
    }

    // Fetch unread count for bell
    const fetchCount = async () => {
      try {
        const res = await contactApi.getUnreadCount();
        if (res && typeof res.unreadCount === "number") {
          setUnreadCount(res.unreadCount);
        }
      } catch (err) {
        // silent
      }
    };
    fetchCount();
  }, []);

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10 transition-colors duration-200">
      {/* Date Display */}
      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm font-medium">
        <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" />
        <span>{formattedDate || "Kamis, 24 September 2026"}</span>
      </div>

      {/* Right Controls: ThemeToggle, Notifications & User */}
      <div className="flex items-center gap-4 sm:gap-5">
        {/* Theme Switcher Button */}
        <ThemeToggle />

        {/* Notification Bell */}
        <Link
          href="/admin/contact"
          className="relative p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          title="Lihat pesan masuk"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute 0 top-0.5 right-0.5 min-w-[18px] h-[18px] px-1 bg-[#ef4444] text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Link>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-9 h-9 rounded-full bg-[#0066ff] text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-sm">
            GL
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
              Admin Utama
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
              {user?.email || "admin@globallink.id"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
