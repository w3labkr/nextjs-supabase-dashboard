// Internationalization
import { dir } from 'i18next';

// Move faster with intuitive React UI tools.
import MuiProvider from '@/lib/mui/MuiProvider';
import '@/styles/globals.css';

export const metadata = {
  title: 'NextJS-Ninja',
  description: 'NextJS app routing starter template that integrates Material-UI, i18next, and Firebase Auth.',
};

export default function RootLayout({ children, params: { lng } }) {
  return (
    <html lang={lng} dir={dir(lng)}>
      <body>
        <MuiProvider defaultMode="light">{children}</MuiProvider>
      </body>
    </html>
  );
}
