'use client';

// import Link from 'next/link';
import { Link as I18Link } from '@/navigation';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button, type ButtonProps } from '@/components/ui/button';

interface NavLinkProps extends ButtonProps {
  children: React.ReactNode;
  href: string;
  className?: string;
  variant?: ButtonProps['variant'];
  scroll?: boolean;
  [key: string]: unknown;
}

export function NavLink({
  children,
  href,
  className,
  variant = 'link',
  scroll = true,
  ...rest
}: NavLinkProps) {
  const pathname = usePathname();

  return (
    <Button
      variant={variant}
      className={cn(pathname !== href && 'text-muted-foreground', className)}
      asChild
      {...rest}
    >
      <I18Link href={href} scroll={scroll}>
        {children}
      </I18Link>
    </Button>
  );
}
