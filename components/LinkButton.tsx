// The React Framework.
import NextLink from 'next/link';

// Move faster with intuitive React UI tools.
import MuiButton from '@mui/material/Button';

export default function Button({ children, ...rest }: { children: React.ReactNode }) {
  return (
    <MuiButton LinkComponent={NextLink} {...rest}>
      {children}
    </MuiButton>
  );
}
