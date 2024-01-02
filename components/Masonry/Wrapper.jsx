// Move faster with intuitive React UI tools.
import Container from '@mui/material/Container';

function Wrapper({ children, ...rest }) {
  return <Container {...rest}>{children}</Container>;
}

export default Wrapper;
