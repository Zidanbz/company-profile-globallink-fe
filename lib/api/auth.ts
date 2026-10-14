import { apiClient } from "./client";
import { User } from "@/types";

export interface LoginResponse {
  token: string;
  user: User;
}

export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    return apiClient<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  getCurrentUser: async (): Promise<User> => {
    return apiClient<User>("/auth/me");
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient("/auth/logout", { method: "POST" });
    } catch (err) {
      console.warn("Logout notification to server skipped or failed:", err);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("globallink_token");
        localStorage.removeItem("globallink_user");
      }
    }
  },
};
