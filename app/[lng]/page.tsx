// Move faster with intuitive React UI tools.
import Toolbar from '@mui/material/Toolbar';

// Utility for creating styled components.
import Header from '@/components/Header';
import Main from '@/components/Main';
import Hero from '@/components/Hero';
import Media from '@/components/Media';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

export default function RootPage({ params: { lng } }: { params: { lng: string } }) {
  return (
    <>
      <Header lng={lng} />
      <Toolbar id="back-to-top-anchor" />
      <Main>
        <Hero />
        <Media />
      </Main>
      <BackToTop triggerId="back-to-top-anchor" />
      <Footer />
    </>
  );
}
