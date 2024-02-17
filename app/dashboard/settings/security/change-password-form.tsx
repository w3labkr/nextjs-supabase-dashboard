'use client'

import * as React from 'react'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
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

const formSchema = z
  .object({
    // If the password is larger than 72 chars, it will be truncated to the first 72 chars.
    oldPassword: z.string().trim().min(6).max(72),
    newPassword: z.string().trim().min(6).max(72),
    confirmNewPassword: z.string().trim().min(6).max(72),
  })
  .refine((val) => val.newPassword === val.confirmNewPassword, {
    path: ['confirmNewPassword'],
    params: { i18n: 'invalid_confirm_password' },
  })

type FormValues = z.infer<typeof formSchema>

const defaultValues: Partial<FormValues> = {
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: '',
}

export function ChangePasswordForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  async function onSubmit(values: FormValues) {
    console.log(values)

    toast.success('Your password has been successfully changed')
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem className="max-w-80">
              <FormLabel>Old Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                  placeholder="Old Password"
                  {...field}
                />
              </FormControl>
              {/* <FormDescription></FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem className="max-w-80">
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                  placeholder="New Password"
                  {...field}
                />
              </FormControl>
              {/* <FormDescription></FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmNewPassword"
          render={({ field }) => (
            <FormItem className="max-w-80">
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                  placeholder="Confirm New Password"
                  {...field}
                />
              </FormControl>
              {/* <FormDescription></FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update password</Button>
      </form>
    </Form>
  )
}
