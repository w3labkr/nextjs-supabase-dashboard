'use client'

import * as React from 'react'

import { LucideIcon } from '@/lib/lucide-icon'
import { Button } from '@/components/ui/button'
import { SheetTrigger, SheetContent, Sheet } from '@/components/ui/sheet'

import { Brand } from '@/components/brand'
import { Navigation } from '@/components/navigation'
import { MobileNavigation } from '@/components/mobile-navigation'
import { LinkButton } from '@/components/link-button'
import { AccountMenu } from '@/components/account-menu'

import { useAuth } from '@/hooks/use-auth'

const Header = () => {
  const { user } = useAuth()

  return (
    <Sheet>
      <SheetContent className="bg-white dark:bg-gray-900" side="left">
        <MobileNavigation />
      </SheetContent>
      <header className="flex w-full flex-col border-0 border-b border-solid border-input bg-inherit">
        <div className="container flex h-[60px] items-center">
          <SheetTrigger asChild>
            <Button
              type="button"
              className="lg:hidden"
              size="icon"
              variant="outline"
            >
              <LucideIcon name="Menu" className="size-6 min-w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <Brand />
          <Navigation />
          <div className="ml-auto flex gap-2">
            {user ? <SignedInNav /> : <SignedOutNav />}
          </div>
        </div>
      </header>
    </Sheet>
  )
}

const SignedInNav = () => {
  return <AccountMenu />
}

const SignedOutNav = () => {
  return (
    <>
      <LinkButton
        variant="outline"
        href="/auth/signin"
        text="LinkButton.signin"
        translate="yes"
      />
      <LinkButton
        href="/auth/signup"
        text="LinkButton.signup"
        translate="yes"
      />
    </>
  )
}

export { Header }
