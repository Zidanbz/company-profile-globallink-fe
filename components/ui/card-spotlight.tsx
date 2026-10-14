"use client";

import React, { useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

export const CardSpotlight = ({
  children,
  radius = 350,
  color = "rgba(37, 99, 235, 0.08)",
  className,
  ...props
}: {
  radius?: number;
  color?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;
      const { left, top } = cardRef.current.getBoundingClientRect();
      mouseX.current = e.clientX - left;
      mouseY.current = e.clientY - top;
      if (cardRef.current) {
        cardRef.current.style.setProperty("--mouse-x", `${mouseX.current}px`);
        cardRef.current.style.setProperty("--mouse-y", `${mouseY.current}px`);
      }
    },
    []
  );

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group/spotlight relative rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-slate-300 overflow-hidden",
        className
      )}
      style={
        {
          "--mouse-x": "0px",
          "--mouse-y": "0px",
          "--spotlight-color": color,
          "--spotlight-radius": `${radius}px`,
        } as React.CSSProperties
      }
      {...props}
    >
      {/* Interactive Spotlight Radial Gradient */}
      <div
        className={cn(
          "pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100",
          isHovered ? "opacity-100" : "opacity-0"
        )}
        style={{
          background: `radial-gradient(var(--spotlight-radius) circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 80%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
