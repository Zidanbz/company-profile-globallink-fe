import { ApiResponse } from "@/types";

function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    // In local development (localhost), use localhost API port
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";
    }
    // In production behind Nginx reverse proxy, ALWAYS use relative path "/api/v1"
    // This automatically inherits current scheme (https://), host, and eliminates Mixed Content & CORS blockers.
    return "/api/v1";
  }
  // Server-side (SSR / Node.js)
  return process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5001/api/v1";
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  
  // Attach token if present in localStorage (client-side)
  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("globallink_token");
    if (token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data: ApiResponse<T> = await response.json().catch(() => ({
    success: false,
    message: "Gagal memproses respon server",
    data: null as any,
  }));

  if (!response.ok || !data.success) {
    if (response.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("globallink_token");
      localStorage.removeItem("globallink_user");
      if (window.location.pathname.startsWith("/admin") && window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login?expired=1";
      }
    }

    const error: any = new Error(data.message || "Permintaan API gagal");
    error.status = response.status;
    error.code = data.error?.code || "API_ERROR";
    error.details = data.error?.details;
    throw error;
  }

  return data.data;
}
