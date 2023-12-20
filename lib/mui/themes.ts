import { createTheme } from '@mui/material/styles';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
});

export const lightTheme = createTheme({
  ...theme,
  palette: {
    mode: 'light',
  },
});

export const darkTheme = createTheme({
  ...theme,
  palette: {
    mode: 'dark',
  },
});
