'use client';

import { Link, usePathname } from '@/navigation';
import { cn } from '@/lib/utils';

import { useLockBody } from '@/hooks/use-lock-body';
import { Button } from '@/components/ui/button';
import { LuCommand } from 'react-icons/lu';

interface NavItemProps {
  title: string;
  href: string;
  disabled: boolean;
}

export function MobileNav({ items }: { items: NavItemProps[] }) {
  const pathname = usePathname();
  useLockBody();

  return (
    <div
      className={cn(
        'fixed inset-0 top-16 z-50 grid h-[calc(100vh-4rem)] grid-flow-row auto-rows-max overflow-auto p-6 pb-32 shadow-md animate-in slide-in-from-bottom-80 md:hidden'
      )}
    >
      <div className="relative z-20 grid gap-6 rounded-md bg-popover p-4 text-popover-foreground shadow-md">
        <Link href="/" className="flex items-center space-x-2">
          <LuCommand />
          <span className="font-bold">NextJS</span>
        </Link>
        <nav className="grid grid-flow-row auto-rows-max text-sm">
          {items.map((item, index) => (
            <Button
              key={index}
              variant="link"
              className={cn(
                'flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline',
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
      </div>
    </div>
  );
}
