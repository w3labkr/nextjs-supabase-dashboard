import { Link as I18Link } from '@/navigation';
import { Button, type ButtonProps } from '@/components/ui/button';

interface LinkProps {
  children: React.ReactNode;
  href: string;
  className?: string;
  variant?: ButtonProps['variant'];
  scroll?: boolean;
  [key: string]: unknown;
}

export function Link({
  children,
  href,
  className,
  variant = 'link',
  scroll = true,
  ...rest
}: LinkProps) {
  return (
    <Button variant={variant} className={className} asChild {...rest}>
      <I18Link href={href} scroll={scroll}>
        {children}
      </I18Link>
    </Button>
  );
}
