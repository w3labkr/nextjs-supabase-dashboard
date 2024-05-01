'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation, Trans } from 'react-i18next'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, UseFormReturn } from 'react-hook-form'
import { z } from 'zod'

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
import { Button } from '@/components/ui/button'

import { useSWRConfig } from 'swr'
import { fetcher } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { useProfileAPI, useEmailsAPI } from '@/queries/sync'
import { ProfileAPI } from '@/types/api'

const FormSchema = z.object({
  full_name: z.string().nonempty(),
  email: z.string().max(255),
  bio: z.string().max(160),
})

type FormValues = z.infer<typeof FormSchema>

export function ProfileForm() {
  const { user } = useAuth()
  const { profile } = useProfileAPI(user?.id ?? null)

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    values: {
      full_name: profile?.full_name ?? '',
      email: profile?.email ?? 'unassigned',
      bio: profile?.bio ?? '',
    },
  })

  return (
    <Form {...form}>
      <form method="POST" noValidate className="space-y-4">
        <FullNameField form={form} />
        <EmailField form={form} />
        <BioField form={form} />
        <SubmitButton form={form} />
      </form>
    </Form>
  )
}

function FullNameField({ form }: { form: UseFormReturn<FormValues> }) {
  const { t } = useTranslation()

  return (
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
  )
}

function EmailField({ form }: { form: UseFormReturn<FormValues> }) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { emails } = useEmailsAPI(user?.id ?? null)

  return (
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
  )
}

function Link1({ children }: { children?: React.ReactNode }) {
  return (
    <Link href="/dashboard/settings/emails" className="text-primary underline">
      {children}
    </Link>
  )
}

function BioField({ form }: { form: UseFormReturn<FormValues> }) {
  const { t } = useTranslation()

  return (
    <FormField
      control={form.control}
      name="bio"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('FormLabel.bio')}</FormLabel>
          <FormControl className="w-[360px]">
            <Textarea
              placeholder={t('Textarea.please_tell_us_a_little_about_yourself')}
              rows={5}
              {...field}
            />
          </FormControl>
          <FormDescription></FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

function SubmitButton({ form }: { form: UseFormReturn<FormValues> }) {
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const { t } = useTranslation()
  const { user } = useAuth()
  const { profile } = useProfileAPI(user?.id ?? null)
  const { mutate } = useSWRConfig()

  const onSubmit = async (formValues: FormValues) => {
    try {
      setIsSubmitting(true)

      if (!user) throw new Error('Require is not defined.')
      if (!profile) throw new Error('Require is not defined.')
      if (
        formValues?.full_name === profile?.full_name &&
        formValues?.email === profile?.email &&
        formValues?.bio === profile?.bio
      ) {
        throw new Error('Nothing has changed.')
      }

      const { email, ...values } = formValues

      const fetchUrl = `/api/v1/profile?id=${user?.id}`
      const result = await fetcher<ProfileAPI>(fetchUrl, {
        method: 'POST',
        body: JSON.stringify({
          formData: { ...values, email: email.replace('unassigned', '') },
          options: { revalidatePath: `/${profile?.username}` },
        }),
      })

      if (result?.error) throw new Error(result?.error?.message)

      mutate(fetchUrl)

      toast.success(t('FormMessage.changed_successfully'))
    } catch (e: unknown) {
      const err = (e as Error)?.message
      if (err.startsWith('Nothing has changed')) {
        toast(t('FormMessage.nothing_has_changed'))
      } else {
        toast.error(err)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Button
      type="submit"
      onClick={form.handleSubmit(onSubmit)}
      disabled={isSubmitting}
    >
      {t('FormSubmit.update_profile')}
    </Button>
  )
}
