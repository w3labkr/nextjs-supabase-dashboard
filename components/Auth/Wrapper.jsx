'use client';

// Move faster with intuitive React UI tools.
import MuiBox from '@mui/material/Box';
import { styled } from '@mui/system';

// Utility for creating styled components.
const MyBox = styled(MuiBox)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: 64,
});

export default function Wrapper({ children, ...rest }) {
  return <MyBox {...rest}>{children}</MyBox>;
}
