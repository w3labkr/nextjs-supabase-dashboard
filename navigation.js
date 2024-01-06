import { createLocalizedPathnamesNavigation } from 'next-intl/navigation';
import { locales, pathnames, localePrefix } from './next-intl.config';

export const { Link, redirect, usePathname, useRouter } = createLocalizedPathnamesNavigation({
  locales,
  pathnames,
  localePrefix,
});
