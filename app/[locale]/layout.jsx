import { NextIntlClientProvider, useMessages } from 'next-intl';
import useTextDirection from '@/lib/next-intl/useTextDirection';
import { StyledEngineProvider } from '@mui/material/styles';
import MuiProvider from '@/lib/mui/MuiProvider';

export const metadata = {
  title: 'NextJS-Ninja',
  description: 'NextJS app routing starter template that integrates Material-UI, i18next, and Firebase Auth.',
};

export default function LocaleLayout({ children, params: { locale } }) {
  const messages = useMessages();
  const direction = useTextDirection(locale);

  return (
    <html lang={locale} dir={direction}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <StyledEngineProvider injectFirst>
            <MuiProvider defaultMode="light">
              <div id="__next">{children}</div>
            </MuiProvider>
          </StyledEngineProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
