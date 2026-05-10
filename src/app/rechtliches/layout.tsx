import Link from "next/link";

export default function RechtlichesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <Link
          href="/"
          className="text-teal hover:text-teal-mid text-sm font-semibold"
        >
          ← Zurück zur Startseite
        </Link>
        <div className="prose prose-neutral max-w-none mt-6">{children}</div>
      </div>
    </main>
  );
}
