import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Post } from "@/types";
import { Card } from "../base/Card";
import { Badge } from "../base/Badge";
import { Calendar, ArrowRight } from "lucide-react";

export interface BlogCardProps {
  post: Post;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Baru saja";

  return (
    <Card
      variant="interactive"
      padding="none"
      className="overflow-hidden flex flex-col h-full group border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900"
    >
      <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
        {/* Thumbnail */}
        <div className="relative w-full aspect-[16/10] bg-slate-100 dark:bg-slate-800 overflow-hidden">
          {post.thumbnailUrl ? (
            <img
              src={post.thumbnailUrl}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-brand-800 to-cyan-600 flex items-center justify-center text-white font-bold text-sm">
              Globallink Activity
            </div>
          )}
          <div className="absolute top-3 left-3">
            <Badge variant="brand" size="sm">
              Aktivitas & Insight
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col justify-between flex-1">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mb-2.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 leading-snug">
              {post.title}
            </h3>
            {post.excerpt && (
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs font-bold text-brand-600 dark:text-brand-400 group-hover:text-brand-700 dark:group-hover:text-brand-300">
            <span>Baca Selengkapnya</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </Card>
  );
};
