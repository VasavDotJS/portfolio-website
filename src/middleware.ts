import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isDashboard = req.nextUrl.pathname.startsWith('/admin/dashboard');

  if (isDashboard && !isLoggedIn) {
    return NextResponse.redirect(new URL('/admin/login', req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/admin/dashboard/:path*'],
};
