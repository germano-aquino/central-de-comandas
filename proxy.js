import { NextResponse } from "next/server";

export default function proxy(request) {
  const headers = new Headers(request.headers);

  if (!isAuthenticated(headers))
    return NextResponse.redirect(new URL("/login", request.url));
  return NextResponse.next();

  function isAuthenticated(headers) {
    const cookie = headers.get("cookie");
    if (!cookie) return false;
    const token = cookie.match("(?<=session_id=)[\\da-fA-F]{64}");
    return !!token;
  }
}

export const config = {
  matcher: ["/", "/((?!api|login|_next/static|_next/image|.*\\.png$).*)"],
};
