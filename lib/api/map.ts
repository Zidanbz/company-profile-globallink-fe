import { apiClient } from "./client";
import { MapLocation, MapLocationCategory } from "@/types";

export interface MapFilterQuery {
  category?: MapLocationCategory;
  search?: string;
}

export const mapApi = {
  // Public
  getPublicLocations: async (params: MapFilterQuery = {}): Promise<MapLocation[]> => {
    const query = new URLSearchParams();
    if (params.category) query.set("category", params.category);
    if (params.search) query.set("search", params.search);

    const queryString = query.toString();
    return apiClient<MapLocation[]>(`/map-locations${queryString ? `?${queryString}` : ""}`);
  },

  getLocationById: async (id: number): Promise<MapLocation> => {
    return apiClient<MapLocation>(`/map-locations/${id}`);
  },

  // Admin
  getAdminLocations: async (params: MapFilterQuery = {}): Promise<MapLocation[]> => {
    const query = new URLSearchParams();
    if (params.category) query.set("category", params.category);
    if (params.search) query.set("search", params.search);

    const queryString = query.toString();
    return apiClient<MapLocation[]>(`/admin/map-locations${queryString ? `?${queryString}` : ""}`);
  },

  createLocation: async (data: Partial<MapLocation>): Promise<MapLocation> => {
    return apiClient<MapLocation>("/admin/map-locations", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateLocation: async (id: number, data: Partial<MapLocation>): Promise<MapLocation> => {
    return apiClient<MapLocation>(`/admin/map-locations/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteLocation: async (id: number): Promise<{ id: number }> => {
    return apiClient<{ id: number }>(`/admin/map-locations/${id}`, {
      method: "DELETE",
    });
  },

  getTotalCount: async (): Promise<{ count: number }> => {
    return apiClient("/admin/map-locations/count");
  },
};
