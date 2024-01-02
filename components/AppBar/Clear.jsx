'use client';

// Move faster with intuitive React UI tools.
import MuiBox from '@mui/material/Box';
import { styled } from '@mui/system';

// Utility for creating styled components.
const MyBox = styled(MuiBox)({
  flexGrow: 1,
});

export default function Clear(props) {
  return <MyBox {...props} />;
}
