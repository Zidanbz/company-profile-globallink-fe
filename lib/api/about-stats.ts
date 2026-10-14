import { apiClient } from "./client";
import { AboutStatData } from "@/types";

export const aboutStatsApi = {
  // Public
  getAll: async () => {
    return apiClient<AboutStatData[]>("/about-stats");
  },

  // Admin
  bulkSave: async (stats: Array<Partial<AboutStatData>>) => {
    return apiClient<AboutStatData[]>("/admin/about-stats", {
      method: "PUT",
      body: JSON.stringify({ stats }),
    });
  },
};
