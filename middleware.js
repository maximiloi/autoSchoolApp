import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname === '/';
  const isAdminPage = pathname.startsWith('/admin');

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/app', req.url));
  }

  if (isAdminPage && token.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/app', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/app/:path*', '/admin/:path*', '/api/:path'],
};
