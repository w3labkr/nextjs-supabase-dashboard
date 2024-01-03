// Runtime type checking for React props and similar objects
import PropTypes from 'prop-types';

// Move faster with intuitive React UI tools.
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';

// Utility for creating styled components.
import { Header, Main, Footer } from '@/components/Layout';

function Layout({ children, params: { lng } }) {
  return (
    <>
      <Header lng={lng} />
      <Toolbar />
      <Main>
        <Container maxWidth="xs">{children}</Container>
      </Main>
      <Footer />
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  params: PropTypes.shape({
    lng: PropTypes.string.isRequired,
  }),
};

export default Layout;
