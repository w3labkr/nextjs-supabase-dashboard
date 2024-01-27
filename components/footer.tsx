import * as React from 'react'
import { LanguageStatus } from '@/components/language-status'
import { DarkModeStatus } from '@/components/theme-status'
import { Copyright } from '@/components/copyright'
import { ThemeToggle } from '@/components/theme-toggle'
import { LanguageSwitcher } from '@/components/language-switcher'

export function Footer() {
  return (
    <footer className="flex h-20 border-0 border-t border-solid border-input bg-inherit">
      <div className="container flex items-center justify-between bg-inherit">
        <div className="text-sm">
          <Copyright />
          <LanguageStatus />
          {', '}
          <DarkModeStatus />
        </div>
        <div className="flex flex-row gap-2">
          <ThemeToggle />
          <LanguageSwitcher width="240px" />
        </div>
      </div>
    </footer>
  )
}
