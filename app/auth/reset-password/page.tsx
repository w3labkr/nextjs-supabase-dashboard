import * as React from 'react'

import { Logo } from '@/components/logo'
import { Title } from '@/components/title'
import { Description } from '@/components/description'
import { RelatedLink } from '@/components/auth/related-link'
import { ButtonLink } from '@/components/button-link'
import { LanguageToggleButton } from '@/components/auth/language-toggle-button'

import { ResetPasswordForm } from './reset-password-form'

export default function ResetPasswordPage() {
  return (
    <div className="container flex min-h-screen w-screen flex-col items-center justify-center py-8">
      <ButtonLink
        href="/auth/signin"
        className="absolute left-4 top-4 md:left-8 md:top-8"
        startIconName="ChevronLeft"
        text="Sign In"
        translate="yes"
      />
      <div className="mx-auto flex w-full max-w-[320px] flex-col justify-center space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <Logo />
          <Title text="Reset your password" translate="yes" />
          <Description
            text="Please enter your new password below"
            translate="yes"
          />
        </div>
        <div className="grid gap-6">
          <ResetPasswordForm />
        </div>
        <div className="flex justify-between text-center text-sm">
          <RelatedLink
            href="/auth/signup"
            text="Don't have an account? Sign Up"
            translate="yes"
          />
          <LanguageToggleButton />
        </div>
      </div>
    </div>
  )
}
