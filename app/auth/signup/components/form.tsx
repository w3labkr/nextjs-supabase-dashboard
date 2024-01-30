'use client'

import * as React from 'react'
import { LuLoader2 } from 'react-icons/lu'
import { useTranslation } from 'react-i18next'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { formSchema, formValues, type FormTypes } from './validation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

// import { onSubmit } from './actions'

export function SignUpForm() {
  const form = useForm<FormTypes>({
    resolver: zodResolver(formSchema),
    defaultValues: formValues,
  })
  const disabledSubmit = form.formState.isLoading || form.formState.isSubmitting
  const { t } = useTranslation(['translation', 'zod'])

  function onSubmit(values: FormTypes) {
    console.log(values)
    form.reset()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="space-y-2"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              {/* <FormLabel></FormLabel> */}
              <FormControl>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  {...field}
                />
              </FormControl>
              {/* <FormDescription></FormDescription> */}
              <FormMessage>
                {error?.message && t(error.message, { ns: 'zod' })}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              {/* <FormLabel></FormLabel> */}
              <FormControl>
                <Input
                  type="password"
                  placeholder="Password"
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                  {...field}
                />
              </FormControl>
              {/* <FormDescription></FormDescription> */}
              <FormMessage>
                {error?.message && t(error.message, { ns: 'zod' })}
              </FormMessage>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={disabledSubmit} className="w-full">
          {disabledSubmit && (
            <LuLoader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {t('Sign Up')}
        </Button>
      </form>
    </Form>
  )
}
