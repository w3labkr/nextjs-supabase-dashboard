import Container from '@mui/material/Container';
import Header from '@/components/StickyHeader';
import Main from '@/components/Main';
import Footer from '@/components/StickyFooter';
import Nav from './nav';

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <Main className="flex flex-col min-h-screen justify-center items-center">
        <Container maxWidth="xs">
          {children}
          <Nav />
        </Container>
      </Main>
      <Footer />
    </>
  );
}
