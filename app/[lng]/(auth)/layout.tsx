import Toolbar from '@mui/material/Toolbar';
import Header from '@/components/Header.tsx';
import Footer from '@/components/Footer.tsx';
import BackToTop from '@/components/BackToTop.tsx';

export default function AuthLayout({
  children,
  params: { lng },
}: {
  children: React.ReactNode;
  params: { lng: string };
}) {
  return (
    <>
      <Header lng={lng} />
      <Toolbar id="back-to-top-anchor" />
      <main>{children}</main>
      <BackToTop triggerId="back-to-top-anchor" />
      <Footer />
    </>
  );
}
