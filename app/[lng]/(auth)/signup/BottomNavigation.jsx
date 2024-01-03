'use client';

// Runtime type checking for React props and similar objects
import PropTypes from 'prop-types';

// Internationalization
import { useTranslation } from '@/app/i18n/client';

// Move faster with intuitive React UI tools.
import Grid from '@mui/material/Grid';

// Utility for creating styled components.
import Link from '@/components/Link';

function BottomNavigation({ lng }) {
  const { t } = useTranslation(lng, ['auth']);

  return (
    <Grid container sx={{ mt: 2 }}>
      <Grid item>
        <Link href={`/${lng}/signin`} variant="body2">
          {t('Already have an account?')}
        </Link>
      </Grid>
    </Grid>
  );
}

BottomNavigation.propTypes = {
  lng: PropTypes.string.isRequired,
};

export default BottomNavigation;
