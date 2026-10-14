import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Globallink — Smart IT Solution | Konektivitas & Infrastruktur Digital",
  description:
    "Globallink adalah penyedia solusi jaringan dan teknologi terintegrasi di Indonesia. Layanan Internet Dedicated, Smart CCTV, SkyStar Satelit, dan Infrastruktur Digital Nasional.",
  keywords: [
    "Globallink",
    "Smart IT Solution",
    "Internet Service",
    "Fiber Optic",
    "Smart CCTV",
    "Infrastruktur Jaringan Indonesia",
    "IT Consultant",
  ],
  authors: [{ name: "Globallink" }],
  creator: "Globallink — Smart IT Solution",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://globallink.co.id",
    title: "Globallink — Smart IT Solution",
    description:
      "Lebih dari Sekadar Koneksi, Ini Tentang Masa Depan. Jaringan yang Menyatukan Indonesia.",
    siteName: "Globallink",
  },
  twitter: {
    card: "summary_large_image",
    title: "Globallink — Smart IT Solution",
    description:
      "Lebih dari Sekadar Koneksi, Ini Tentang Masa Depan. Jaringan yang Menyatukan Indonesia.",
  },
};

import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`scroll-smooth ${inter.variable} ${manrope.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-brand-500 selection:text-white transition-colors duration-200">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="globallink-theme"
          disableTransitionOnChange
        >
          <AnalyticsTracker />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
