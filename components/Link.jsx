import { Link as NextIntlLink } from '@/navigation';
import MuiLink from '@mui/material/Link';

export default function Link({ children, component = NextIntlLink, ...rest }) {
  return (
    <MuiLink component={component} {...rest}>
      {children}
    </MuiLink>
  );
}
