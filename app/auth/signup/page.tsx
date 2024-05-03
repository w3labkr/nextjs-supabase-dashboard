import * as React from 'react'

import { Logo } from '@/components/logo'
import { Title } from '@/components/title'
import { Description } from '@/components/description'
import { TextLink } from '@/components/text-link'
import { ButtonLink } from '@/components/button-link'
import { LanguageToggleButton } from '@/components/language-toggle-button'

import { SignUpForm } from './signup-form'
import { Policy } from './policy'

export default function SignUpPage() {
  return (
    <div className="container flex min-h-screen w-screen flex-col items-center justify-center py-8">
      <ButtonLink
        href="/auth/signin"
        className="absolute right-4 top-4 md:right-8 md:top-8"
        text="ButtonLink.signin"
        translate="yes"
      />
      <div className="mx-auto flex w-full max-w-[320px] flex-col justify-center space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <Logo />
          <Title text="SignUpPage.title" translate="yes" />
          <Description text="SignUpPage.description" translate="yes" />
        </div>
        <div className="grid gap-6">
          <SignUpForm />
          <Policy />
        </div>
        <div className="flex items-center justify-between text-sm">
          <TextLink
            href="/auth/signin"
            className="hover:underline"
            text="AuthLink.signin"
            translate="yes"
          />
          <LanguageToggleButton />
        </div>
      </div>
    </div>
  )
}
