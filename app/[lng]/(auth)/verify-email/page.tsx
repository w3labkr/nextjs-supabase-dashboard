'use client';

// The React Framework.
import { useRouter } from 'next/navigation';

// Move faster with intuitive React UI tools.
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Container from '@mui/material/Container';

// Utility for creating styled components.
import Wrapper from '../_components/Wrapper';
import Form from '../_components/Form';
import Title from '../_components/Title';
import Description from '../_components/Description';
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
      verificationCode: data.get('verification-code'),
    });
    router.push(`/${lng}/reset-password`);
  };

  return (
    <Container maxWidth="xs">
      <Wrapper>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Title>{t('Verify your email')}</Title>
        <Description>{t('Enter the verification code received by email.')}</Description>
        <Form onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="verification-code"
                name="verification-code"
                label={t('Verification code')}
                autoFocus
              />
            </Grid>
          </Grid>
          <Submit>{t('Continue')}</Submit>
          <Grid container>
            <Grid item xs>
              <Link href={`/${lng}/signup`}>{t("Don't have an account?")}</Link>
            </Grid>
          </Grid>
        </Form>
      </Wrapper>
    </Container>
  );
}
