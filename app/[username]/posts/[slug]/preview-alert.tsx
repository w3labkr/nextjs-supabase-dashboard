'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { LucideIcon } from '@/lib/lucide-icon'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const PreviewAlert = () => {
  const { t } = useTranslation()

  return (
    <Alert
      variant="destructive"
      className="flex items-center justify-center rounded-none"
    >
      <AlertTitle>{t('Alert.this_is_a_preview_page')}</AlertTitle>
      <AlertDescription>
        <button className="ml-2" onClick={() => window.history.back()}>
          <LucideIcon name="Undo" className="size-4 min-w-4" />
        </button>
      </AlertDescription>
    </Alert>
  )
}

export { PreviewAlert }
