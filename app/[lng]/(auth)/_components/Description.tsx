'use client';

// Move faster with intuitive React UI tools.
import MuiTypography from '@mui/material/Typography';
import { styled } from '@mui/system';

// Utility for creating styled components.
const Typography = styled(MuiTypography)({
  marginTop: 8,
});

export default function Description({ children, ...rest }: { children: React.ReactNode }) {
  return (
    <Typography component="p" variant="body2" {...rest}>
      {children}
    </Typography>
  );
}
