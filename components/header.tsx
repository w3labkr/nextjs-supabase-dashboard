'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { LucideIcon } from '@/lib/lucide-icon'
import { Button } from '@/components/ui/button'
import {
  SheetTrigger,
  SheetContent,
  Sheet,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'

import { SiteBrand } from '@/components/site-brand'
import { Navigation } from '@/components/navigation'
import { MobileNavigation } from '@/components/mobile-navigation'
import { AccountMenu } from '@/components/account-menu'
import { SearchForm } from '@/components/search-form'
import { SearchFormDialog } from '@/components/search-form-dialog'

import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {}

const Header = ({ className, ...props }: HeaderProps) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <Sheet>
      <VisuallyHidden.Root>
        <SheetTitle>Sheet Content</SheetTitle>
        <SheetDescription>
          This is a hidden description for screen readers.
        </SheetDescription>
      </VisuallyHidden.Root>
      <SheetContent className="bg-white dark:bg-gray-900" side="left">
        <MobileNavigation />
      </SheetContent>
      <header
        className={
          (cn(
            'flex w-full flex-col border-0 border-b border-solid border-input'
            // 'sticky left-0 top-0 z-10'
          ),
          className)
        }
        {...props}
      >
        <div className="container flex h-[60px] items-center">
          <SheetTrigger asChild>
            <Button
              type="button"
              className="md:hidden"
              size="icon"
              variant="outline"
            >
              <LucideIcon name="Menu" className="size-6 min-w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SiteBrand className="mr-6 hidden md:flex" />
          <Navigation />
          <div className="ml-auto flex gap-2">
            {pathname !== '/' ? (
              <SearchForm
                path="/search"
                placeholder="search_text"
                translate="yes"
                values={{
                  q: pathname?.startsWith('/search')
                    ? ((searchParams.get('q') as string) ?? '')
                    : '',
                }}
                className="hidden sm:flex"
              />
            ) : null}
            {pathname !== '/' ? (
              <SearchFormDialog className="sm:hidden" />
            ) : null}
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
  const router = useRouter()
  const { t } = useTranslation()

  return (
    <>
      <Button
        variant="outline"
        className="w-10 sm:w-auto"
        onClick={() => router.push('/auth/signin')}
      >
        <LucideIcon name="LogIn" className="size-5 min-w-5 sm:hidden" />
        <span className="hidden sm:inline">{t('signin')}</span>
      </Button>
      <Button
        className="w-10 sm:w-auto"
        onClick={() => router.push('/auth/signup')}
      >
        <LucideIcon name="UserPlus" className="size-5 min-w-5 sm:hidden" />
        <span className="hidden sm:inline">{t('signup')}</span>
      </Button>
    </>
  )
}

export { Header, type HeaderProps }
