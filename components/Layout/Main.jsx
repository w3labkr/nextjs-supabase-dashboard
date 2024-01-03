// Runtime type checking for React props and similar objects
import PropTypes from 'prop-types';

// Move faster with intuitive React UI tools.
import Box from '@mui/material/Box';

function Main({ children, component = 'main', ...rest }) {
  return (
    <Box component={component} {...rest}>
      {children}
    </Box>
  );
}

Main.propTypes = {
  children: PropTypes.node.isRequired,
  component: PropTypes.elementType,
};

export default Main;
