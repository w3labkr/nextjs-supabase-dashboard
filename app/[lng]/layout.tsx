import type { Metadata } from 'next';
import { dir } from 'i18next';
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
        <MuiProvider>{children}</MuiProvider>
      </body>
    </html>
  );
}
