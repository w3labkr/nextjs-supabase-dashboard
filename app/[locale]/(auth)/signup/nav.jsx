'use client';

import { useLocale, useTranslations } from 'next-intl';
import Link from '@/components/Link';

export default function Nav() {
  const locale = useLocale();
  const t = useTranslations('AuthNavigation');

  return (
    <div className="flex justify-between items-center mt-3">
      <Link href={`/${locale}/signin`} variant="body2">
        {t('signin')}
      </Link>
    </div>
  );
}
