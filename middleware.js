import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isLoginPage = pathname === '/login';
  const isPublic = ['/login', '/register'].includes(pathname);

  // Неавторизованный пользователь — может быть только на публичных страницах
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Авторизован и пытается попасть на /login — перенаправить на /app
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL('/app', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/app/:path*', '/admin/:path*'],
};
