"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { analyticsApi } from "@/lib/api/analytics";

function getOrCreateVisitorId(): string {
  if (typeof window === "undefined") return "";
  try {
    let vid = localStorage.getItem("globallink_vid");
    if (!vid) {
      vid = "vis_" + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
      localStorage.setItem("globallink_vid", vid);
    }
    return vid;
  } catch {
    return "vis_anonymous";
  }
}

export const AnalyticsTracker: React.FC = () => {
  const pathname = usePathname();
  const lastPathRef = useRef<string>("");
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    // Exclude admin pages from analytics tracking
    if (!pathname || pathname.startsWith("/admin")) {
      return;
    }

    if (lastPathRef.current === pathname) {
      return;
    }

    lastPathRef.current = pathname;
    startTimeRef.current = Date.now();

    const vid = getOrCreateVisitorId();
    const referrer = typeof document !== "undefined" ? document.referrer : "";

    // Send pageview track non-blocking
    analyticsApi
      .track({
        path: pathname,
        referrer,
        visitorId: vid,
        duration: 0,
      })
      .catch(() => {
        // silent
      });
  }, [pathname]);

  return null;
};
