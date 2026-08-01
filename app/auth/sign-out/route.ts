import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = "/sign-in";
  redirectUrl.search = "";
  redirectUrl.searchParams.set("signedOut", "true");
  return NextResponse.redirect(redirectUrl, { status: 303 });
}
