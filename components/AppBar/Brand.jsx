// The React Framework.
import NextLink from 'next/link';

// Move faster with intuitive React UI tools.
import MuiLink from '@mui/material/Link';

export default function Brand({
  children,
  component = NextLink,
  color = 'inherit',
  underline = 'none',
  noWrap = true,
  ...rest
}) {
  return (
    <MuiLink component={component} color={color} underline={underline} noWrap={noWrap} {...rest}>
      {children}
    </MuiLink>
  );
}
