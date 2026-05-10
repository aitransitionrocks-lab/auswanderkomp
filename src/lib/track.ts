"use client";

import posthog from "posthog-js";

let initialized = false;

export function initTracking() {
  if (typeof window === "undefined" || initialized) return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.posthog.com";
  if (!key || key.startsWith("phc_placeholder")) return;
  posthog.init(key, { api_host: host, capture_pageview: false });
  initialized = true;
}

export function track(event: string, props: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key || key.startsWith("phc_placeholder")) {
    console.debug("[track/dev]", event, props);
    return;
  }
  if (!initialized) initTracking();
  posthog.capture(event, props);
}
