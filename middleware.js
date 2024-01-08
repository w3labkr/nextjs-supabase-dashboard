import createMiddleware from 'next-intl/middleware';
import { defaultLocale, locales, localePrefix, pathnames } from './next-intl.config';

export default createMiddleware({
  defaultLocale,
  localePrefix,
  locales,
  pathnames,
});

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(ko|en)/:path*',

    // Enable redirects that add missing locales
    // (e.g. `/pathnames` -> `/en/pathnames`)
    '/((?!api|_next|.*\\..*).*)',
  ],
};
