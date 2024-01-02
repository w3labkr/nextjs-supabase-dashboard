// Move faster with intuitive React UI tools.
import Box from '@mui/material/Box';

function ListItem({ children, ...rest }) {
  return <Box {...rest}>{children}</Box>;
}

export default ListItem;
