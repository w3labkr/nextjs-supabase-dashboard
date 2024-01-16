import { createLocalizedPathnamesNavigation } from 'next-intl/navigation';
import { locales, localePrefix, pathnames } from '@/next-intl.config';

/**
 * Next.js App Router internationalized navigation
 *
 * @link https://next-intl-docs.vercel.app/docs/routing/navigation
 */
export const { Link, redirect, useRouter, usePathname } =
  createLocalizedPathnamesNavigation({
    locales,
    localePrefix,
    pathnames,
  });
