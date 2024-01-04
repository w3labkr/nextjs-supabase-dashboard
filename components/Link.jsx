import NextLink from 'next/link';
import MuiLink from '@mui/material/Link';

export default function Link({ children, component = NextLink, ...rest }) {
  return (
    <MuiLink component={component} {...rest}>
      {children}
    </MuiLink>
  );
}
