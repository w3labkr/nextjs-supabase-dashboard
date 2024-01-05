'use client';

import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ToggleColorMode from '@/lib/mui/ToggleColorMode';

export default function Footer() {
  const theme = useTheme();
  const style =
    theme.palette.mode === 'light'
      ? { boxShadow: '0px 0px 1px 0px rgba(0, 0, 0, 1)' }
      : { boxShadow: '0px 0px 1px 0px rgba(255, 255, 255, 1)' };

  return (
    <footer className="py-6" style={style}>
      <Container maxWidth="xl">
        <ToggleColorMode className="mr-2" />
        <Typography variant="body2" color="text.secondary" align="center">
          &copy; {' 2023-2024. '}
        </Typography>
      </Container>
    </footer>
  );
}
