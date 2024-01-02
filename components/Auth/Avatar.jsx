'use client';

// Move faster with intuitive React UI tools.
import MuiAvatar from '@mui/material/Avatar';
import { styled } from '@mui/system';

// Utility for creating styled components.
const MyAvatar = styled(MuiAvatar)(({ theme }) => ({
  margin: 8,
  backgroundColor: theme.palette.secondary.main,
}));

export default function Avatar({ children, ...rest }) {
  return <MyAvatar {...rest}>{children}</MyAvatar>;
}
