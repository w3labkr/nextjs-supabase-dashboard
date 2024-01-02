// The React Framework.
import NextLink from 'next/link';

// Move faster with intuitive React UI tools.
import MuiLink from '@mui/material/Link';

export default function Link({ children, component = NextLink, variant = 'body2', ...rest }) {
  return (
    <MuiLink component={component} variant={variant} {...rest}>
      {children}
    </MuiLink>
  );
}
