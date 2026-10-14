"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Users,
  Eye,
  Clock,
  TrendingUp,
  Smartphone,
  Laptop,
  Tablet,
  Globe,
  Compass,
  ArrowUpRight,
  Loader2,
  Calendar,
  Activity,
  RefreshCw,
  Share2,
} from "lucide-react";
import { analyticsApi, AnalyticsStatsResponse } from "@/lib/api/analytics";

function formatSeconds(secs: number): string {
  if (secs < 60) return `${secs} detik`;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}m ${s}s`;
}

function timeAgo(dateStr: string): string {
  const d = new Date(dateStr);
  const diffSec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (diffSec < 60) return "Baru saja";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} mnt lalu`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} jam lalu`;
  return `${Math.floor(diffSec / 86400)} hari lalu`;
}

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<"today" | "7d" | "30d">("7d");
  const [data, setData] = useState<AnalyticsStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  const loadStats = async (p = period) => {
    try {
      setLoading(true);
      const res = await analyticsApi.getStats(p);
      if (res) {
        setData(res);
      }
    } catch (err) {
      console.error("Gagal memuat analitik:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats(period);
  }, [period]);

  const maxDailyViews = Math.max(
    1,
    ...(data?.dailyStats.map((d) => Math.max(d.pageViews, d.uniqueVisitors)) || [1])
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-24">
      {/* ── Page Header & Filter ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 flex items-center justify-center text-[#0066ff] dark:text-blue-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Analitik Pengunjung
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Real-time
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pantau statistik kunjungan, pengunjung unik, perangkat, dan halaman terpopuler di website Globallink.
          </p>
        </div>

        {/* Period Switcher & Refresh */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setPeriod("today")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                period === "today"
                  ? "bg-white dark:bg-slate-900 text-[#0066ff] dark:text-white shadow-xs font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Hari Ini
            </button>
            <button
              type="button"
              onClick={() => setPeriod("7d")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                period === "7d"
                  ? "bg-white dark:bg-slate-900 text-[#0066ff] dark:text-white shadow-xs font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              7 Hari Terakhir
            </button>
            <button
              type="button"
              onClick={() => setPeriod("30d")}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                period === "30d"
                  ? "bg-white dark:bg-slate-900 text-[#0066ff] dark:text-white shadow-xs font-bold"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              30 Hari Terakhir
            </button>
          </div>

          <button
            type="button"
            onClick={() => loadStats(period)}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors shadow-xs disabled:opacity-50"
            title="Muat Ulang Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {loading && !data ? (
        <div className="flex flex-col items-center justify-center py-28 space-y-4">
          <Loader2 className="w-8 h-8 text-[#0066ff] animate-spin" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Mengolah metrik pengunjung...
          </p>
        </div>
      ) : (
        <>
          {/* ── KPI Metric Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Page Views */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Total Page Views
                </span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-[#0066ff] dark:text-blue-400 flex items-center justify-center">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-[#0a193b] dark:text-white tracking-tight">
                  {data?.summary.totalViews.toLocaleString("id-ID") || 0}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Kunjungan halaman dalam periode</span>
                </p>
              </div>
            </div>

            {/* Unique Visitors */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Pengunjung Unik
                </span>
                <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-[#0a193b] dark:text-white tracking-tight">
                  {data?.summary.uniqueVisitors.toLocaleString("id-ID") || 0}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Pengguna unik berdasar identitas sesi / IP
                </p>
              </div>
            </div>

            {/* Today's Traffic */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Kunjungan Hari Ini
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-[#0a193b] dark:text-white tracking-tight">
                  {data?.summary.todayViews.toLocaleString("id-ID") || 0}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {data?.summary.todayUnique || 0} pengunjung unik hari ini
                </p>
              </div>
            </div>

            {/* Avg Session Duration & Bounce */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Durasi & Bounce Rate
                </span>
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-[#0a193b] dark:text-white tracking-tight">
                  {formatSeconds(data?.summary.avgDuration || 90)}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Bounce Rate: <strong className="text-slate-800 dark:text-slate-200">{data?.summary.bounceRate || 34}%</strong>
                </p>
              </div>
            </div>
          </div>

          {/* ── Interactive Traffic Trend Chart ── */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Grafik Tren Kunjungan Harian
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Perbandingan Page Views (Biru) vs Pengunjung Unik (Emerald)
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#0066ff]" />
                  <span className="text-slate-600 dark:text-slate-300">Page Views</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-slate-600 dark:text-slate-300">Pengunjung Unik</span>
                </div>
              </div>
            </div>

            {/* Visual Bar Chart */}
            <div className="pt-4">
              <div className="h-56 flex items-end gap-2 sm:gap-3 px-2 border-b border-slate-200 dark:border-slate-800 pb-2 relative">
                {data?.dailyStats.map((item, idx) => {
                  const viewHeightPct = Math.round((item.pageViews / maxDailyViews) * 100);
                  const uniqueHeightPct = Math.round((item.uniqueVisitors / maxDailyViews) * 100);
                  const isHovered = hoveredBar === idx;

                  return (
                    <div
                      key={item.date}
                      className="flex-1 h-full flex flex-col justify-end items-center group relative cursor-pointer"
                      onMouseEnter={() => setHoveredBar(idx)}
                      onMouseLeave={() => setHoveredBar(null)}
                    >
                      {/* Tooltip */}
                      {isHovered && (
                        <div className="absolute -top-16 z-20 px-3 py-2 rounded-xl bg-slate-950 text-white text-[11px] shadow-xl whitespace-nowrap border border-slate-800 pointer-events-none animate-in fade-in duration-150">
                          <div className="font-bold text-slate-200">{item.label}</div>
                          <div className="text-sky-300">Views: {item.pageViews}</div>
                          <div className="text-emerald-400">Unik: {item.uniqueVisitors}</div>
                        </div>
                      )}

                      {/* Bar Pair */}
                      <div className="w-full max-w-[32px] flex items-end justify-center gap-1 h-full">
                        <div
                          style={{ height: `${Math.max(viewHeightPct, 6)}%` }}
                          className="w-1/2 rounded-t-md bg-[#0066ff] group-hover:bg-blue-500 transition-all duration-200 shadow-xs"
                        />
                        <div
                          style={{ height: `${Math.max(uniqueHeightPct, 6)}%` }}
                          className="w-1/2 rounded-t-md bg-emerald-500 group-hover:bg-emerald-400 transition-all duration-200 shadow-xs"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Labels */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 pt-2 px-2">
                {data?.dailyStats.map((item, i) => {
                  // show fewer labels on mobile or 30d
                  if (data.dailyStats.length > 10 && i % 3 !== 0 && i !== data.dailyStats.length - 1) {
                    return <span key={item.date} className="flex-1" />;
                  }
                  return (
                    <span key={item.date} className="flex-1 text-center truncate">
                      {item.label}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Two Columns: Top Pages & Devices/Browsers ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Top Visited Pages */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#0066ff] dark:text-blue-400" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Halaman Paling Sering Dikunjungi
                  </h3>
                </div>
                <span className="text-xs text-slate-400">Top 8 URL</span>
              </div>

              <div className="space-y-3.5">
                {data?.topPages.map((pg, idx) => (
                  <div key={pg.path} className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[280px] sm:max-w-md">
                        <span className="w-5 text-slate-400 font-normal">#{idx + 1}</span>
                        <span className="font-mono text-[11px]">{pg.path}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-medium">
                        <span>{pg.views} views</span>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-bold">
                          {pg.percentage}%
                        </span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        style={{ width: `${Math.max(pg.percentage, 3)}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Devices & Browsers */}
            <div className="lg:col-span-5 space-y-6">
              {/* Devices Card */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Perangkat Pengunjung
                  </h3>
                  <Smartphone className="w-4 h-4 text-slate-400" />
                </div>

                <div className="space-y-3 text-xs">
                  {data?.deviceStats.map((dev) => {
                    const Icon =
                      dev.device === "Mobile"
                        ? Smartphone
                        : dev.device === "Tablet"
                        ? Tablet
                        : Laptop;
                    return (
                      <div key={dev.device} className="space-y-1.5">
                        <div className="flex items-center justify-between font-semibold">
                          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                            <Icon className="w-3.5 h-3.5 text-blue-500" />
                            <span>{dev.device}</span>
                          </div>
                          <span className="text-slate-500 dark:text-slate-400">
                            {dev.count} ({dev.percentage}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            style={{ width: `${Math.max(dev.percentage, 4)}%` }}
                            className="h-full rounded-full bg-indigo-500"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Traffic Sources / Referrers */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Sumber Lalu Lintas (Referrers)
                  </h3>
                  <Share2 className="w-4 h-4 text-slate-400" />
                </div>

                <div className="space-y-2.5 text-xs">
                  {data?.referrerStats.map((ref) => (
                    <div
                      key={ref.source}
                      className="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800/60 last:border-0"
                    >
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {ref.source}
                      </span>
                      <span className="font-bold text-[#0066ff] dark:text-blue-400">
                        {ref.count} ({ref.percentage}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Real-time Recent Activity Log Table ── */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Log Aktivitas Pengunjung Terkini (Real-time Feed)
                </h3>
              </div>
              <span className="text-xs text-slate-400">15 Kunjungan Terakhir</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3">Halaman Dikunjungi</th>
                    <th className="py-2.5 px-3">Perangkat</th>
                    <th className="py-2.5 px-3">Browser / OS</th>
                    <th className="py-2.5 px-3">Sumber Rujukan</th>
                    <th className="py-2.5 px-3 text-right">Waktu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {data?.recentLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="py-3 px-3 font-mono text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                        {log.path}
                      </td>
                      <td className="py-3 px-3 capitalize text-slate-600 dark:text-slate-300">
                        {log.deviceType || "Desktop"}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                        {log.browser} ({log.os})
                      </td>
                      <td className="py-3 px-3 text-slate-500 dark:text-slate-400">
                        {log.referrer || "Direct"}
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-slate-400">
                        {timeAgo(log.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
