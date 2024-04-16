'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation, Trans } from 'react-i18next'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { fetcher } from '@/lib/utils'
import { toast } from 'sonner'
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { SubmitButton } from '@/components/submit-button'

import useSWRMutation from 'swr/mutation'
import { useAuth } from '@/hooks/use-auth'
import { useProfile, useEmails } from '@/hooks/api'

const FormSchema = z.object({
  full_name: z.string().nonempty().min(2),
  email: z.string().max(255),
  bio: z.string().max(160),
})

type FormValues = z.infer<typeof FormSchema>

async function sendRequest(url: string, { arg }: { arg: FormValues }) {
  return await fetcher(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  })
}

export function ProfileForm() {
  const { t } = useTranslation()

  const { user } = useAuth()
  const { profile } = useProfile(user?.id ?? null)
  const { emails } = useEmails(user?.id ?? null)
  const { trigger } = useSWRMutation(
    user?.id ? `/api/v1/profile/${user?.id}` : null,
    sendRequest
  )

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    values: {
      full_name: profile?.full_name ?? '',
      email: profile?.email ?? 'unassigned',
      bio: profile?.bio ?? '',
    },
  })

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async (formValues: FormValues) => {
    if (
      formValues?.full_name === profile?.full_name &&
      formValues?.email === profile?.email &&
      formValues?.bio === profile?.bio
    ) {
      toast(t('FormMessage.nothing_has_changed'))
      return false
    }

    try {
      setIsSubmitting(true)

      const setEmail = (s: string) => (s === 'unassigned' ? '' : s)
      const result = await trigger({
        ...formValues,
        email: setEmail(formValues?.email),
      })
      if (result?.error) throw new Error(result?.error?.message)

      toast.success(t('FormMessage.changed_successfully'))
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form
        method="POST"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('FormLabel.full_name')}</FormLabel>
              <FormControl className="w-[180px]">
                <Input placeholder={t('FormLabel.your_full_name')} {...field} />
              </FormControl>
              <FormDescription>
                {t(
                  'FormDescription.this_is_the_name_that_appears_on_your_profile_and_email'
                )}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('FormLabel.email')}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue
                      placeholder={t(
                        'SelectValue.select_a_verified_email_to_display'
                      )}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="unassigned">
                      {t('SelectValue.select_a_verified_email_to_display')}
                    </SelectItem>
                    {emails?.map(({ id, email, email_confirmed_at }) => {
                      if (!email_confirmed_at) return null
                      return (
                        <SelectItem key={id} value={email ?? ''}>
                          {email}
                        </SelectItem>
                      )
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormDescription>
                <Trans components={{ link1: <Link1 /> }}>
                  FormDescription.you_can_manage_your_email_address_in_your_email_settings
                </Trans>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('FormLabel.bio')}</FormLabel>
              <FormControl className="w-[360px]">
                <Textarea
                  placeholder={t(
                    'Textarea.please_tell_us_a_little_about_yourself'
                  )}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <SubmitButton
          isSubmitting={isSubmitting}
          text="FormSubmit.update_profile"
          translate="yes"
        />
      </form>
    </Form>
  )
}

function Link1({ children }: { children?: React.ReactNode }) {
  return (
    <Link
      href="/dashboard/settings/emails"
      className="text-primary underline underline-offset-4"
    >
      {children}
    </Link>
  )
}
