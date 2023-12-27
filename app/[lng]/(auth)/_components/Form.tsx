'use client';

// Move faster with intuitive React UI tools.
import MuiBox from '@mui/material/Box';
import { styled } from '@mui/system';

// Utility for creating styled components.
const Box = styled(MuiBox)({
  width: '100%',
  marginTop: 24,
});

export default function Form({ children, ...rest }: { children: React.ReactNode }) {
  return (
    <Box component="form" {...rest}>
      {children}
    </Box>
  );
}
