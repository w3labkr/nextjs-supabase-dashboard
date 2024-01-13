import { NextIntlClientProvider, useMessages } from 'next-intl';
import useTextDirection from '@/hooks/useTextDirection';
import MuiThemeProvider from '@/contexts/MuiThemeProvider';
import NextAuthProvider from '@/contexts/NextAuthProvider';

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
        <NextAuthProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <MuiThemeProvider defaultMode="light">
              {/* <div id="__next">{children}</div> */}
              {children}
            </MuiThemeProvider>
          </NextIntlClientProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
