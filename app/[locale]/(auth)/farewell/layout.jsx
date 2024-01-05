import Container from '@mui/material/Container';
import Header from '@/components/StickyHeader';
import Main from '@/components/Main';
import Footer from '@/components/StickyFooter';

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <Main className="flex flex-col min-h-screen justify-center items-center">
        <Container>{children}</Container>
      </Main>
      <Footer />
    </>
  );
}
