export type UserRole = "ADMIN";

export interface User {
  id: number;
  email: string;
  role: UserRole;
  createdAt: string;
}

export type PostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  thumbnailUrl: string | null;
  status: PostStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type MapLocationCategory =
  | "FIBER_OPTIC"
  | "DATA_CENTER"
  | "POP"
  | "OFFICE"
  | "COVERAGE"
  | "OTHER";

export interface MapLocation {
  id: number;
  name: string;
  category: MapLocationCategory;
  latitude: number | string;
  longitude: number | string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SiteContent {
  id: number;
  key: string;
  value: string;
  group: string;
  createdAt: string;
  updatedAt: string;
}

export interface SiteContentResponse {
  dictionary: Record<string, string>;
  groups: Record<string, Record<string, string>>;
  items: SiteContent[];
}

export interface ServiceItemData {
  id: number;
  title: string;
  slug: string;
  description: string;
  icon: string;
  badge: string | null;
  imageUrl?: string | null;
  features: string | null; // JSON string or parsed array
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AboutStatData {
  id: number;
  value: string;
  label: string;
  description: string | null;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactMessageData {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerLogoData {
  id: number;
  name: string;
  category?: "PARTNER" | "CLIENT" | string;
  logoUrl: string;
  svgContent?: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: {
    code: string;
    details?: any;
  };
}

