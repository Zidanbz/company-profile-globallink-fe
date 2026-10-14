"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Post } from "@/types";
import { postsApi } from "@/lib/api/posts";
import { PostForm } from "@/components/admin/PostForm";
import { LoadingState } from "@/components/base/LoadingState";
import { ErrorState } from "@/components/base/ErrorState";

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPost = async () => {
    if (!id || isNaN(id)) {
      setError("ID artikel tidak valid");
      setLoading(false);
      return;
    }

    try {
      const data = await postsApi.getAdminPostById(id);
      setPost(data);
    } catch (err: any) {
      setError(err.message || "Gagal mengambil data artikel");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPost();
  }, [id]);

  if (loading) return <LoadingState message="Mengambil data artikel..." />;
  if (error || !post) {
    return (
      <ErrorState
        title="Artikel Tidak Ditemukan"
        message={error || "Data artikel tidak dapat dimuat."}
        onRetry={() => router.push("/admin/posts")}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <PostForm initialData={post} isEditing />
    </div>
  );
}
