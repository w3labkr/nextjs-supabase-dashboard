'use client';

// Move faster with intuitive React UI tools.
import MuiBox from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';

// Utility for creating styled components.
const MyBox = styled(MuiBox)({
  paddingTop: 48,
});

export default function Footer() {
  return (
    <MyBox component="footer">
      <Typography variant="body2" color="text.secondary" align="center">
        &copy; {' 2023-2024. '}
      </Typography>
    </MyBox>
  );
}
