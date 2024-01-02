import { NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';
import { fallbackLng, languages, cookieName } from './app/i18n/settings';

acceptLanguage.languages(languages);

// Get the preferred locale, similar to the above or using a library
function getLocale(request) {
  const { pathname } = request.nextUrl;
  let locale;

  locale = languages.find((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);
  if (request.cookies.has(cookieName)) locale = acceptLanguage.get(request.cookies.get(cookieName)?.value);
  if (!locale) locale = acceptLanguage.get(request.headers.get('Accept-Language'));
  if (!locale) locale = fallbackLng;

  return locale;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const locale = getLocale(request);
  const pathnameHasLocale = languages.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);
  const pathnameHasSlug = (slug) => pathname.startsWith(`/${locale}${slug}`) || pathname.startsWith(`${slug}`);

  // Redirect the user to another URL
  // if (pathnameHasSlug('/about')) {
  //   return NextResponse.redirect(new URL(`/${locale}`, request.url));
  // }

  if (pathnameHasLocale) return NextResponse.next();

  if (request.headers.has('referer')) {
    const refererUrl = new URL(request.headers.get('referer') || '');
    const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`));
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
   * - etc
   */
  matcher: ['/', '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|manifest.webmanifest).*)'],
};
