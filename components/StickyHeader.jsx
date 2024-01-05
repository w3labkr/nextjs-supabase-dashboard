'use client';

import { useLocale, useTranslations } from 'next-intl';
import MuiAppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Link from '@/components/Link';

export default function Header() {
  const locale = useLocale();
  const t = useTranslations('Header');

  return (
    <MuiAppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar>
          <Link href={`/${locale}`} color="inherit" underline="none" noWrap scroll={false}>
            <CameraIcon />
          </Link>
          <div className="grow"></div>
          <Link href={`/${locale}/signin`} color="inherit" underline="none" noWrap className="mr-2">
            {t('signin')}
          </Link>
          <Link href={`/${locale}/signup`} color="inherit" underline="none" noWrap>
            {t('signup')}
          </Link>
        </Toolbar>
      </Container>
    </MuiAppBar>
  );
}
