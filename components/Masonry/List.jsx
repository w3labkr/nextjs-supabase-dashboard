'use client';

// Move faster with intuitive React UI tools.
import Masonry from '@mui/lab/Masonry';

function List({ children, ...rest }) {
  return <Masonry {...rest}>{children}</Masonry>;
}

export default List;
