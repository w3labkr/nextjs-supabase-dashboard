import { Noto_Sans_KR } from 'next/font/google';
import { createTheme } from '@mui/material/styles';

const notoSansKR = Noto_Sans_KR({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  typography: {
    fontFamily: notoSansKR.style.fontFamily,
  },
});

export const lightTheme = createTheme({
  ...theme,
  palette: {
    mode: 'light',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#ffffff',
          color: '#222222',
          boxShadow: '0px 0px 1px 0px rgba(0, 0, 0, 1)',
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  ...theme,
  palette: {
    mode: 'dark',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#121212',
          color: '#ffffff',
          boxShadow: '0px 0px 1px 0px rgba(255, 255, 255, 1)',
        },
      },
    },
  },
});
