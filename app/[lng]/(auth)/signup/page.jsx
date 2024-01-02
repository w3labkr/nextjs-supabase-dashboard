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
    router.push(`/${lng}/welcome`);
  };

  return (
    <Container maxWidth="xs">
      <Auth.Wrapper>
        <Auth.Avatar>
          <LockOutlinedIcon />
        </Auth.Avatar>
        <Auth.Title>{t('Sign up')}</Auth.Title>
        <Auth.Form noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField required fullWidth id="email" label={t('Email Address')} name="email" autoComplete="email" />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                type="password"
                id="password"
                name="password"
                label={t('Password')}
                autoComplete="new-password"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                type="password"
                id="confirm-password"
                name="confirm-password"
                label={t('Confirm password')}
                autoComplete="new-password"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="agreeTerms" color="primary" />}
                label={t('Agree to Terms of Service')}
              />
            </Grid>
          </Grid>
          <Auth.Button type="submit">{t('Sign Up')}</Auth.Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Auth.Link href={`/${lng}/signin`}>{t('Already have an account?')}</Auth.Link>
            </Grid>
          </Grid>
        </Auth.Form>
      </Auth.Wrapper>
    </Container>
  );
}
