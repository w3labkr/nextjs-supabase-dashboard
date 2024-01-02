'use client';

// Move faster with intuitive React UI tools.
import MuiAvatar from '@mui/material/Avatar';
import { styled } from '@mui/system';

// Utility for creating styled components.
const MyAvatar = styled(MuiAvatar)({
  margin: 8,
});

export default function Avatar({ children, ...rest }) {
  return (
    <MyAvatar sx={{ bgcolor: 'secondary.main' }} {...rest}>
      {children}
    </MyAvatar>
  );
}
