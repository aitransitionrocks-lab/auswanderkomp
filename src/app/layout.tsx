import type { Metadata } from "next";
import { Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import "./globals.css";

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Auswander-Kompass | Ihr persönlicher Fahrplan",
  description:
    "In 10 Fragen zu Ihrer persönlichen Einschätzung — und einem strukturierten Ablaufplan für Ihren Umzug ins Ausland.",
  openGraph: {
    title: "Auswander-Kompass",
    description: "Ein strukturierter Fahrplan statt noch mehr Informationen.",
    locale: "de_DE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body
        className={`${display.variable} ${body.variable} font-body antialiased bg-white text-navy`}
      >
        {children}
      </body>
    </html>
  );
}
