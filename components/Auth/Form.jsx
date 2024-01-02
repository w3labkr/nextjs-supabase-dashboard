'use client';

// Move faster with intuitive React UI tools.
import MuiBox from '@mui/material/Box';
import { styled } from '@mui/system';

// Utility for creating styled components.
const MyBox = styled(MuiBox)({
  width: '100%',
  marginTop: 24,
});

export default function Form({ children, component = 'form', ...rest }) {
  return (
    <MyBox component={component} {...rest}>
      {children}
    </MyBox>
  );
}
