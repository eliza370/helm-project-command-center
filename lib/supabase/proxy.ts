import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import type { Database } from "@/lib/supabase/database.types";

const protectedPaths = ["/projects"];
const authenticationPaths = ["/sign-in", "/sign-up"];

function startsWithPath(pathname: string, paths: string[]) {
  return paths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

function redirectWithAuthCookies(
  request: NextRequest,
  response: NextResponse,
  pathname: string,
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";

  if (pathname === "/sign-in") {
    url.searchParams.set(
      "next",
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
    );
  }

  const redirectResponse = NextResponse.redirect(url);
  response.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });

  for (const header of ["cache-control", "expires", "pragma"]) {
    const value = response.headers.get(header);
    if (value) redirectResponse.headers.set(header, value);
  }

  return redirectResponse;
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });

          Object.entries(headers).forEach(([name, value]) => {
            response.headers.set(name, value);
          });
        },
      },
    },
  );

  const { data, error } = await supabase.auth.getClaims();
  const isAuthenticated = !error && Boolean(data?.claims.sub);
  const pathname = request.nextUrl.pathname;

  if (!isAuthenticated && startsWithPath(pathname, protectedPaths)) {
    return redirectWithAuthCookies(request, response, "/sign-in");
  }

  if (isAuthenticated && startsWithPath(pathname, authenticationPaths)) {
    return redirectWithAuthCookies(request, response, "/projects");
  }

  return response;
}
