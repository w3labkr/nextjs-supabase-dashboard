// Runtime type checking for React props and similar objects
import PropTypes from 'prop-types';

function Page({ params: { lng } }) {
  return <h1>Welcome</h1>;
}

Page.propTypes = {
  params: PropTypes.shape({
    lng: PropTypes.string.isRequired,
  }),
};

export default Page;
