import { redirect } from "next/navigation";

// Quiz-Einstieg leitet auf Frage 1 weiter.
export const metadata = {
  title: "Einschätzung starten",
  robots: { index: false, follow: false },
};

export default function CheckEntry() {
  redirect("/check/1");
}
