import { navConfig } from '@/config/nav';
import { MainNav } from '@/components/main-nav';
import { SubNav } from '@/components/sub-nav';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <MainNav items={navConfig.mainNav} />
        <SubNav items={navConfig.subNav} />
      </div>
    </header>
  );
}
