import React from "react";
import { Card } from "../base/Card";
import { FileText, CheckCircle2, Clock, MapPin } from "lucide-react";

export interface DashboardStatsProps {
  stats: {
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    totalLocations: number;
  };
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const cards = [
    {
      label: "Total Artikel",
      value: stats.totalPosts,
      icon: FileText,
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      label: "Artikel Terbit (Published)",
      value: stats.publishedPosts,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    },
    {
      label: "Artikel Draft",
      value: stats.draftPosts,
      icon: Clock,
      color: "bg-amber-50 text-amber-600 border-amber-200",
    },
    {
      label: "Titik Lokasi Infrastruktur",
      value: stats.totalLocations,
      icon: MapPin,
      color: "bg-cyan-50 text-cyan-600 border-cyan-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <Card key={c.label} padding="md" className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${c.color}`}
            >
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                {c.label}
              </p>
              <p className="text-2xl font-black text-slate-900 mt-0.5">{c.value}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
