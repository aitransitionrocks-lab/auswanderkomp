import type { Metadata } from "next";
import { Fraunces, Inter_Tight } from "next/font/google";
import { PostHogInit } from "@/components/shared/PostHogInit";
import "./globals.css";

const serif = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--ak-serif",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const sans = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--ak-sans",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
  fallback: ["system-ui", "Segoe UI", "Arial", "sans-serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://auswanderkompass.de"
  ),
  title: {
    default: "Auswander-Kompass — Orientierung · Reihenfolge · Klarheit",
    template: "%s · Auswander-Kompass",
  },
  description:
    "Beim Auswandern entscheidet die Reihenfolge — und Fehler können teuer werden. In 3 Minuten zur persönlichen Einschätzung.",
  openGraph: {
    title: "Auswander-Kompass",
    description: "Orientierung · Reihenfolge · Klarheit",
    locale: "de_DE",
    type: "website",
  },
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body className={`${serif.variable} ${sans.variable} font-sans antialiased`}>
        <PostHogInit />
        {children}
      </body>
    </html>
  );
}
