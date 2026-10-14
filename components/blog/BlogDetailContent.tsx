import React from "react";
import { Post } from "@/types";
import { Badge } from "../base/Badge";
import { Calendar, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "../base/Button";

export interface BlogDetailContentProps {
  post: Post;
}

export const BlogDetailContent: React.FC<BlogDetailContentProps> = ({ post }) => {
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Baru saja";

  return (
    <article className="max-w-4xl mx-auto space-y-8">
      {/* Back button */}
      <div>
        <Link href="/blog">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
          >
            Kembali ke Semua Artikel
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-4 text-left">
        <Badge variant="brand" size="md">
          Aktivitas & Berita Globallink
        </Badge>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          {post.title}
        </h1>

        <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400 pt-2 border-b border-slate-100 dark:border-slate-800/80 pb-6">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span className="font-semibold text-slate-700 dark:text-slate-200">Tim Globallink</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {post.thumbnailUrl && (
        <div className="rounded-3xl overflow-hidden shadow-xl aspect-[16/9] bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
          <img
            src={post.thumbnailUrl}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Excerpt Lead */}
      {post.excerpt && (
        <p className="text-lg sm:text-xl font-medium text-slate-700 dark:text-slate-200 leading-relaxed italic border-l-4 border-brand-500 pl-4">
          {post.excerpt}
        </p>
      )}

      {/* Rich Text HTML Content */}
      <div
        className="prose prose-slate dark:prose-invert prose-lg max-w-none text-slate-700 dark:text-slate-300 leading-relaxed space-y-6 pt-4 [&>h2]:text-slate-900 dark:[&>h2]:text-white [&>h3]:text-slate-900 dark:[&>h3]:text-white [&>p]:text-slate-700 dark:[&>p]:text-slate-300 [&>ul]:text-slate-700 dark:[&>ul]:text-slate-300 [&>ol]:text-slate-700 dark:[&>ol]:text-slate-300"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
};
