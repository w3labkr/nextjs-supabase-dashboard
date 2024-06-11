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
    <div className="flex items-center space-x-2">
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem>{t('BulkActions.placeholder')}</SelectItem>
            <SelectItem value="delete">{t('BulkActions.delete')}</SelectItem>
            {/* <SelectItem value="publish">{t('BulkActions.publish')}</SelectItem> */}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button type="button">{t('BulkActions.submit')}</Button>
    </div>
  )
}

export { BulkActions }
