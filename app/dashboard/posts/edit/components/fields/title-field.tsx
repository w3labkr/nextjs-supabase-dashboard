'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { usePostForm } from '../../context/post-form-provider'

export function TitleField() {
  const { t } = useTranslation()
  const { form } = usePostForm()

  return (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input placeholder={t('Input.please_enter_your_text')} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
