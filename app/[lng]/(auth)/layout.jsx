// Move faster with intuitive React UI tools.
import Toolbar from '@mui/material/Toolbar';

// Utility for creating styled components.
import { Header, Main, Footer } from '@/components/Layout';

function Layout({ children, params: { lng } }) {
  return (
    <>
      <Header lng={lng} />
      <Toolbar />
      <Main>{children}</Main>
      <Footer />
    </>
  );
}

export default Layout;
