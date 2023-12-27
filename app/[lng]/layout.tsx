// The React Framework.
import type { Metadata } from 'next';

// Internationalization
import { dir } from 'i18next';

// Move faster with intuitive React UI tools.
import MuiProvider from '@/lib/mui/MuiProvider';
import packageJSON from '@/package.json';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: packageJSON.name,
  description: packageJSON.description,
  keywords: packageJSON.keywords,
};

export default function RootLayout({
  children,
  params: { lng },
}: {
  children: React.ReactNode;
  params: { lng: string };
}) {
  return (
    <html lang={lng} dir={dir(lng)}>
      <body>
        <MuiProvider defaultMode="light">{children}</MuiProvider>
      </body>
    </html>
  );
}
