import { apiClient } from "./client";
import { PartnerLogoData } from "@/types";

export const partnersApi = {
  // Public
  getAllPublic: async (category?: string) => {
    const query = category ? `?category=${category}` : "";
    return apiClient<PartnerLogoData[]>(`/partners${query}`);
  },

  // Admin
  getAllAdmin: async (category?: string) => {
    const query = category ? `?category=${category}` : "";
    return apiClient<PartnerLogoData[]>(`/admin/partners${query}`);
  },
  create: async (data: Partial<PartnerLogoData>) => {
    return apiClient<PartnerLogoData>("/admin/partners", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  update: async (id: number, data: Partial<PartnerLogoData>) => {
    return apiClient<PartnerLogoData>(`/admin/partners/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  delete: async (id: number) => {
    return apiClient<null>(`/admin/partners/${id}`, {
      method: "DELETE",
    });
  },
};
