// Move faster with intuitive React UI tools.
import Typography from '@mui/material/Typography';

export default function Title({ children, component = 'h1', variant = 'h5', ...rest }) {
  return (
    <Typography component={component} variant={variant} {...rest}>
      {children}
    </Typography>
  );
}
