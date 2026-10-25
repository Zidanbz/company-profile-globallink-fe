"use client";

import React from "react";
import { Container } from "../base/Container";
import { motion } from "framer-motion";

interface CertificateItem {
  id: string;
  badge: string;
  code: string;
  description: string;
}

const CERTIFICATES: CertificateItem[] = [
  {
    id: "iso-9001",
    badge: "/images/badge-circle-9001@2x.png",
    code: "ISO 9001:2015",
    description: "Quality Management System",
  },
  {
    id: "iso-45001",
    badge: "/images/badge-circle-45001@2x.png",
    code: "ISO 45001:2018",
    description: "Occupational Health & Safety",
  },
  {
    id: "iso-27001",
    badge: "/images/badge-circle-27001@2x.png",
    code: "ISO/IEC 27001:2022",
    description: "Information Security Management",
  },
];

export const CertificatesSection: React.FC = () => {
  return (
    <section
      id="certificates"
      className="py-8 sm:py-12 bg-white dark:bg-slate-950 relative overflow-hidden transition-colors duration-200"
    >
      <Container size="xl">
        {/* Header Text */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0a193b] dark:text-white tracking-tight"
          >
            Our Certificates
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.06, ease: "easeOut" }}
            className="mt-1.5 text-xs sm:text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed font-normal max-w-lg mx-auto"
          >
            Our company is committed to international quality standards to provide
            the best service with consistency, efficiency and customer satisfaction.
          </motion.p>
        </div>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 lg:gap-8 max-w-2xl mx-auto">
          {CERTIFICATES.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
              className="group flex flex-col items-center text-center cursor-default"
            >
              {/* Emblem Badge Icon */}
              <div className="relative mb-2.5 transition-transform duration-300 ease-out group-hover:scale-105">
                <img
                  src={cert.badge}
                  alt={`${cert.code} Certification`}
                  className="w-16 sm:w-18 lg:w-20 h-auto object-contain select-none"
                  loading="lazy"
                />
              </div>

              {/* Title Code */}
              <h3 className="text-sm sm:text-base font-extrabold text-[#0a193b] dark:text-white tracking-tight">
                {cert.code}
              </h3>

              {/* Subtitle / Description */}
              <p className="mt-0.5 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium max-w-[170px] leading-snug">
                {cert.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
};
