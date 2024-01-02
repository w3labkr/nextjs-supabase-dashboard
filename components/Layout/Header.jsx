'use client';

// Move faster with intuitive React UI tools.
import MuiAppBar from '@mui/material/AppBar';

// Utility for creating styled components.
import { AppBar } from '@/components/AppBar';

// Internationalization
import { useTranslation } from '@/app/i18n/client';

export default function Header({ lng }) {
  const { t } = useTranslation(lng);

  return (
    <MuiAppBar position="fixed">
      <AppBar.Wrapper>
        <AppBar.Logo />
        <AppBar.Brand href={`/${lng}`}>NextJS</AppBar.Brand>
        <AppBar.Clear />
        <AppBar.LinkButton href={`/${lng}/signin`} style={{ marginRight: 4 }}>
          {t('SignIn')}
        </AppBar.LinkButton>
        <AppBar.LinkButton href={`/${lng}/signup`}>{t('SignUp')}</AppBar.LinkButton>
      </AppBar.Wrapper>
    </MuiAppBar>
  );
}
