'use client';

import { useLocale, useTranslations } from 'next-intl';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Link from '@/components/Link';

export default function Header() {
  const locale = useLocale();
  const t = useTranslations('Header');

  return (
    <MuiAppBar position="fixed">
      <Toolbar sx={{ bgcolor: 'inherit' }}>
        <CameraIcon sx={{ marginRight: 2 }} />
        <Link href={`/${locale}`} color="inherit" underline="none" noWrap>
          NextJS
        </Link>
        <Box sx={{ flexGrow: 1 }} />
        <Link href={`/${locale}/signin`} color="inherit" underline="none" noWrap sx={{ marginRight: 1 }}>
          {t('signin')}
        </Link>
        <Link href={`/${locale}/signup`} color="inherit" underline="none" noWrap>
          {t('signup')}
        </Link>
      </Toolbar>
    </MuiAppBar>
  );
}
