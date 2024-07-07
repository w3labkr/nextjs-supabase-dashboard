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
import { useQueryString } from '@/hooks/url'
import { cn } from '@/lib/utils'

const FormSchema = z.object({
  q: z.string(),
})

type FormValues = z.infer<typeof FormSchema>

interface SearchFormProps extends React.FormHTMLAttributes<HTMLFormElement> {}

const SearchForm = ({ className, ...props }: SearchFormProps) => {
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
    const query = qs({ q: formValues?.q, page: 1 })
    const url = [pathname, query].filter(Boolean).join('?')

    router.push(url)
  }

  return (
    <Form {...form}>
      <form
        method="POST"
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('flex items-start gap-2', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name="q"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input placeholder={t('search_text')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">{t('search')}</Button>
      </form>
    </Form>
  )
}

export { SearchForm, type SearchFormProps }
