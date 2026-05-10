import Link from "next/link";
import Stripe from "stripe";
import {
  getSessionEmail,
  setSessionCookie,
} from "@/lib/session";
import {
  loadDashboardData,
  loadDashboardByAccessToken,
} from "@/lib/dashboard";
import { RiskAmpel } from "@/components/result/RiskAmpel";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TaskList } from "@/components/dashboard/TaskList";
import { AccountFooter } from "@/components/dashboard/AccountFooter";
import { DashboardTracking } from "@/components/dashboard/DashboardTracking";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Willkommen — Auswander-Kompass",
  robots: { index: false, follow: false },
};

interface SearchParams {
  session_id?: string;
  token?: string;
}

function stripeReady(): boolean {
  const key = process.env.STRIPE_SECRET_KEY;
  return !!key && !key.startsWith("sk_test_placeholder");
}

async function resolveEmail(sp: SearchParams): Promise<string | null> {
  if (sp.token) {
    const email = await loadDashboardByAccessToken(sp.token);
    if (email) {
      setSessionCookie(email);
      return email;
    }
  }

  if (sp.session_id && stripeReady()) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
      const session = await stripe.checkout.sessions.retrieve(sp.session_id);
      const email =
        session.customer_email ?? session.customer_details?.email ?? null;
      if (email && session.payment_status === "paid") {
        setSessionCookie(email);
        return email;
      }
    } catch (err) {
      console.error("[willkommen] stripe retrieve error:", err);
    }
  }

  return getSessionEmail();
}

export default async function WillkommenPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const email = await resolveEmail(searchParams);

  if (!email) {
    return <NoAccess />;
  }

  const data = await loadDashboardData(email);

  if (!data) {
    return <PendingActivation email={email} />;
  }

  return (
    <main className="min-h-screen bg-white">
      <DashboardTracking country={data.country} segment={data.segment} />
      <DashboardHeader data={data} />
      <RiskAmpel risk={data.risk} />
      <TaskList country={data.country} />
      <AccountFooter email={data.email} />
    </main>
  );
}

function NoAccess() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6 py-16">
      <div className="max-w-md text-center">
        <h1 className="font-display font-bold text-2xl text-navy mb-3">
          Zugang erforderlich
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Dieser Bereich ist für Kompass-Abonnent:innen. Wenn Sie bereits ein
          Abo haben, können Sie sich einen neuen Zugangslink an Ihre E-Mail
          schicken lassen.
        </p>
        <div className="space-y-3">
          <Link
            href="/login"
            className="block px-6 py-4 bg-teal hover:bg-teal-mid text-white font-display font-bold rounded-xl"
          >
            Zugangslink anfordern
          </Link>
          <Link
            href="/"
            className="block text-teal hover:text-teal-mid text-sm"
          >
            Zur Einschätzung
          </Link>
        </div>
      </div>
    </main>
  );
}

function PendingActivation({ email }: { email: string }) {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6 py-16">
      <div className="max-w-md text-center">
        <h1 className="font-display font-bold text-2xl text-navy mb-3">
          Ihre Zahlung wird verarbeitet
        </h1>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Wir haben Ihre Zahlung registriert, aber die Aktivierung ist noch
          nicht abgeschlossen. Das dauert meist nur wenige Sekunden.
        </p>
        <p className="text-sm text-gray-400 mb-8">
          Angemeldet als <strong className="text-navy">{email}</strong>
        </p>
        <a
          href="/willkommen"
          className="inline-block px-6 py-3 border-2 border-teal text-teal font-semibold rounded-xl"
        >
          Seite neu laden
        </a>
      </div>
    </main>
  );
}
