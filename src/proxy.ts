import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/login")) {
    if (req.cookies.has("access_token") && req.cookies.get("access_token")?.value !== "") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }
  if (!req.cookies.has("access_token") || req.cookies.get("access_token")?.value === "") {
    req.cookies.delete("access_token");
    return NextResponse.redirect(new URL(`${req.nextUrl.pathname}${req.nextUrl.search}`, `${process.env.NEXT_PUBLIC_HTTP_SECURE === "true" ? "https" : "http"}://${process.env.NEXT_PUBLIC_DOMAIN}/login`));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|registrasi).*)"],
};
