import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Header from '@/components/Header.tsx';
import Footer from '@/components/Footer.tsx';
import BackToTop from '@/components/BackToTop.tsx';
import Hero from '@/components/Hero.tsx';
import Media from '@/components/Media.tsx';

export default function RootPage({ params: { lng } }: { params: { lng: string } }) {
  return (
    <>
      <Header lng={lng} />
      <Toolbar id="back-to-top-anchor" />
      <main>
        <Hero />
        <Container maxWidth="xl" sx={{ bgcolor: 'background.paper' }}>
          <Media />
        </Container>
      </main>
      <BackToTop triggerId="back-to-top-anchor" />
      <Footer />
    </>
  );
}
