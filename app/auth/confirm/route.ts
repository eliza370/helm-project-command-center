import type { EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

import { getSafeRedirectPath } from "@/features/auth/redirects";
import { createClient } from "@/lib/supabase/server";

const allowedEmailTypes = new Set<EmailOtpType>(["email", "signup"]);

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type") as EmailOtpType | null;
  const code = request.nextUrl.searchParams.get("code");
  const next = getSafeRedirectPath(request.nextUrl.searchParams.get("next"));
  const supabase = await createClient();
  let confirmed = false;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    confirmed = !error;
  } else if (tokenHash && type && allowedEmailTypes.has(type)) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    confirmed = !error;
  }

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.search = "";
  if (confirmed) {
    return NextResponse.redirect(new URL(next, request.nextUrl.origin));
  }

  redirectUrl.pathname = "/sign-in";
  redirectUrl.searchParams.set("confirmation", "invalid");
  return NextResponse.redirect(redirectUrl);
}
