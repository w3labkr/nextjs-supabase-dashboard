// The React Framework.
import NextLink from 'next/link';

// Move faster with intuitive React UI tools.
import MuiLink from '@mui/material/Link';

export default function Link({ children, ...rest }: { children: React.ReactNode }) {
  return (
    <MuiLink component={NextLink} {...rest}>
      {children}
    </MuiLink>
  );
}
