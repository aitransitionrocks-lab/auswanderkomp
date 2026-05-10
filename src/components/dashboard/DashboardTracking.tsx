"use client";

import { useEffect } from "react";
import { track } from "@/lib/track";

export function DashboardTracking({
  country,
  segment,
}: {
  country: string;
  segment: string;
}) {
  useEffect(() => {
    track("roadmap_view", { country, segment });
  }, [country, segment]);
  return null;
}
