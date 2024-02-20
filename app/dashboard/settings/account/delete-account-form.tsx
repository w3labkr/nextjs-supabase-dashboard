'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation, Trans } from 'react-i18next'

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'

import { deleteAccount } from '@/lib/supabase/client'

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(72),
  verifyText: z.literal('delete my account'),
})

type FormValues = z.infer<typeof formSchema>

const defaultValues: Partial<FormValues> = {
  email: '',
  password: '',
  verifyText: '',
}

export function DeleteAccountDialog() {
  const { t } = useTranslation(['translation', 'zod', 'zod-custom'])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-destructive">
          {t('delete_your_account')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{t('delete_account')}</DialogTitle>
          <DialogDescription className="text-destructive">
            {t('deleting_your_account_cannot_be_reversed')}
          </DialogDescription>
        </DialogHeader>
        <DeleteAccountForm />
        {/* <DialogFooter></DialogFooter> */}
      </DialogContent>
    </Dialog>
  )
}
export function DeleteAccountForm() {
  const router = useRouter()
  const { t } = useTranslation(['translation', 'zod', 'zod-custom'])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  async function onSubmit(values: FormValues) {
    const { data, error } = await deleteAccount({
      email: values.email,
      password: values.password,
    })

    if (error) {
      switch (error?.message) {
        case 'invalid_account_information':
          form.setError('email', { message: t(error?.message) })
          form.setError('password', { message: t(error?.message) })
          break
        default:
          toast.error(error?.message)
          break
      }
    }

    form.reset()

    toast.success(t('your_account_has_been_successfully_deleted'))

    router.push('/')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('your_email')}:</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              {/* <FormDescription></FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('confirm_your_password')}:</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoCapitalize="none"
                  autoComplete="current-password"
                  autoCorrect="off"
                  placeholder={t('password')}
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
          name="verifyText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                <Trans components={{ i: <i /> }}>
                  verify_type_delete_my_account
                </Trans>
              </FormLabel>
              <FormControl>
                <Input placeholder="delete my account" {...field} />
              </FormControl>
              {/* <FormDescription></FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          variant="destructive"
          type="submit"
          // disabled={!form?.formState?.isValid || form?.formState?.isSubmitting}
        >
          {t('delete_your_account')}
        </Button>
      </form>
    </Form>
  )
}
