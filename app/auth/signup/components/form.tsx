'use client'

import * as React from 'react'
import { LuLoader2 } from 'react-icons/lu'
import { useTranslation } from 'react-i18next'

import { useRouter } from 'next/navigation'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { formSchema, formValues, type FormTypes } from './validation'

import { toast } from 'sonner'
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

import { createClient } from '@/utils/supabase/client'

export function SignUpForm() {
  const router = useRouter()
  const { t } = useTranslation(['translation', 'zod', 'zod-custom', 'supabase'])

  const form = useForm<FormTypes>({
    resolver: zodResolver(formSchema),
    defaultValues: formValues,
  })
  const {
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = form

  async function onSubmit(formData: FormTypes) {
    const supabase = createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.signUp({
      email: formData.email as string,
      password: formData.password as string,
    })

    if (error || !user) {
      switch (error?.name) {
        case 'AuthApiError':
          setError('root.serverError', {
            type: error?.status?.toString(),
            message: t(`${error?.name}.${error?.message}`, { ns: 'supabase' }),
          })
          break
        case 'AuthRetryableFetchError':
          toast.error(t(`${error?.name}.${error?.message}`, { ns: 'supabase' }))
          break
      }

      return false
    }

    toast.success(t('You have successfully registered as a member'))

    reset()
    router.push('/auth/signin')
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="space-y-1">
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-primary">{t('Email')}</FormLabel>
                </div>
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
                <FormMessage />
              </FormItem>
            )}
          />
          <FormMessage>{errors?.root?.serverError?.message}</FormMessage>
        </div>
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="text-primary">{t('Password')}</FormLabel>
              </div>
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
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="text-primary">
                  {t('Confirm Password')}
                </FormLabel>
              </div>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                  {...field}
                />
              </FormControl>
              {/* <FormDescription></FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <LuLoader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t('Sign Up')}
        </Button>
      </form>
    </Form>
  )
}
