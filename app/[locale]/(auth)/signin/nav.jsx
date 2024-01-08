'use client';

import { useTranslations } from 'next-intl';
import Link from '@/components/Link';

export default function Nav() {
  const t = useTranslations('AuthNav');

  return (
    <div className="flex justify-between items-center mt-3">
      <Link href="/forgot-password" variant="body2">
        {t('forgot-password')}
      </Link>
      <Link href="/signup" variant="body2">
        {t('signup')}
      </Link>
    </div>
  );
}
