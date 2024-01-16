'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/navigation';

export function LocaleToggle() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();
  const otherLocale = locale === 'en' ? 'ko' : 'en';
  const pathname = usePathname();

  return (
    <Link href={pathname} locale={otherLocale}>
      {t('switchLocale', { locale: otherLocale })}
    </Link>
  );
}
