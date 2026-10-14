import { ApiResponse } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  
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
