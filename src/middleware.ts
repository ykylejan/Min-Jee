// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { jwtDecode } from 'jwt-decode'

// Tell Next.js which paths use middleware
export const config = {
  matcher: [
    '/customer/root/:path*',      // Protect customer pages (account, checkout, receipt)
    '/customer/auth/otp/:path*',  // (Optional) If you need special auth
    '/owner/:path*',              // Protect owner (admin) pages
  ],
}

interface TokenPayload {
  role: 'customer' | 'owner'
  exp: number
}

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get('accessToken')?.value

  // Public paths (no token needed)
  const publicPaths = [
    '/customer/root/shop',    // Shop page is PUBLIC
    '/customer/auth/login',   // Login page
    '/customer/auth/signup',  // Signup page
    '/customer/auth/otp',     // OTP page
    '/customer/auth/otp-success',
    '/',
  ]

  const { pathname } = req.nextUrl

  // 1. If path is public, allow
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // 2. If no token, redirect to login
  if (!accessToken) {
    const loginUrl = new URL('/customer/auth/login', req.url)
    return NextResponse.redirect(loginUrl)
  }

  let decoded: TokenPayload

  try {
    decoded = jwtDecode(accessToken)
  } catch (err) {
    console.error('Invalid token')
    const loginUrl = new URL('/customer/auth/login', req.url)
    return NextResponse.redirect(loginUrl)
  }

  const { role, exp } = decoded

  // 3. Token expired
  const now = Math.floor(Date.now() / 1000)
  if (exp < now) {
    const loginUrl = new URL('/customer/auth/login', req.url)
    return NextResponse.redirect(loginUrl)
  }
  
  // 4. Role-based redirection
  if (pathname.startsWith('/owner') && role !== 'owner') {
    // If a customer tries to access owner routes
    return NextResponse.redirect(new URL('/customer/root/shop', req.url))
  }

  if (pathname.startsWith('/customer') && role !== 'customer') {
    // If an owner tries to access customer routes (except public ones)
    return NextResponse.redirect(new URL('/owner/orders', req.url))
  }

  return NextResponse.next()
}
