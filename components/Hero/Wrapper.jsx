'use client';

// Move faster with intuitive React UI tools.
import MuiContainer from '@mui/material/Container';
import { styled } from '@mui/system';

// Utility for creating styled components.
const Container = styled(MuiContainer)({
  paddingTop: 64,
  paddingBottom: 48,
});

export default function Wrapper({ children, ...rest }) {
  return <Container {...rest}>{children}</Container>;
}
