'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter, useSearchParams } from 'next/navigation'

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

import { cn, getArchivePath } from '@/lib/utils'
import { LucideIcon } from '@/lib/lucide-icon'
import { useQueryString } from '@/hooks/use-query-string'
import { siteConfig } from '@/config/site'

const FormSchema = z.object({
  q: z.string(),
})

type FormValues = z.infer<typeof FormSchema>

interface SearchFormProps extends React.FormHTMLAttributes<HTMLFormElement> {}

const SearchForm = ({ className, ...props }: SearchFormProps) => {
  const { t } = useTranslation()
  const { qs } = useQueryString()

  const searchParams = useSearchParams()
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    values: {
      q: searchParams?.get('q') ?? '',
    },
  })

  const onSubmit = async (formValues: FormValues) => {
    const pathname = getArchivePath()
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
        className={cn('relative flex w-full items-center', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name="q"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder={t('search_text')}
                  className="pr-8"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit" className="absolute right-2">
          <LucideIcon
            name="Search"
            size={20}
            className="text-muted-foreground"
          />
        </button>
      </form>
    </Form>
  )
}

export { SearchForm }
