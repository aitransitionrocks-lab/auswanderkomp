"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

export function PageViewTracker({
  event,
  props,
}: {
  event: string;
  props?: Record<string, unknown>;
}) {
  useEffect(() => {
    track(event, props ?? {});
  }, [event, props]);
  return null;
}
