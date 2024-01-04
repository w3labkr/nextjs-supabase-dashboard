import createMiddleware from 'next-intl/middleware';
import { defaultLocale, locales, localePrefix } from './next-intl.config.js';

export default createMiddleware({
  defaultLocale,
  locales,
  localePrefix,
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
