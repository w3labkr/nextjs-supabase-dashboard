'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

const BulkActions = () => {
  const { t } = useTranslation()

  return (
    <div className="flex items-start space-x-2">
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={t('BulkActions.placeholder')} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="unassigned">
              {t('BulkActions.placeholder')}
            </SelectItem>
            {/* <SelectItem value="delete">{t('BulkActions.delete')}</SelectItem> */}
            {/* <SelectItem value="publish">{t('BulkActions.publish')}</SelectItem> */}
            {/* <SelectItem value="public">{t('BulkActions.public')}</SelectItem> */}
            {/* <SelectItem value="private">{t('BulkActions.private')}</SelectItem> */}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button type="button">{t('BulkActions.submit')}</Button>
    </div>
  )
}

export { BulkActions }
