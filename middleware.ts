import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from '@/lib/i18n/config';

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    // Allow login page
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Check session
    const session = request.cookies.get('session');
    
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Handle i18n for non-admin routes
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
    return intlMiddleware(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/(pt|en)/:path*', '/admin/:path*', '/((?!_next|_vercel|.*\\..*).*)'],
};