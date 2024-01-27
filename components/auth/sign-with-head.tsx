'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

export function SignWithHead() {
  const { t } = useTranslation()

  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-2 text-muted-foreground">
          {t('Or continue with')}
        </span>
      </div>
    </div>
  )
}
