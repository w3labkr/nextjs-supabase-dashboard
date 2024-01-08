'use client';

import { useTranslations } from 'next-intl';
import Typography from '@mui/material/Typography';
import Button from '@/components/LinkButton';

export default function Page() {
  const t = useTranslations('auth/welcome');

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
        <Button href="/signin" variant="outlined" disableElevation>
          {t('button')}
        </Button>
      </div>
    </div>
  );
}
