'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation, Trans } from 'react-i18next'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { toast } from 'sonner'
import { Separator } from '@/components/ui/separator'
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { SubmitButton } from '@/components/submit-button'
import { Title } from '@/components/title'
import { Description } from '@/components/description'

import { fetcher } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { useProfile } from '@/hooks/api/use-profile'

const formSchema = z.object({
  name: z.string().trim().min(2),
  email: z.string().trim().max(255).email().optional(),
  bio: z.string().trim().max(160).optional(),
})

type FormValues = z.infer<typeof formSchema>

const defaultValues: Partial<FormValues> = {
  name: '',
  bio: '',
}

export function ProfileForm() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { data: values } = useProfile(user?.id ?? null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    values: {
      name: values?.name ?? '',
      bio: values?.bio ?? '',
    },
  })
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async (formValues: FormValues) => {
    setIsSubmitting(true)
    try {
      const fetchUrl = user?.id ? `/api/v1/profile/${user?.id}` : null
      const response = await fetcher(fetchUrl, {
        method: 'POST',
        body: JSON.stringify(formValues),
      })

      if (response?.error) throw new Error(response?.error?.message)

      toast.success(t('FormMessage.your_profile_has_been_successfully_changed'))
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <Title text="ProfileForm.title" translate="yes" />
      <Separator />
      <Description text="ProfileForm.description" translate="yes" />
      <Form {...form}>
        <form
          method="POST"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('FormLabel.name')}</FormLabel>
                <FormControl className="max-w-72">
                  <Input placeholder={t('FormLabel.your_name')} {...field} />
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled
                >
                  <FormControl className="max-w-72">
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t(
                          'SelectValue.select_a_verified_email_to_display'
                        )}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="name@example.com">
                      name@example.com
                    </SelectItem>
                    <SelectItem value="name@google.com">
                      name@google.com
                    </SelectItem>
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
                <FormControl className="max-w-96">
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
            text="ProfileForm.submit"
            translate="yes"
          />
        </form>
      </Form>
    </div>
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
