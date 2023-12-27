'use client';

// Move faster with intuitive React UI tools.
import Typography from '@mui/material/Typography';

// Utility for creating styled components.
export default function Title({ children, ...rest }: { children: React.ReactNode }) {
  return (
    <Typography component="h1" variant="h5" {...rest}>
      {children}
    </Typography>
  );
}
