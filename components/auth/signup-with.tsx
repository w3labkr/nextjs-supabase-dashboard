import * as React from 'react'

import { SignWithHead } from '@/components/auth/sign-with-head'
import { SignWithBody } from '@/components/auth/sign-with-body'
import { SignUpWithGoogle } from '@/components/auth/signup-with-google'
import { LogoutButton } from '@/components/logout-button'

export function SignUpWith() {
  return (
    <>
      <SignWithHead />
      <SignWithBody>
        <SignUpWithGoogle />
        {/* <LogoutButton /> */}
      </SignWithBody>
    </>
  )
}
