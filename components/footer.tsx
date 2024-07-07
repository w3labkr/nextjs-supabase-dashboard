import * as React from 'react'

import { Copyright } from '@/components/copyright'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageCombobox } from '@/components/language-combobox'

const Footer = () => {
  return (
    <footer className="flex border-0 border-t border-solid border-input bg-inherit">
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

export { Footer }
