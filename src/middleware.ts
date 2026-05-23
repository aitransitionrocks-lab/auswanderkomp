import { NextRequest, NextResponse } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/middleware";

// Aktualisiert Auth-Session bei jedem Request + schützt /app/*.
export async function middleware(req: NextRequest) {
  // Ohne Supabase-Config: durchlassen (App degradiert graceful)
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || url.startsWith("your_") || key.startsWith("your_")) {
    return NextResponse.next();
  }

  const { response, user } = await updateSupabaseSession(req);

  // /app/* erfordert Auth
  if (req.nextUrl.pathname.startsWith("/app") && !user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
