import Box from '@mui/material/Box';

export default function Main({ children, component = 'main', ...rest }) {
  return (
    <Box component={component} {...rest}>
      {children}
    </Box>
  );
}
