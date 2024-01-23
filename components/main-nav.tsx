'use client';

import { useState } from 'react';
import { LuCommand, LuX } from 'react-icons/lu';

import { MainNavItem } from 'types';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MobileNav } from '@/components/mobile-nav';
import { Link } from '@/components/link';
import { NavLink } from '@/components/nav-link';

export function MainNav({ items }: { items: MainNavItem[] }) {
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

  return (
    <div className="flex gap-6 md:gap-10">
      <Link
        href="/"
        scroll={false}
        className="hidden items-center space-x-2 md:flex p-0"
      >
        <LuCommand />
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      <nav className="hidden gap-6 md:flex">
        {items.map((item, index) => (
          <NavLink
            key={index}
            href={item.disabled ? '#' : item.href}
            scroll={false}
            className={cn(
              'flex items-center text-sm font-medium p-0',
              item.disabled && 'cursor-not-allowed opacity-60'
            )}
            disabled={item.disabled}
          >
            {item.title}
          </NavLink>
        ))}
      </nav>
      <Button
        variant="ghost"
        className="flex items-center space-x-2 md:hidden -ml-4"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        {showMobileMenu ? <LuX /> : <LuCommand />}
        <span className="font-bold">Menu</span>
      </Button>
      {showMobileMenu && <MobileNav items={items} />}
    </div>
  );
}
