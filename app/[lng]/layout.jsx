// Runtime type checking for React props and similar objects
import PropTypes from 'prop-types';

// Internationalization
import { dir } from 'i18next';
import { languages } from '@/app/i18n/settings';

// Move faster with intuitive React UI tools.
import MuiProvider from '@/lib/mui/MuiProvider';
import '@/styles/globals.css';

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export const metadata = {
  title: 'NextJS-Ninja',
  description: 'NextJS app routing starter template that integrates Material-UI, i18next, and Firebase Auth.',
};

function RootLayout({ children, params: { lng } }) {
  return (
    <html lang={lng} dir={dir(lng)}>
      <body>
        <MuiProvider defaultMode="light">{children}</MuiProvider>
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
  params: PropTypes.shape({
    lng: PropTypes.string.isRequired,
  }),
};

export default RootLayout;
