import { apiClient } from "./client";
import { ContactMessageData, PaginationMeta } from "@/types";

export interface ContactMessagesResponse {
  items: ContactMessageData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const contactApi = {
  // Public
  submit: async (data: {
    name: string;
    email: string;
    phone?: string;
    subject?: string;
    message: string;
  }) => {
    return apiClient<ContactMessageData>("/contact-messages", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // Admin
  getAllAdmin: async (page: number = 1, limit: number = 20, isRead?: boolean) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (typeof isRead === "boolean") {
      params.append("isRead", isRead.toString());
    }
    return apiClient<ContactMessagesResponse>(`/admin/contact-messages?${params.toString()}`);
  },

  getUnreadCount: async () => {
    return apiClient<{ unreadCount: number }>("/admin/contact-messages/unread-count");
  },

  markAsRead: async (id: number, isRead: boolean = true) => {
    return apiClient<ContactMessageData>(`/admin/contact-messages/${id}/read`, {
      method: "PATCH",
      body: JSON.stringify({ isRead }),
    });
  },

  delete: async (id: number) => {
    return apiClient<null>(`/admin/contact-messages/${id}`, {
      method: "DELETE",
    });
  },
};
