import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Header from '@/components/Header';
import Main from '@/components/Main';
import Footer from '@/components/Footer';

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <Toolbar />
      <Main>
        <Container maxWidth="xs">{children}</Container>
      </Main>
      <Footer />
    </>
  );
}
