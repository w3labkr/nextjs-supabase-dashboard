// The React Framework.
import NextLink from 'next/link';

// Move faster with intuitive React UI tools.
import MuiLink from '@mui/material/Link';

export default function Link({ children, component = NextLink, color = 'inherit', ...rest }) {
  return (
    <MuiLink component={component} color={color} {...rest}>
      {children}
    </MuiLink>
  );
}
