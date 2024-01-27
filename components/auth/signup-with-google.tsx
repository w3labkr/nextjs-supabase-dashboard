'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { FcGoogle } from 'react-icons/fc'

import { Button } from '@/components/ui/button'

export function SignUpWithGoogle() {
  const { t } = useTranslation()

  return (
    <Button variant="outline" onClick={() => {}}>
      <FcGoogle className="mr-2 h-4 w-4" /> {t('Sign up with Google')}
    </Button>
  )
}
