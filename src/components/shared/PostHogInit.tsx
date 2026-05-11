"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export function PostHogInit() {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host =
      process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.posthog.com";
    if (!key || key.startsWith("phc_placeholder")) return;
    if (typeof window === "undefined") return;
    if ((window as unknown as { __ak_ph_init?: boolean }).__ak_ph_init) return;
    posthog.init(key, {
      api_host: host,
      capture_pageview: true,
      persistence: "memory",
      autocapture: false,
    });
    (window as unknown as { __ak_ph_init?: boolean }).__ak_ph_init = true;
  }, []);
  return null;
}
