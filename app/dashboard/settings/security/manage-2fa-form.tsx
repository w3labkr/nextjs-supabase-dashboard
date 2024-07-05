'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { User } from '@/types/database'

interface Manage2FAFormProps {
  user: User
}

const Manage2FAForm = ({ user }: Manage2FAFormProps) => {
  const { t } = useTranslation()

  return (
    <Button
      variant="outline"
      className="cursor-not-allowed bg-secondary"
      disabled
    >
      {t('manage_two_factor_authentication')}
    </Button>
  )
}

export { Manage2FAForm }
