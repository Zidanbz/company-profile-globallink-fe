import { apiClient } from "./client";
import { ServiceItemData } from "@/types";

export const servicesApi = {
  // Public
  getAllPublic: async () => {
    return apiClient<ServiceItemData[]>("/services");
  },
  getBySlug: async (slug: string) => {
    return apiClient<ServiceItemData>(`/services/${slug}`);
  },

  // Admin
  getAllAdmin: async () => {
    return apiClient<ServiceItemData[]>("/admin/services");
  },
  create: async (data: Partial<ServiceItemData>) => {
    return apiClient<ServiceItemData>("/admin/services", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  update: async (id: number, data: Partial<ServiceItemData>) => {
    return apiClient<ServiceItemData>(`/admin/services/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
  delete: async (id: number) => {
    return apiClient<null>(`/admin/services/${id}`, {
      method: "DELETE",
    });
  },
};
