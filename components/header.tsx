'use client'

import * as React from 'react'

import { LucideIcon } from '@/lib/lucide-icon'
import { Button } from '@/components/ui/button'
import { SheetTrigger, SheetContent, Sheet } from '@/components/ui/sheet'

import { Brand } from '@/components/brand'
import { Navigation } from '@/components/navigation'
import { MobileNavigation } from '@/components/mobile-navigation'
import { LinkButton } from '@/components/link-button'

export function Header() {
  return (
    <Sheet>
      <SheetContent className="bg-white dark:bg-gray-900" side="left">
        <MobileNavigation />
      </SheetContent>
      <header className="flex w-full flex-col border-0 border-b border-solid border-input bg-inherit">
        <div className="container flex h-20 items-center">
          <SheetTrigger asChild>
            <Button className="lg:hidden" size="icon" variant="outline">
              <LucideIcon name="Menu" className="size-6 min-w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <Brand />
          <Navigation />
          <div className="ml-auto flex gap-2">
            <LinkButton
              href="/auth/signin"
              variant="outline"
              text="Sign In"
              translate="yes"
            />
            <LinkButton href="/auth/signup" text="Sign Up" translate="yes" />
          </div>
        </div>
      </header>
    </Sheet>
  )
}
