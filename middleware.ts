import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import acceptLanguage from 'accept-language';
import { fallbackLng, languages, cookieName } from './app/i18n/settings';

acceptLanguage.languages(languages);

// Get the preferred locale, similar to the above or using a library
function getLocale(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let locale = languages.find((v) => pathname.startsWith(`/${v}/`) || pathname === `/${v}`);

  if (request.cookies.has(cookieName)) locale = acceptLanguage.get(request.cookies.get(cookieName)?.value);
  if (!locale) locale = acceptLanguage.get(request.headers.get('Accept-Language'));
  if (!locale) locale = fallbackLng;

  return locale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = getLocale(request);
  const pathnameHasLocale = languages.some((v) => pathname.startsWith(`/${v}/`) || pathname === `/${v}`);

  // Conditional Statements
  if (pathnameHasLocale) return NextResponse.next();
  if (pathname.match(/manifest\.(json|webmanifest)/)) return NextResponse.next();
  if (pathname.startsWith('/robots.txt')) return NextResponse.next();
  if (pathname.startsWith('/sitemap.xml')) return NextResponse.next();
  if (pathname.startsWith('/opengraph-image')) return NextResponse.next();
  if (pathname.startsWith('/twitter-image')) return NextResponse.next();

  if (request.headers.has('referer')) {
    const refererUrl = new URL(request.headers.get('referer') || '');
    const lngInReferer = languages.find((v) => refererUrl.pathname.startsWith(`/${v}`));
    const response = NextResponse.next();
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer);
    return response;
  }

  // Redirect if there is no locale
  return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
}

export const config = {
  /*
   * Match all request paths except for the ones starting with:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico (favicon file)
   */
  matcher: ['/', '/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
