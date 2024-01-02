'use client';

// The library for web and native user interfaces.
import * as React from 'react';

// The React Framework.
import { useRouter } from 'next/navigation';

// Move faster with intuitive React UI tools.
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

// Utility for creating styled components.
import { Auth } from '@/components/Auth';

// Internationalization
import { useTranslation } from '@/app/i18n/client';

export default function Page({ params: { lng } }) {
  const router = useRouter();
  const { t } = useTranslation(lng, 'auth');

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
    });
    router.push(`/${lng}/verify-email`);
  };

  return (
    <Container maxWidth="xs">
      <Auth.Wrapper>
        <Auth.Avatar>
          <LockOutlinedIcon />
        </Auth.Avatar>
        <Auth.Title>{t('Forgot password?')}</Auth.Title>
        <Auth.Description>{t('Enter your email address to receive a verification code.')}</Auth.Description>
        <Auth.Form onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                name="email"
                label={t('Email Address')}
                autoComplete="email"
                autoFocus
              />
            </Grid>
          </Grid>
          <Auth.Button type="submit">{t('Continue')}</Auth.Button>
          <Grid container>
            <Grid item xs>
              <Auth.Link href={`/${lng}/signup`}>{t("Don't have an account?")}</Auth.Link>
            </Grid>
          </Grid>
        </Auth.Form>
      </Auth.Wrapper>
    </Container>
  );
}
