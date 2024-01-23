import { Link } from '@/components/link';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

export default function LocalePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 min-h-screen">
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
          <div className="flex max-w-[980px] flex-col items-start gap-2">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
              Beautifully designed components{' '}
              <br className="hidden sm:inline" />
              built with Radix UI and Tailwind CSS.
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground">
              Accessible and customizable components that you can copy and paste
              into your apps. Free. Open Source. And Next.js 14 Ready.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="/docs" variant="default">
              Documentation
            </Link>
            <Link
              href="https://github.com/w3labkr/nextjs-ninja"
              target="_blank"
              rel="noreferrer"
              variant="outline"
            >
              GitHub
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
