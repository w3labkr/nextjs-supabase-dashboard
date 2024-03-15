'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { EmailListItemContext } from './email-list-item-provider'

export function ResendVerificationButton() {
  const state = React.useContext(EmailListItemContext)
  const { t } = useTranslation()

  // if (!state?.isVerified) return null
  // if (!state?.isPrimary) return null

  return (
    <button
      type="button"
      className="font-semibold text-blue-700 hover:underline"
    >
      {t('ResendVerificationButton.label')}
    </button>
  )
}
