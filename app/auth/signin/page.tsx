import * as React from 'react'

import { Logo } from '@/components/logo'
import { Title } from '@/components/title'
import { Description } from '@/components/description'
import { SignInWith } from '@/components/signin-with'
import { TextLink } from '@/components/text-link'
import { ButtonLink } from '@/components/button-link'
import { CountryFlagButton } from '@/components/country-flag-button'

import { SignInForm } from './signin-form'

export default function SignInPage() {
  return (
    <div className="container flex min-h-screen w-screen flex-col items-center justify-center py-8">
      <ButtonLink
        href="/"
        className="absolute left-4 top-4 md:left-8 md:top-8"
        startIconName="ChevronLeft"
        translate="yes"
      >
        home
      </ButtonLink>
      <div className="mx-auto flex w-full max-w-[320px] flex-col justify-center space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <Logo />
          <Title translate="yes">welcome_back</Title>
          <Description translate="yes">
            enter_your_email_to_sign_in_to_your_account
          </Description>
        </div>
        <div className="grid gap-6">
          <SignInForm />
          <SignInWith />
        </div>
        <div className="flex items-center justify-between text-sm">
          <TextLink
            href="/auth/signup"
            className="underline hover:no-underline"
            translate="yes"
          >
            dont_have_an_account_sign_up
          </TextLink>
          <CountryFlagButton />
        </div>
      </div>
    </div>
  )
}
