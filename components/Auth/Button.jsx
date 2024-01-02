'use client';

// Move faster with intuitive React UI tools.
import MuiButton from '@mui/material/Button';
import { styled } from '@mui/system';

// Utility for creating styled components.
const MyButton = styled(MuiButton)({
  marginTop: 24,
  marginBottom: 16,
});

export default function Button({ children, variant = 'contained', size = 'large', fullWidth = true, ...rest }) {
  return (
    <MyButton variant={variant} size={size} fullWidth={fullWidth} {...rest}>
      {children}
    </MyButton>
  );
}
