// Runtime type checking for React props and similar objects
import PropTypes from 'prop-types';

// The React Framework.
import NextLink from 'next/link';

// Move faster with intuitive React UI tools.
import MuiButton from '@mui/material/Button';

function LinkButton({ children, LinkComponent = NextLink, ...rest }) {
  return (
    <MuiButton LinkComponent={LinkComponent} {...rest}>
      {children}
    </MuiButton>
  );
}

LinkButton.propTypes = {
  children: PropTypes.node.isRequired,
  LinkComponent: PropTypes.elementType,
};

export default LinkButton;
