'use client';

import { useState } from 'react';
import { Link, usePathname } from '@/navigation';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { MobileNav } from '@/components/mobile-nav';
import { LuCommand, LuX } from 'react-icons/lu';

const navItems = [
  { title: 'Home', href: '/', disabled: false },
  { title: 'Typography', href: '/typography', disabled: false },
  { title: 'Disabled', href: '', disabled: true },
];

export function MainNav() {
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const pathname = usePathname();

  return (
    <div className="flex gap-6 md:gap-10">
      <Button
        variant="link"
        className="hidden items-center space-x-2 md:flex p-0"
        asChild
      >
        <Link href="/" scroll={false}>
          <LuCommand />
          <span className="hidden font-bold sm:inline-block">NextJS</span>
        </Link>
      </Button>
      <nav className="hidden gap-6 md:flex">
        {navItems.map((item, index) => (
          <Button
            key={index}
            variant="link"
            className={cn(
              'flex items-center text-sm font-medium p-0',
              pathname !== item.href && 'text-muted-foreground',
              item.disabled && 'cursor-not-allowed opacity-60'
            )}
            asChild
            disabled={item.disabled}
          >
            <Link href={item.href} scroll={false}>
              {item.title}
            </Link>
          </Button>
        ))}
      </nav>
      <Button
        variant="ghost"
        className="flex items-center space-x-2 md:hidden p-0"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        {showMobileMenu ? <LuX /> : <LuCommand />}
        <span className="font-bold">Menu</span>
      </Button>
      {showMobileMenu && <MobileNav items={navItems} />}
    </div>
  );
}
