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

// React Hooks for form state management and validation (Web + React Native).
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Firebase provides the tools and infrastructure you need to develop, grow, and earn money from your app.
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';

// Internationalization
import { useTranslation } from '@/app/i18n/client';

export default function Page({ params: { lng } }) {
  const router = useRouter();
  const { t } = useTranslation(lng, ['auth', 'firebase']);

  const FormSchema = z.object({
    email: z
      .string()
      .trim()
      .nonempty(t('Email is required'))
      .email({ message: t('Invalid email address') }),
    password: z
      .string()
      .trim()
      .nonempty(t('Password is required'))
      .min(8, { message: t('Must be 8 or more characters long') })
      .max(20, { message: t('Must be 20 or fewer characters long') }),
    rememberMe: z.boolean(),
  });

  const FormValues = {
    email: '',
    password: '',
    rememberMe: false,
  };

  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: FormValues,
  });

  const onSubmit = (data) => {
    const { email, password } = data;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        reset();
        router.push(`/${lng}/dashboard`);
      })
      .catch((error) => {
        // An error happened.
        setError('password', { message: t(`firebase:${error.code}`) });
      });
  };

  return (
    <Container maxWidth="xs">
      <Auth.Wrapper>
        <Auth.Avatar>
          <LockOutlinedIcon />
        </Auth.Avatar>
        <Auth.Title>{t('Sign in')}</Auth.Title>
        <Auth.Form onSubmit={handleSubmit(onSubmit)} noValidate>
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
                helperText={errors.email?.message}
                error={!!errors.email}
                {...register('email')}
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
                helperText={errors.password?.message}
                error={!!errors.password}
                {...register('password')}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox color="primary" />}
                label={t('Remember me')}
                {...register('rememberMe')}
              />
            </Grid>
          </Grid>
          <Auth.Button type="submit" disabled={isSubmitting}>
            {t('Sign In')}
          </Auth.Button>
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
