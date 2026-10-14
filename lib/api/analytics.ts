import { apiClient } from "./client";

export interface AnalyticsSummary {
  totalViews: number;
  totalAllTime: number;
  uniqueVisitors: number;
  todayViews: number;
  todayUnique: number;
  avgDuration: number;
  bounceRate: number;
}

export interface DailyStat {
  date: string;
  label: string;
  pageViews: number;
  uniqueVisitors: number;
}

export interface TopPageStat {
  path: string;
  views: number;
  percentage: number;
}

export interface BreakdownStat {
  device?: string;
  browser?: string;
  source?: string;
  count: number;
  percentage: number;
}

export interface RecentLogItem {
  id: number;
  path: string;
  deviceType: string | null;
  browser: string | null;
  os: string | null;
  referrer: string | null;
  createdAt: string;
}

export interface AnalyticsStatsResponse {
  summary: AnalyticsSummary;
  dailyStats: DailyStat[];
  topPages: TopPageStat[];
  deviceStats: { device: string; count: number; percentage: number }[];
  browserStats: { browser: string; count: number; percentage: number }[];
  referrerStats: { source: string; count: number; percentage: number }[];
  recentLogs: RecentLogItem[];
}

export const analyticsApi = {
  // Public tracking
  track: async (data: { path: string; referrer?: string; visitorId?: string; duration?: number }) => {
    return apiClient<{ tracked: boolean }>("/analytics/track", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Admin stats
  getStats: async (period: "today" | "7d" | "30d" = "7d") => {
    return apiClient<AnalyticsStatsResponse>(`/admin/analytics/stats?period=${period}`);
  },
};
