'use client';

// Runtime type checking for React props and similar objects
import PropTypes from 'prop-types';

// Move faster with intuitive React UI tools.
import Grid from '@mui/material/Grid';

// Utility for creating styled components.
import Link from '@/components/Link';

// Internationalization
import { useTranslation } from '@/app/i18n/client';

function BottomNavigation({ lng }) {
  const { t } = useTranslation(lng, ['auth']);

  return (
    <Grid container sx={{ mt: 2 }}>
      <Grid item xs>
        <Link href={`/${lng}/forgot-password`} variant="body2">
          {t('Forgot password?')}
        </Link>
      </Grid>
      <Grid item>
        <Link href={`/${lng}/signup`} variant="body2">
          {t("Don't have an account?")}
        </Link>
      </Grid>
    </Grid>
  );
}

BottomNavigation.propTypes = {
  lng: PropTypes.string.isRequired,
};

export default BottomNavigation;
