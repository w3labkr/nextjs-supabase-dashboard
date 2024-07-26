'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'

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
import { useQueryString } from '@/hooks/url'

const FormSchema = z.object({
  q: z.string(),
})

type FormValues = z.infer<typeof FormSchema>

interface SearchFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  path: string
  placeholder?: string
  translate?: 'yes' | 'no'
  values: { q: string }
}

const SearchForm = ({
  className,
  path,
  placeholder = 'Search Text',
  translate,
  values,
  ...props
}: SearchFormProps) => {
  const { t } = useTranslation()
  const { qs } = useQueryString()
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    values,
  })
  const { control, handleSubmit } = form

  const onSubmit = async (formValues: FormValues) => {
    const query = qs({ q: formValues?.q, tag: undefined, page: 1 })
    const url = [path, query].filter(Boolean).join('?')

    router.push(url)
  }

  return (
    <Form {...form}>
      <form
        method="POST"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className={cn('relative flex w-full items-center', className)}
        {...props}
      >
        <FormField
          control={control}
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
            className="size-5 min-w-5 text-muted-foreground"
          />
        </button>
      </form>
    </Form>
  )
}

export { SearchForm }
