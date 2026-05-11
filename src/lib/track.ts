"use client";

import posthog from "posthog-js";

export function track(event: string, props: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key || key.startsWith("phc_placeholder")) {
    if (process.env.NODE_ENV !== "production") {
      console.debug("[track/dev]", event, props);
    }
    return;
  }
  posthog.capture(event, props);
}
