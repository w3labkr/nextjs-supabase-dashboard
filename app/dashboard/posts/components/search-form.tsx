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
import { siteConfig } from '@/config/site'

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

  const onSubmit = async (formValues: FormValues) => {
    const queryString = qs({ q: formValues?.q, page: 1 })
    const href = [pathname, queryString].filter(Boolean).join('?')

    router.push(href, {
      scroll: !siteConfig?.fixedHeader,
    })
  }

  return (
    <Form {...form}>
      <form
        method="POST"
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-start space-x-2"
      >
        <FormField
          control={form.control}
          name="q"
          render={({ field }) => (
            <FormItem className="w-full sm:w-auto">
              <FormControl>
                <Input
                  className="sm:w-60"
                  placeholder={t('SearchForm.placeholder')}
                  {...field}
                />
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
