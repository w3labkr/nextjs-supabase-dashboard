import { Link as NextIntlLink } from '@/navigation';
import MuiButton from '@mui/material/Button';

export default function LinkButton({ children, LinkComponent = NextIntlLink, ...rest }) {
  return (
    <MuiButton LinkComponent={LinkComponent} {...rest}>
      {children}
    </MuiButton>
  );
}
