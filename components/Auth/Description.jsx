'use client';

// Move faster with intuitive React UI tools.
import MuiTypography from '@mui/material/Typography';
import { styled } from '@mui/system';

// Utility for creating styled components.
const MyTypography = styled(MuiTypography)({
  marginTop: 8,
});

export default function Description({ children, component = 'p', variant = 'body2', ...rest }) {
  return (
    <MyTypography component={component} variant={variant} {...rest}>
      {children}
    </MyTypography>
  );
}
