import * as React from 'react'

import { Copyright } from '@/components/copyright'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageCombobox } from '@/components/language-combobox'
import { cn } from '@/lib/utils'

interface FooterProps extends React.HTMLAttributes<HTMLElement> {}

const Footer = ({ className, ...props }: FooterProps) => {
  return (
    <footer
      className={cn(
        'flex border-0 border-t border-solid border-input bg-inherit',
        className
      )}
      {...props}
    >
      <div className="container flex items-center justify-between gap-2 bg-inherit py-4">
        <Copyright className="text-sm" />
        <div className="flex gap-2">
          <ThemeToggle />
          <LanguageCombobox />
        </div>
      </div>
    </footer>
  )
}

export { Footer, type FooterProps }
