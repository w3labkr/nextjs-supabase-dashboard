// Runtime type checking for React props and similar objects
import PropTypes from 'prop-types';

// The React Framework.
import NextLink from 'next/link';

// Move faster with intuitive React UI tools.
import MuiLink from '@mui/material/Link';

function Link({ children, component = NextLink, ...rest }) {
  return (
    <MuiLink component={component} {...rest}>
      {children}
    </MuiLink>
  );
}

Link.propTypes = {
  children: PropTypes.node.isRequired,
  component: PropTypes.elementType,
};

export default Link;
