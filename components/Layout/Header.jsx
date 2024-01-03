'use client';

// Runtime type checking for React props and similar objects
import PropTypes from 'prop-types';

// Move faster with intuitive React UI tools.
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CameraIcon from '@mui/icons-material/PhotoCamera';

// Utility for creating styled components.
import Link from '@/components/Link';

// Internationalization
import { useTranslation } from '@/app/i18n/client';

function Header({ lng }) {
  const { t } = useTranslation(lng);

  return (
    <MuiAppBar position="fixed">
      <Toolbar sx={{ bgcolor: 'inherit' }}>
        <CameraIcon sx={{ marginRight: 2 }} />
        <Link href={`/${lng}`} color="inherit" underline="none" noWrap>
          NextJS
        </Link>
        <Box sx={{ flexGrow: 1 }} />
        <Link href={`/${lng}/signin`} color="inherit" underline="none" noWrap sx={{ marginRight: 1 }}>
          {t('SignIn')}
        </Link>
        <Link href={`/${lng}/signup`} color="inherit" underline="none" noWrap>
          {t('SignUp')}
        </Link>
      </Toolbar>
    </MuiAppBar>
  );
}

Header.propTypes = {
  lng: PropTypes.string.isRequired,
};

export default Header;
