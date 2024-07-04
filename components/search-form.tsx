'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

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

import { cn } from '@/lib/utils'
import { LucideIcon } from '@/lib/lucide-icon'
import { useQueryString } from '@/hooks/use-query-string'

const FormSchema = z.object({
  q: z.string(),
})

type FormValues = z.infer<typeof FormSchema>

interface SearchFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  pathname?: string
  placeholder?: string
  translate?: 'yes' | 'no'
  values: { q: string }
}

const SearchForm = ({
  className,
  pathname,
  placeholder = 'Search Text',
  translate,
  values,
  ...props
}: SearchFormProps) => {
  const { t } = useTranslation()
  const { qs } = useQueryString()

  const basePathname = usePathname()
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    values,
  })

  const onSubmit = async (formValues: FormValues) => {
    const queryString = qs({ q: formValues?.q, page: 1 })
    const href = [pathname ?? basePathname, queryString]
      .filter(Boolean)
      .join('?')

    router.push(href)
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
                  placeholder={
                    placeholder && translate === 'yes'
                      ? t(placeholder)
                      : placeholder
                  }
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
