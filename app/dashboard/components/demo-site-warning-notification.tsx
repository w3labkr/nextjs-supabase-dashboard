'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { Terminal } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const DemoSiteWarningNotification = () => {
  const { t } = useTranslation()

  return (
    <Alert variant="destructive" className="rounded-none">
      <Terminal className="h-4 w-4" />
      {/* <AlertTitle>{t('heads_up')}</AlertTitle> */}
      <AlertDescription>
        {t('heads_up')}{' '}
        {t('data_stored_on_the_demo_site_is_reset_periodically')}
      </AlertDescription>
    </Alert>
  )
}

export { DemoSiteWarningNotification }
