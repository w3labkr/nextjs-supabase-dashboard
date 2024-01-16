import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 min-h-screen">
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
          {children}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
