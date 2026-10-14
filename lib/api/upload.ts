import { apiClient } from "./client";

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);
  const res = await apiClient<{ url: string }>("/admin/upload", {
    method: "POST",
    body: formData,
  });
  return res.url;
}
