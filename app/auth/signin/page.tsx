import * as React from 'react'

import { Logo } from '@/components/logo'
import { Title } from '@/components/title'
import { Description } from '@/components/description'
import { SignInWith } from '@/components/signin-with'
import { Link } from '@/components/link'
import { ButtonLink } from '@/components/button-link'
import { LanguageToggleButton } from '@/components/language-toggle-button'

import { SignInForm } from './signin-form'

export default function SignInPage() {
  return (
    <div className="container flex min-h-screen w-screen flex-col items-center justify-center py-8">
      <ButtonLink
        href="/"
        className="absolute left-4 top-4 md:left-8 md:top-8"
        startIconName="ChevronLeft"
        text="ButtonLink.home"
        translate="yes"
      />
      <div className="mx-auto flex w-full max-w-[320px] flex-col justify-center space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <Logo />
          <Title text="SignInPage.title" translate="yes" />
          <Description text="SignInPage.description" translate="yes" />
        </div>
        <div className="grid gap-6">
          <SignInForm />
          <SignInWith />
        </div>
        <div className="flex items-center justify-between text-sm">
          <Link
            href="/auth/signup"
            className="hover:underline"
            text="AuthLink.signup"
            translate="yes"
          />
          <LanguageToggleButton />
        </div>
      </div>
    </div>
  )
}
