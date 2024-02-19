import * as React from 'react'
import type { Metadata } from 'next'

import { Logo } from '@/components/logo'
import { Title } from '@/components/title'
import { Description } from '@/components/description'
import { SignInWith } from '@/components/signin-with'
import { RelatedLink } from '@/components/related-link'
import { ButtonLink } from '@/components/button-link'
import { LanguageToggleButton } from '@/components/language-toggle-button'

import { SignInForm } from './signin-form'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account',
}

export default function SignInPage() {
  return (
    <div className="container flex min-h-screen w-screen flex-col items-center justify-center py-8">
      <ButtonLink
        href="/"
        className="absolute left-4 top-4 md:left-8 md:top-8"
        startIconName="ChevronLeft"
        text="home"
        translate="yes"
      />
      <div className="mx-auto flex w-full max-w-[320px] flex-col justify-center space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <Logo />
          <Title text="welcome_back" translate="yes" />
          <Description
            text="enter_your_email_to_sign_in_to_your_account"
            translate="yes"
          />
        </div>
        <div className="grid gap-6">
          <SignInForm />
          <SignInWith />
        </div>
        <div className="flex justify-between text-center text-sm">
          <RelatedLink
            href="/auth/signup"
            text="dont_have_an_account_sign_up"
            translate="yes"
          />
          <LanguageToggleButton />
        </div>
      </div>
    </div>
  )
}
