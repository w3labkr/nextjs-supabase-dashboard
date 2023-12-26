'use client';

import NextLink from 'next/link';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import CameraIcon from '@mui/icons-material/PhotoCamera';
import { useTranslation } from '@/app/i18n/client';

export default function Header({ lng }: { lng: string }) {
  const { t } = useTranslation(lng);

  return (
    <AppBar position="fixed">
      <Toolbar>
        <CameraIcon sx={{ mr: 2 }} />
        <Link href={`/${lng}`} component={NextLink} color="inherit" underline="none" noWrap>
          NextJS
        </Link>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          href={`/${lng}/signin`}
          LinkComponent={NextLink}
          color="inherit"
          style={{ marginRight: 4, whiteSpace: 'nowrap', minWidth: 'auto' }}
        >
          {t('SignIn')}
        </Button>
        <Button
          href={`/${lng}/signup`}
          LinkComponent={NextLink}
          color="inherit"
          style={{ whiteSpace: 'nowrap', minWidth: 'auto' }}
        >
          {t('SignUp')}
        </Button>
      </Toolbar>
    </AppBar>
  );
}
