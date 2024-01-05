'use client';

import { useTranslations } from 'next-intl';
import Typography from '@mui/material/Typography';
import Button from '@/components/LinkButton';

export default function Page({ params: { locale } }) {
  const t = useTranslations('SignOutPage');

  return (
    <div className="text-center">
      <div>
        <Typography component="h1" variant="h1">
          {t('title')}
        </Typography>
        <Typography component="p" variant="body" className="whitespace-pre-line mt-6">
          {t('description')}
        </Typography>
      </div>
      <div className="mt-6">
        <Button href={`/${locale}/signin`} variant="outlined" disableElevation>
          {t('button')}
        </Button>
      </div>
    </div>
  );
}
