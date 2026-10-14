"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Post, PostStatus } from "@/types";
import { postsApi } from "@/lib/api/posts";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/base/Table";
import { Button } from "@/components/base/Button";
import { Badge } from "@/components/base/Badge";
import { Input } from "@/components/base/Input";
import { Select } from "@/components/base/Select";
import { Pagination } from "@/components/base/Pagination";
import { LoadingState } from "@/components/base/LoadingState";
import { EmptyState } from "@/components/base/EmptyState";
import { Modal } from "@/components/base/Modal";
import { PlusCircle, Search, Edit3, Trash2 } from "lucide-react";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await postsApi.getAdminPosts({
        page,
        limit: 10,
        search,
        status: status || undefined,
      });
      setPosts(data.posts);
      setTotalPages(data.pagination.totalPages);
    } catch (e) {
      console.error("Failed to fetch admin posts", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, status]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchPosts();
  };

  const confirmDelete = async () => {
    if (!selectedPost) return;
    setDeleting(true);
    try {
      await postsApi.deletePost(selectedPost.id);
      setDeleteModalOpen(false);
      setSelectedPost(null);
      fetchPosts();
    } catch (e) {
      alert("Gagal menghapus artikel");
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (s: PostStatus) => {
    switch (s) {
      case "PUBLISHED":
        return <Badge variant="success">Published</Badge>;
      case "DRAFT":
        return <Badge variant="warning">Draft</Badge>;
      case "ARCHIVED":
        return <Badge variant="neutral">Archived</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Manajemen Artikel & Berita
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Kelola publikasi aktivitas dan edukasi teknologi Globallink
          </p>
        </div>

        <Link href="/admin/posts/create">
          <Button size="sm" leftIcon={<PlusCircle className="w-4 h-4" />}>
            Tulis Artikel Baru
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <form onSubmit={handleSearchSubmit} className="w-full sm:w-80">
          <Input
            placeholder="Cari artikel..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-slate-400" />}
          />
        </form>

        <div className="w-full sm:w-48">
          <Select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            options={[
              { label: "Semua Status", value: "" },
              { label: "Published", value: "PUBLISHED" },
              { label: "Draft", value: "DRAFT" },
              { label: "Archived", value: "ARCHIVED" },
            ]}
          />
        </div>
      </div>

      {/* Posts Table */}
      {loading ? (
        <LoadingState message="Memuat daftar artikel..." />
      ) : posts.length === 0 ? (
        <EmptyState
          title="Belum Ada Artikel"
          description="Mulai buat artikel pertama Anda untuk mengisi halaman blog publik."
          action={
            <Link href="/admin/posts/create">
              <Button size="sm">Tulis Artikel Baru</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul Artikel</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {post.thumbnailUrl ? (
                        <img
                          src={post.thumbnailUrl}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] text-slate-400 font-bold">
                          No Pic
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-slate-900 line-clamp-1">
                          {post.title}
                        </p>
                        <p className="text-xs text-slate-400 font-mono">
                          /{post.slug}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(post.status)}</TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {new Date(post.createdAt).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link href={`/admin/posts/${post.id}/edit`}>
                        <button
                          className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-slate-100 transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </Link>
                      <button
                        onClick={() => {
                          setSelectedPost(post);
                          setDeleteModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Konfirmasi Hapus Artikel"
        description="Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat dibatalkan."
      >
        <div className="pt-4 flex justify-end gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDeleteModalOpen(false)}
          >
            Batal
          </Button>
          <Button
            variant="danger"
            size="sm"
            isLoading={deleting}
            onClick={confirmDelete}
          >
            Hapus Artikel
          </Button>
        </div>
      </Modal>
    </div>
  );
}
