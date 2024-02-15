import * as React from 'react'

import { Logo } from '@/components/auth/logo'
import { Title } from '@/components/auth/title'
import { Description } from '@/components/auth/description'
import { RelatedLink } from '@/components/auth/related-link'
import { ButtonLink } from '@/components/button-link'
import { LanguageToggleButton } from '@/components/auth/language-toggle-button'

import { ResetPasswordForm } from './reset-password-form'

export default function ResetPasswordPage() {
  return (
    <div className="container flex min-h-screen w-screen flex-col items-center justify-center py-8">
      <ButtonLink
        href="/auth/signin"
        title="Sign In"
        className="absolute left-4 top-4 md:left-8 md:top-8"
        startIconName="ChevronLeft"
      />
      <div className="mx-auto flex w-full max-w-[320px] flex-col justify-center space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <Logo />
          <Title>Reset your password</Title>
          <Description>Please enter your new password below</Description>
        </div>
        <div className="grid gap-6">
          <ResetPasswordForm />
        </div>
        <div className="flex justify-between text-center text-sm">
          <RelatedLink
            href="/auth/signup"
            title="Don't have an account? Sign Up"
          />
          <LanguageToggleButton />
        </div>
      </div>
    </div>
  )
}
