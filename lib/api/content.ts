import { apiClient } from "./client";
import { SiteContentResponse } from "@/types";

export const contentApi = {
  // Public
  getAll: async () => {
    return apiClient<SiteContentResponse>("/content");
  },
  getByGroup: async (group: string) => {
    return apiClient<Record<string, string>>(`/content/group/${group}`);
  },

  // Admin
  bulkUpdate: async (items: Array<{ key: string; value: string; group?: string }>) => {
    return apiClient<any>("/admin/content/bulk", {
      method: "PUT",
      body: JSON.stringify({ items }),
    });
  },
};
