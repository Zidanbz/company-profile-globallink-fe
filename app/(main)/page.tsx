import React from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { AboutSection } from "@/components/home/AboutSection";
import { BlogSection } from "@/components/home/BlogSection";
import { ValueAddedSection } from "@/components/home/ValueAddedSection";
import { PartnersSection } from "@/components/home/PartnersSection";
import { MapSection } from "@/components/home/MapSection";
import { CtaSection } from "@/components/home/CtaSection";
import { CertificatesSection } from "@/components/home/CertificatesSection";
import { ContactSection } from "@/components/home/ContactSection";

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Globallink — Smart IT Solution",
    url: "https://globallink.co.id",
    logo: "https://globallink.co.id/logo.png",
    description:
      "Penyedia infrastruktur jaringan, serat optik, internet service, smart CCTV, dan satelit terkemuka di Indonesia.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "ID",
      addressLocality: "Jakarta",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <BlogSection />
      <ValueAddedSection />
      <PartnersSection />
      <MapSection />
      <CtaSection />
      <CertificatesSection />
      <ContactSection />
    </>
  );
}
