import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/base/Container";
import { BlogDetailContent } from "@/components/blog/BlogDetailContent";
import { postsApi } from "@/lib/api/posts";

interface PageProps {
  params: { slug: string };
}

// Dynamic Metadata per SEO rule
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const post = await postsApi.getPublicPostBySlug(params.slug);
    return {
      title: `${post.title} | Globallink`,
      description: post.excerpt || "Artikel resmi dari Globallink — Smart IT Solution",
      openGraph: {
        title: post.title,
        description: post.excerpt || undefined,
        images: post.thumbnailUrl ? [post.thumbnailUrl] : [],
      },
    };
  } catch (e) {
    return {
      title: "Artikel Tidak Ditemukan | Globallink",
    };
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  let post;
  try {
    post = await postsApi.getPublicPostBySlug(params.slug);
  } catch (error) {
    // If not found or API error during build
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.thumbnailUrl || undefined,
    datePublished: post.publishedAt || post.createdAt,
    author: {
      "@type": "Organization",
      name: "Globallink",
    },
  };

  return (
    <div className="pt-32 pb-24 bg-white dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container size="lg">
        <BlogDetailContent post={post} />
      </Container>
    </div>
  );
}
