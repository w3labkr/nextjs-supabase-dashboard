'use client';

// The React Framework.
import NextLink from 'next/link';

// Move faster with intuitive React UI tools.
import MuiButton from '@mui/material/Button';
import { styled } from '@mui/system';

// Utility for creating styled components.
const MyButton = styled(MuiButton)({
  whiteSpace: 'nowrap',
  minWidth: 'auto',
});

export default function LinkButton({ children, LinkComponent = NextLink, color = 'inherit', ...rest }) {
  return (
    <MyButton LinkComponent={LinkComponent} color={color} {...rest}>
      {children}
    </MyButton>
  );
}
