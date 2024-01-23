import { Copyright } from '@/components/copyright';
import { ThemeToggle } from '@/components/theme-toggle';
import { LocaleToggle } from '@/components/locale-toggle';

export function SiteFooter() {
  return (
    <footer className="border-t py-4">
      <div className="container flex items-center space-x-4 justify-between sm:space-x-0">
        <LocaleToggle />
        <Copyright />
        <ThemeToggle />
      </div>
    </footer>
  );
}
