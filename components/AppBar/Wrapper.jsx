'use client';

// Move faster with intuitive React UI tools.
import MuiToolbar from '@mui/material/Toolbar';
import { styled } from '@mui/system';

// Utility for creating styled components.
const Toolbar = styled(MuiToolbar)({
  backgroundColor: 'inherit',
});

export default function Wrapper({ children, ...rest }) {
  return <Toolbar {...rest}>{children}</Toolbar>;
}
