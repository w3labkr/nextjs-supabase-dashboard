import * as React from 'react'
import type { Metadata } from 'next'

import { Logo } from '@/components/logo'
import { Title } from '@/components/title'
import { Description } from '@/components/description'
import { RelatedLink } from '@/components/related-link'
import { ButtonLink } from '@/components/button-link'
import { LanguageToggleButton } from '@/components/language-toggle-button'

import { ForgotPasswordForm } from './forgot-password-form'

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Login to your account',
}

export default function ForgotPasswordPage() {
  return (
    <div className="container flex min-h-screen w-screen flex-col items-center justify-center py-8">
      <ButtonLink
        href="/auth/signin"
        className="absolute left-4 top-4 md:left-8 md:top-8"
        startIconName="ChevronLeft"
        text="ButtonLink.signin"
        translate="yes"
      />
      <div className="mx-auto flex w-full max-w-[320px] flex-col justify-center space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <Logo />
          <Title text="ForgotPasswordPage.title" translate="yes" />
          <Description text="ForgotPasswordPage.description" translate="yes" />
        </div>
        <div className="grid gap-6">
          <ForgotPasswordForm />
        </div>
        <div className="flex justify-between text-center text-sm">
          <RelatedLink
            href="/auth/signup"
            text="RelatedLink.signup"
            translate="yes"
          />
          <LanguageToggleButton />
        </div>
      </div>
    </div>
  )
}
