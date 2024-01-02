// Move faster with intuitive React UI tools.
import Typography from '@mui/material/Typography';

export default function Description({
  children,
  variant = 'h5',
  align = 'center',
  color = 'text.secondary',
  paragraph = true,
  ...rest
}) {
  return (
    <Typography variant={variant} align={align} color={color} paragraph={paragraph} {...rest}>
      {children}
    </Typography>
  );
}
