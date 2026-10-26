import { apiClient } from "./client";
import { PaginationMeta, Post } from "@/types";

export interface PostsResponse {
  posts: Post[];
  pagination: PaginationMeta;
}

export interface PostFilterQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export const postsApi = {
  // Public endpoints
  getPublicPosts: async (params: PostFilterQuery = {}): Promise<PostsResponse> => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", params.page.toString());
    if (params.limit) query.set("limit", params.limit.toString());
    if (params.search) query.set("search", params.search);
    if (params.sortBy) query.set("sortBy", params.sortBy);
    if (params.sortOrder) query.set("sortOrder", params.sortOrder);

    const queryString = query.toString();
    return apiClient<PostsResponse>(`/posts${queryString ? `?${queryString}` : ""}`);
  },

  getPublicPostBySlug: async (slug: string): Promise<Post> => {
    return apiClient<Post>(`/posts/${slug}`, {
      cache: "no-store",
    });
  },

  // Admin endpoints
  getAdminPosts: async (params: PostFilterQuery = {}): Promise<PostsResponse> => {
    const query = new URLSearchParams();
    if (params.page) query.set("page", params.page.toString());
    if (params.limit) query.set("limit", params.limit.toString());
    if (params.search) query.set("search", params.search);
    if (params.status) query.set("status", params.status);
    if (params.sortBy) query.set("sortBy", params.sortBy);
    if (params.sortOrder) query.set("sortOrder", params.sortOrder);

    const queryString = query.toString();
    return apiClient<PostsResponse>(`/admin/posts${queryString ? `?${queryString}` : ""}`);
  },

  getAdminPostById: async (id: number): Promise<Post> => {
    return apiClient<Post>(`/admin/posts/${id}`);
  },

  createPost: async (data: Partial<Post>): Promise<Post> => {
    return apiClient<Post>("/admin/posts", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updatePost: async (id: number, data: Partial<Post>): Promise<Post> => {
    return apiClient<Post>(`/admin/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deletePost: async (id: number): Promise<{ id: number }> => {
    return apiClient<{ id: number }>(`/admin/posts/${id}`, {
      method: "DELETE",
    });
  },

  getStats: async (): Promise<{ total: number; published: number; draft: number; archived: number }> => {
    return apiClient("/admin/posts/stats");
  },

  uploadThumbnail: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append("image", file);
    return apiClient<{ url: string }>("/admin/upload", {
      method: "POST",
      body: formData,
    });
  },
};
