'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/navigation';

export function LocaleToggle() {
  const locale = useLocale();
  const otherLocale = locale === 'en' ? 'ko' : 'en';
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <Link href={pathname} locale={otherLocale}>
      {t('language')}: {locale === 'en' ? 'English' : '한국어'}
    </Link>
  );
}
