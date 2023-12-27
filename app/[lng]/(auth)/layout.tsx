import Toolbar from '@mui/material/Toolbar';
import Header from '@/components/Header';
import Main from '@/components/Main';
import Footer from '@/components/Footer';

export default function Layout({ children, params: { lng } }: { children: React.ReactNode; params: { lng: string } }) {
  return (
    <>
      <Header lng={lng} />
      <Toolbar />
      <Main>{children}</Main>
      <Footer />
    </>
  );
}
