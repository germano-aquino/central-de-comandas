import { NextResponse } from "next/server";

export default function proxy(request) {
  const isAuthenticated = !!request.cookies?.get("session_id")?.value;

  if (!isAuthenticated)
    return NextResponse.redirect(new URL("/login", request.url));
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/((?!api|login|_next/static|_next/image|.*\\.png$).*)"],
};
