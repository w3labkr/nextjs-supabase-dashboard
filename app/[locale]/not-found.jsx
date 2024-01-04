'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MuiButton from '@mui/material/Button';
import Button from '@/components/LinkButton';

// Note that `app/[locale]/[...rest]/page.tsx`
// is necessary for this page to render.

export default function NotFoundPage() {
  const router = useRouter();
  const t = useTranslations('NotFoundPage');

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Typography variant="h1">404</Typography>
      <Typography variant="body">{t('description')}</Typography>
      <Box sx={{ mt: 3 }}>
        <MuiButton onClick={() => router.back()} variant="outlined" sx={{ mr: 1 }} disableElevation>
          {t('back')}
        </MuiButton>
        <Button href="/" variant="outlined" disableElevation>
          {t('home')}
        </Button>
      </Box>
    </Box>
  );
}
