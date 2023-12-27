'use client';

// Move faster with intuitive React UI tools.
import MuiButton from '@mui/material/Button';
import { styled } from '@mui/system';

// Utility for creating styled components.
const Button = styled(MuiButton)({
  marginTop: 24,
  marginBottom: 16,
});

export default function Submit({ children, ...rest }: { children: React.ReactNode }) {
  return (
    <Button type="submit" fullWidth variant="contained" size="large" {...rest}>
      {children}
    </Button>
  );
}
