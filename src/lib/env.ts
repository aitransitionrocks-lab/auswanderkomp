// Lazy ENV access mit Hilfsfunktionen.
// Wir validieren nicht zur Build-Zeit (sonst bricht jeder Build mit Platzhaltern),
// sondern zur Request-Zeit in den jeweiligen API-Routen.

export function envBaseUrl(): string {
  return process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
}

export function stripeReady(): boolean {
  const key = process.env.STRIPE_SECRET_KEY;
  return !!key && !key.startsWith("sk_test_placeholder");
}

export function stripeWebhookReady(): boolean {
  const s = process.env.STRIPE_WEBHOOK_SECRET;
  return !!s && !s.startsWith("whsec_placeholder");
}

export function resendReady(): boolean {
  const k = process.env.RESEND_API_KEY;
  return !!k && !k.startsWith("re_placeholder");
}

export function supabaseAdminReady(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const k = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return !!url && !url.startsWith("your_") && !!k && !k.startsWith("your_");
}
