import { NextIntlClientProvider, useMessages } from 'next-intl';
import useTextDirection from '@/lib/next-intl/useTextDirection';
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
          <MuiProvider defaultMode="light">{children}</MuiProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
