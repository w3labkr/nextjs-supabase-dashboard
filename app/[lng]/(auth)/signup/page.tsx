'use client';

// The React Framework.
import { useRouter } from 'next/navigation';

// Move faster with intuitive React UI tools.
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
// import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Container from '@mui/material/Container';

// Utility for creating styled components.
import Wrapper from '../_components/Wrapper';
import Form from '../_components/Form';
import Title from '../_components/Title';
import Submit from '../_components/Submit';
import Link from '../_components/Link';

// Internationalization
import { useTranslation } from '@/app/i18n/client';

export default function Page({ params: { lng } }: { params: { lng: string } }) {
  const router = useRouter();
  const { t } = useTranslation(lng, 'auth');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
      <Wrapper>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Title>{t('Sign up')}</Title>
        <Form noValidate onSubmit={handleSubmit}>
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
          <Submit>{t('Sign Up')}</Submit>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href={`/${lng}/signin`}>{t('Already have an account?')}</Link>
            </Grid>
          </Grid>
        </Form>
      </Wrapper>
    </Container>
  );
}
