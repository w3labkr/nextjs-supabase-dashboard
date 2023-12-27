'use client';

// Move faster with intuitive React UI tools.
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import CameraIcon from '@mui/icons-material/PhotoCamera';

// Utility for creating styled components.
import Link from '@/components/Link';
import LinkButton from '@/components/LinkButton';

// Internationalization
import { useTranslation } from '@/app/i18n/client';

export default function Header({ lng }: { lng: string }) {
  const { t } = useTranslation(lng);

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ bgcolor: 'background.paper' }}>
        <CameraIcon sx={{ mr: 2 }} />
        <Link href={`/${lng}`} color="inherit" underline="none" noWrap>
          NextJS
        </Link>
        <Box sx={{ flexGrow: 1 }} />
        <LinkButton
          href={`/${lng}/signin`}
          color="inherit"
          style={{ marginRight: 4, whiteSpace: 'nowrap', minWidth: 'auto' }}
        >
          {t('SignIn')}
        </LinkButton>
        <LinkButton href={`/${lng}/signup`} color="inherit" style={{ whiteSpace: 'nowrap', minWidth: 'auto' }}>
          {t('SignUp')}
        </LinkButton>
      </Toolbar>
    </AppBar>
  );
}
