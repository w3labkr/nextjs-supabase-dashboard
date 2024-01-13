'use client';

import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import MuiAppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import Link from '@/components/Link';

export default function StickyHeader() {
  const { data: session, status } = useSession();
  const t = useTranslations('AppBar');

  // console.log(status);
  // console.log(session);

  return (
    <MuiAppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link href="/" color="inherit" underline="none" noWrap scroll={false}>
            <CameraIcon />
          </Link>
          <div className="grow"></div>
          <Link href="/signin" color="inherit" underline="none" noWrap className="mr-2">
            {t('signin')}
          </Link>
          <Link href="/signup" color="inherit" underline="none" noWrap>
            {t('signup')}
          </Link>
        </Toolbar>
      </Container>
    </MuiAppBar>
  );
}
