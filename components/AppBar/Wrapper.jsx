// Move faster with intuitive React UI tools.
import Toolbar from '@mui/material/Toolbar';

export default function Wrapper({ children, ...rest }) {
  return (
    <Toolbar sx={{ bgcolor: 'background.paper' }} {...rest}>
      {children}
    </Toolbar>
  );
}
