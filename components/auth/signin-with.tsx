import * as React from 'react'

import { SignWithHead } from '@/components/auth/sign-with-head'
import { SignWithBody } from '@/components/auth/sign-with-body'
import { SignInWithGoogle } from '@/components/auth/signin-with-google'
import { LogoutButton } from '@/components/logout-button'

export function SignInWith() {
  return (
    <>
      <SignWithHead />
      <SignWithBody>
        <SignInWithGoogle />
        {/* <LogoutButton /> */}
      </SignWithBody>
    </>
  )
}
