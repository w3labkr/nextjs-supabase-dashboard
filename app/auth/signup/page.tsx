import * as React from 'react'
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { isAuthenticate } from '@/lib/supabase/server'

import { Logo } from '@/components/logo'
import { Title } from '@/components/title'
import { Description } from '@/components/description'
import { SignUpPolicyLink } from '@/components/signup-policy-link'
import { RelatedLink } from '@/components/related-link'
import { ButtonLink } from '@/components/button-link'
import { LanguageToggleButton } from '@/components/language-toggle-button'

import { SignUpForm } from './signup-form'

export const metadata: Metadata = {
  title: 'Create an account',
  description: 'Create an account to get started.',
}

export default async function SignUpPage() {
  const isAuthenticated = await isAuthenticate()

  if (isAuthenticated) {
    redirect('/dashboard/settings/profile')
  }

  return (
    <div className="container flex min-h-screen w-screen flex-col items-center justify-center py-8">
      <ButtonLink
        href="/auth/signin"
        className="absolute right-4 top-4 md:right-8 md:top-8"
        text="sign_in"
        translate="yes"
      />
      <div className="mx-auto flex w-full max-w-[320px] flex-col justify-center space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <Logo />
          <Title text="create_an_account" translate="yes" />
          <Description
            text="enter_your_email_below_to_create_your_account"
            translate="yes"
          />
        </div>
        <div className="grid gap-6">
          <SignUpForm />
          <SignUpPolicyLink />
        </div>
        <div className="flex justify-between text-center text-sm">
          <RelatedLink
            href="/auth/signin"
            text="already_have_an_account_sign_in"
            translate="yes"
          />
          <LanguageToggleButton />
        </div>
      </div>
    </div>
  )
}
