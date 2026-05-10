import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "ak_session";
const MAX_AGE_DAYS = 30;

function getSecret(): string {
  return (
    process.env.AK_SESSION_SECRET ??
    process.env.STRIPE_WEBHOOK_SECRET ??
    "dev-secret-change-me"
  );
}

function sign(payload: string): string {
  return crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("hex")
    .slice(0, 32);
}

function encode(email: string): string {
  const issued = Date.now();
  const payload = `${email}|${issued}`;
  const sig = sign(payload);
  return Buffer.from(`${payload}|${sig}`, "utf8").toString("base64url");
}

function decode(token: string): { email: string; issued: number } | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const parts = decoded.split("|");
    if (parts.length !== 3) return null;
    const [email, issuedStr, sig] = parts;
    const expected = sign(`${email}|${issuedStr}`);
    if (sig !== expected) return null;
    const issued = Number(issuedStr);
    const ageMs = Date.now() - issued;
    if (ageMs > MAX_AGE_DAYS * 24 * 60 * 60 * 1000) return null;
    return { email, issued };
  } catch {
    return null;
  }
}

export function setSessionCookie(email: string) {
  cookies().set(COOKIE_NAME, encode(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_DAYS * 24 * 60 * 60,
  });
}

export function getSessionEmail(): string | null {
  const val = cookies().get(COOKIE_NAME)?.value;
  if (!val) return null;
  const parsed = decode(val);
  return parsed?.email ?? null;
}

export function clearSessionCookie() {
  cookies().delete(COOKIE_NAME);
}
