"use client";

import React, { useState, useEffect } from "react";
import { Post } from "@/types";
import { postsApi } from "@/lib/api/posts";
import { BlogCard } from "./BlogCard";
import { Input } from "../base/Input";
import { Pagination } from "../base/Pagination";
import { LoadingState } from "../base/LoadingState";
import { EmptyState } from "../base/EmptyState";
import { ErrorState } from "../base/ErrorState";
import { Search } from "lucide-react";

export const BlogList: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await postsApi.getPublicPosts({ page, limit: 6, search });
      setPosts(data.posts);
      setTotalPages(data.pagination.totalPages);
    } catch (err: any) {
      setError(err.message || "Gagal memuat artikel.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPosts();
  };

  return (
    <div className="space-y-10">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto">
        <Input
          placeholder="Cari artikel seputar teknologi & jaringan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          className="rounded-full shadow-sm"
        />
      </form>

      {/* States */}
      {loading ? (
        <LoadingState message="Memuat artikel publik..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchPosts} />
      ) : posts.length === 0 ? (
        <EmptyState
          title="Tidak Ada Artikel Ditemukan"
          description={
            search
              ? `Tidak ada artikel yang cocok dengan kata kunci "${search}".`
              : "Belum ada artikel publik yang diterbitkan saat ini."
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          <div className="pt-8">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  );
};
