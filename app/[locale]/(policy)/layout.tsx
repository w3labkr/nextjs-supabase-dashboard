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
        <div className="container pt-6 pb-8 md:pt-10 md:pb-28">{children}</div>
      </main>
      <SiteFooter />
    </>
  );
}
