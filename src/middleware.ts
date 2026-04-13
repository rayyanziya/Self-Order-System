import { NextRequest, NextResponse } from "next/server";

const PROTECTED = ["/kitchen", "/admin"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtected = PROTECTED.some((p) => pathname === p || pathname.startsWith(p + "/"));

  if (!isProtected) return NextResponse.next();

  const auth = req.cookies.get("staff_auth");
  if (auth?.value === "1") return NextResponse.next();

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/staff-login";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/kitchen", "/kitchen/:path*", "/admin", "/admin/:path*"],
};
