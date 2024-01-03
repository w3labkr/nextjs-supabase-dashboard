'use client';

// Runtime type checking for React props and similar objects
import PropTypes from 'prop-types';

// The React Framework.
import { useRouter } from 'next/navigation';

// React Hooks for form state management and validation (Web + React Native).
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema, defaultValues } from './schema';

// Firebase provides the tools and infrastructure you need to develop, grow, and earn money from your app.
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

// Internationalization
import { useTranslation } from '@/app/i18n/client';

// Move faster with intuitive React UI tools.
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

// Utility for creating styled components.
import Input from '@/components/Input';

function Form({ lng }) {
  const router = useRouter();
  const { t } = useTranslation(lng, ['auth', 'firebase']);

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const onSubmit = (data) => {
    const { email } = data;

    console.log(data);

    router.push(`/${lng}/verify-email`);
  };

  return (
    <Box noValidate component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
      <Typography component="h1" variant="h5" align="center">
        {t('Forgot password?')}
      </Typography>
      <Typography component="p" variant="body2" align="center" sx={{ marginTop: 1 }}>
        {t('Enter your email address to receive a verification code.')}
      </Typography>
      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Grid item xs={12}>
          <Input
            required
            control={control}
            type="email"
            name="email"
            label={t('Email Address')}
            autoComplete="email"
            autoFocus
            fullWidth
          />
        </Grid>
      </Grid>
      <Button type="submit" disabled={isSubmitting} variant="contained" size="large" fullWidth sx={{ mt: 3 }}>
        {t('Continue')}
      </Button>
    </Box>
  );
}

Form.propTypes = {
  lng: PropTypes.string.isRequired,
};

export default Form;
