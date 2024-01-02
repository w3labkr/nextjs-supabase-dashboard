'use client';

// The React Framework.
import { useRouter } from 'next/navigation';

// Move faster with intuitive React UI tools.
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
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
      password: data.get('password'),
    });
    router.push(`/${lng}/dashboard`);
  };

  return (
    <Container maxWidth="xs">
      <Auth.Wrapper>
        <Auth.Avatar>
          <LockOutlinedIcon />
        </Auth.Avatar>
        <Auth.Title>{t('Sign in')}</Auth.Title>
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
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                type="password"
                id="password"
                name="password"
                label={t('Password')}
                autoComplete="current-password"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel control={<Checkbox value="remember" color="primary" />} label={t('Remember me')} />
            </Grid>
          </Grid>
          <Auth.Button type="submit">{t('Sign In')}</Auth.Button>
          <Grid container>
            <Grid item xs>
              <Auth.Link href={`/${lng}/forgot-password`}>{t('Forgot password?')}</Auth.Link>
            </Grid>
            <Grid item>
              <Auth.Link href={`/${lng}/signup`}>{t("Don't have an account?")}</Auth.Link>
            </Grid>
          </Grid>
        </Auth.Form>
      </Auth.Wrapper>
    </Container>
  );
}
