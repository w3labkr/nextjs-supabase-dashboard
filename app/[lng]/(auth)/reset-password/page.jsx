// Runtime type checking for React props and similar objects
import PropTypes from 'prop-types';

// Move faster with intuitive React UI tools.
import Box from '@mui/material/Box';

// Utility for creating styled components.
import Form from './Form';
import BottomNavigation from './BottomNavigation';

function Page({ params: { lng } }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 12,
      }}
    >
      <Form lng={lng} />
      <BottomNavigation lng={lng} />
    </Box>
  );
}

Page.propTypes = {
  params: PropTypes.shape({
    lng: PropTypes.string.isRequired,
  }),
};

export default Page;
