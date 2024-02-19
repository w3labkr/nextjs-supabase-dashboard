'use client'

import * as React from 'react'
import { useTranslation, Trans } from 'react-i18next'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { cn } from '@/utils/tailwind'
import { toast } from 'sonner'
import { LucideIcon } from '@/lib/lucide-icon'
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

const formSchema = z.object({
  email: z.string().email(),
  confirmText: z.string(),
  confirmPassword: z.string().min(6).max(72),
})

type FormValues = z.infer<typeof formSchema>

const defaultValues: Partial<FormValues> = {
  email: '',
  confirmText: '',
  confirmPassword: '',
}

export function DeleteAccountDialog() {
  const { t } = useTranslation(['translation', 'zod', 'zod-custom', 'supabase'])

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
          <DialogDescription>
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
  const { t } = useTranslation(['translation', 'zod', 'zod-custom', 'supabase'])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  async function onSubmit(values: FormValues) {
    console.log(values)
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
          name="confirmText"
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('confirm_your_password')}:</FormLabel>
              <FormControl>
                <Input placeholder={t('confirm_your_password')} {...field} />
              </FormControl>
              {/* <FormDescription></FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          variant="destructive"
          type="submit"
          disabled={!form?.formState?.isValid || form?.formState?.isSubmitting}
        >
          {t('delete_your_account')}
        </Button>
      </form>
    </Form>
  )
}
