'use client';

import { useTranslations } from 'next-intl';
import Link from '@/components/Link';

export default function Nav() {
  const t = useTranslations('AuthNav');

  return (
    <div className="flex justify-between items-center mt-3">
      <Link href="/signin" variant="body2">
        {t('signin')}
      </Link>
    </div>
  );
}
