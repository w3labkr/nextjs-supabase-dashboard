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
import { cn, getArchivePath } from '@/lib/utils'
import { LucideIcon } from '@/lib/lucide-icon'

const FormSchema = z.object({
  q: z.string(),
})

type FormValues = z.infer<typeof FormSchema>

interface SearchFormProps extends React.FormHTMLAttributes<HTMLFormElement> {}

const SearchForm = ({ className, ...props }: SearchFormProps) => {
  const { t } = useTranslation()
  const { qs } = useQueryString()
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    defaultValues: {
      q: '',
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
        className={cn('relative flex w-full items-center px-4', className)}
        {...props}
      >
        <LucideIcon
          name="Search"
          className="absolute left-7 size-5 min-w-5 text-muted-foreground"
        />
        <FormField
          control={form.control}
          name="q"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder={t('SearchForm.placeholder')}
                  className="pl-10"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

export { SearchForm }
