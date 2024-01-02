// Move faster with intuitive React UI tools.
import Typography from '@mui/material/Typography';

export default function Title({
  children,
  component = 'h1',
  variant = 'h2',
  align = 'center',
  color = 'text.primary',
  gutterBottom = true,
  ...rest
}) {
  return (
    <Typography
      component={component}
      variant={variant}
      align={align}
      color={color}
      gutterBottom={gutterBottom}
      {...rest}
    >
      {children}
    </Typography>
  );
}
