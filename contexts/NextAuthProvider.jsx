'use client';

import PropTypes from 'prop-types';
import { SessionProvider } from 'next-auth/react';

export default function NextAuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}

NextAuthProvider.propTypes = {
  children: PropTypes.any.isRequired,
};
