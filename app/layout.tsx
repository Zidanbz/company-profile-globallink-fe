import type { Metadata } from "next";
import "./globals.css";

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
    url: "https://web.globallink.net.id",
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
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
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
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
