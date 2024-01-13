import Toolbar from '@mui/material/Toolbar';
import Header from '@/components/StickyHeader';
import Hero from '@/components/Hero';
import Main from '@/components/Main';
import Footer from '@/components/Footer';
import Gallery from '@/components/Gallery';

const title = 'Gallery layout';
const description =
  "Something short and leading about the collection below—its contents, the creator, etc.\nMake it short and sweet, but not too short so folks don't simply skip over it entirely.";

export default function LocalePage() {
  return (
    <>
      <Header />
      <Toolbar />
      <Main className="pb-40">
        <Hero title={title} description={description} />
        <Gallery />
      </Main>
      <Footer />
    </>
  );
}
