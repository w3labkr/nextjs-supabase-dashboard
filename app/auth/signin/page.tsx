import * as React from 'react'
import type { Metadata } from 'next'

import { LanguageSwitcher } from '@/components/language-switcher'
import { BackButton } from '@/components/auth/back-button'
import { Logo } from '@/components/auth/logo'
import { Title } from '@/components/auth/title'
import { Description } from '@/components/auth/description'
import { SignInWith } from '@/components/auth/signin-with'
import { ForgotPasswordLink, SignUpLink } from '@/components/auth/related-link'

import { SignInForm } from './components/form'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account',
}

export default function Page() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <BackButton className="absolute left-4 top-4 md:left-8 md:top-8" />
      <div className="mx-auto flex w-full max-w-[320px] flex-col justify-center space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <Logo />
          <Title text="Welcome back" />
          <Description text="Enter your email to sign in to your account" />
        </div>
        <div className="grid gap-6">
          <SignInForm />
          <LanguageSwitcher />
          <SignInWith />
        </div>
        <div className="grid gap-1 text-center text-sm">
          <ForgotPasswordLink />
          <SignUpLink />
        </div>
      </div>
    </div>
  )
}
