import NextLink from 'next/link';
import MuiButton from '@mui/material/Button';

export default function LinkButton({ children, LinkComponent = NextLink, ...rest }) {
  return (
    <MuiButton LinkComponent={LinkComponent} {...rest}>
      {children}
    </MuiButton>
  );
}
