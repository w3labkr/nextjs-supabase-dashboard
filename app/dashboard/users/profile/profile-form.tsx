'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useTrans } from '@/hooks/i18next'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFormContext } from 'react-hook-form'
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
import { useUserAPI } from '@/queries/client/users'
import { useEmailsAPI } from '@/queries/client/emails'
import { UserAPI } from '@/types/api'

const FormSchema = z.object({
  full_name: z.string().nonempty(),
  email: z.string().max(255),
  bio: z.string().max(160),
})

type FormValues = z.infer<typeof FormSchema>

const ProfileForm = () => {
  const { user } = useUserAPI()

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    values: {
      full_name: user?.full_name ?? '',
      email: user?.email ?? 'unassigned',
      bio: user?.bio ?? '',
    },
  })

  return (
    <Form {...form}>
      <form method="POST" noValidate className="space-y-4">
        <FullNameField />
        <EmailField />
        <BioField />
        <SubmitButton />
      </form>
    </Form>
  )
}

const FullNameField = () => {
  const { t } = useTranslation()
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name="full_name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('full_name')}</FormLabel>
          <FormControl className="w-[180px]">
            <Input placeholder={t('your_full_name')} {...field} />
          </FormControl>
          <FormDescription>
            {t('this_is_the_name_that_appears_on_your_profile_and_email')}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const EmailField = () => {
  const { t } = useTranslation()
  const { trans } = useTrans()
  const { control } = useFormContext()
  const { user } = useAuth()
  const { emails } = useEmailsAPI(user?.id ?? null)

  return (
    <FormField
      control={control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('email')}</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger className="w-[180px]">
                <SelectValue
                  placeholder={t('select_a_verified_email_to_display')}
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="unassigned">
                  {t('select_a_verified_email_to_display')}
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
            {trans('you_can_manage_your_email_address_in_your_email_settings', {
              components: {
                link1: (
                  <Link
                    href="/dashboard/settings/emails"
                    className="text-primary underline hover:no-underline"
                  />
                ),
              },
            })}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const BioField = () => {
  const { t } = useTranslation()
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name="bio"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('bio')}</FormLabel>
          <FormControl className="w-[360px]">
            <Textarea
              placeholder={t('please_tell_us_a_little_about_yourself')}
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

const SubmitButton = () => {
  const { t } = useTranslation()
  const { handleSubmit, getValues } = useFormContext()
  const { user } = useUserAPI()
  const { mutate } = useSWRConfig()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)

      const formValues = getValues()

      if (!user) throw new Error('Require is not defined.')
      if (
        formValues?.full_name === user?.full_name &&
        formValues?.email === user?.email &&
        formValues?.bio === user?.bio
      ) {
        throw new Error('Nothing has changed.')
      }

      const data = {
        ...formValues,
        email: formValues?.email?.replace('unassigned', ''),
      }

      const username = user?.username
      const revalidatePaths = [`/${username}`, `/${username}/favorites`]

      const result = await fetcher<UserAPI>(`/api/v1/user?id=${user?.id}`, {
        method: 'POST',
        body: JSON.stringify({ data, options: { revalidatePaths } }),
      })

      if (result?.error) throw new Error(result?.error?.message)

      mutate(`/api/v1/user?id=${user?.id}`)

      toast.success(t('changed_successfully'))
    } catch (e: unknown) {
      const err = (e as Error)?.message
      if (err.startsWith('Nothing has changed')) {
        toast(t('nothing_has_changed'))
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
      onClick={handleSubmit(onSubmit)}
      disabled={isSubmitting}
    >
      {t('update_profile')}
    </Button>
  )
}

export { ProfileForm }
