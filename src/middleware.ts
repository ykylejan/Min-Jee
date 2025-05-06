import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;

  // Only do redirect logic on login or signup pages if user is authenticated
  if ((pathname === "/login" || pathname === "/signup") && token) {
    try {
      const { payload } = await jwtVerify(token, secret);
      const role = payload.role as "customer" | "owner";

      if (role === "owner") {
        return NextResponse.redirect(new URL("/orders", request.url));
      }

      if (role === "customer") {
        return NextResponse.redirect(new URL("/account", request.url));
      }
    } catch {
      // Token invalid or expired: let them proceed to login/signup
      return NextResponse.next();
    }
  }

  // Publicly accessible routes
  const publicPaths = [
    "/",
    "/login",
    "/signup",
    "/otp",
    "/otp-success",
    "/about-us",
  ];
  const isPublic = publicPaths.includes(pathname) || pathname.startsWith("/shop");

  if (isPublic) {
    return NextResponse.next();
  }

  // No token = redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    const role = payload.role as "customer" | "owner";

    const isCustomerRoute =
      pathname.startsWith("/account") ||
      pathname.startsWith("/checkout") ||
      pathname.startsWith("/receipt");

    const isOwnerRoute = [
      "/orders",
      "/products",
      "/customers",
      "/partners",
      "/calendar",
      "/history",
    ].some((prefix) => pathname.startsWith(prefix));

    if (isCustomerRoute && role !== "customer") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (isOwnerRoute && role !== "owner") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/account",
    "/checkout",
    "/receipt",
    "/orders/:path*",
    "/products/:path*",
    "/customers/:path*",
    "/partners/:path*",
    "/calendar",
    "/history",
    "/login",
    "/signup",
  ],
};
