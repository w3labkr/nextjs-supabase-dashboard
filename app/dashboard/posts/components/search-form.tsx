'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter, usePathname } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

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
import { Button } from '@/components/ui/button'
import { useQueryString } from '@/hooks/use-query-string'

const FormSchema = z.object({
  q: z.string(),
})

type FormValues = z.infer<typeof FormSchema>

const SearchForm = () => {
  const { t } = useTranslation()

  const pathname = usePathname()
  const router = useRouter()
  const { qs } = useQueryString()

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    defaultValues: {
      q: '',
    },
  })

  const onSubmit = (formValues: FormValues) => {
    const queryString = qs({ q: formValues?.q, page: 1 })
    const href = [pathname, queryString].filter(Boolean).join('?')

    router.push(href)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-start space-x-2"
      >
        <FormField
          control={form.control}
          name="q"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder={t('SearchForm.placeholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{t('SearchForm.submit')}</Button>
      </form>
    </Form>
  )
}

export { SearchForm }
