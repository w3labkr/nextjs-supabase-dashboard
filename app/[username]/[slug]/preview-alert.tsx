'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { LucideIcon } from '@/lib/lucide-icon'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function PreviewAlert() {
  const { t } = useTranslation()

  return (
    <Alert variant="destructive" className="m-4 w-auto">
      <LucideIcon name="Terminal" className="size-4 min-w-4" />
      <div className="flex justify-between">
        <div>
          <AlertTitle>{t('Alert.heads_up')}</AlertTitle>
          <AlertDescription>
            {t('Alert.this_is_a_preview_screen')}
          </AlertDescription>
        </div>
        <Button variant="destructive" onClick={() => window.history.back()}>
          <LucideIcon name="Undo" className="size-4 min-w-4" />
        </Button>
      </div>
    </Alert>
  )
}
