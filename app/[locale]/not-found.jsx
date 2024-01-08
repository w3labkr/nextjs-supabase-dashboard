'use client';

import { useRouter } from '@/navigation';
import { useTranslations } from 'next-intl';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Header from '@/components/StickyHeader';
import Main from '@/components/Main';
import Footer from '@/components/StickyFooter';
import Button from '@/components/LinkButton';

// Note that `app/[locale]/[...rest]/page.tsx`
// is necessary for this page to render.

export default function NotFoundPage() {
  const router = useRouter();
  const t = useTranslations('not-found');

  return (
    <>
      <Header />
      <Main className="flex flex-col min-h-screen justify-center items-center">
        <Container>
          <div className="text-center">
            <div>
              <Typography component="h1" variant="h1">
                {t('title')}
              </Typography>
              <Typography component="p" variant="body" className="whitespace-pre-line">
                {t('description')}
              </Typography>
            </div>
            <div className="mt-6">
              <Button onClick={() => router.back()} variant="outlined" className="inline-block mr-2" disableElevation>
                {t('back')}
              </Button>
              <Button onClick={() => router.push('/')} variant="outlined" disableElevation>
                {t('home')}
              </Button>
            </div>
          </div>
        </Container>
      </Main>
      <Footer />
    </>
  );
}
