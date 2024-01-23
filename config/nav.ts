import { NavConfig } from 'types';

export const navConfig: NavConfig = {
  mainNav: [{ title: 'About', href: '/about' }],
  subNav: [
    { title: 'Sign In', href: '/signin' },
    { title: 'Sign Up', href: '/signup' },
    // { title: 'Sign In', href: '/api/auth/signin' },
    // { title: 'Sign Out', href: '/api/auth/signout' },
  ],
};
