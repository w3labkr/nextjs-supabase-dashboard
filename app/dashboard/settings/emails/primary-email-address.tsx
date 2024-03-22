'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SubmitButton } from '@/components/submit-button'

import { User } from '@supabase/supabase-js'
import { useEmails } from '@/hooks/api/use-emails'

const FormSchema = z.object({
  email: z.string().max(255).optional(),
})

type FormValues = z.infer<typeof FormSchema>

export function PrimaryEmailAddress({ user }: { user: User | null }) {
  const { t } = useTranslation()

  const fetchEmails = useEmails(user?.id ?? null)
  const { data: emails } = fetchEmails

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    values: {
      // email: emails?.email ?? 'unassigned',
      email: 'unassigned',
    },
  })
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async (formValues: FormValues) => {
    try {
      setIsSubmitting(true)
      const setEmail = (s: string) => (s === 'unassigned' ? '' : s)
      const email = setEmail(formValues?.email ?? '')

      if (email === '' || email === user?.email) {
        throw new Error('Nothing has changed.')
      }

      console.log(email)

      // const { data, error } = await supabase.auth.updateUser({
      //   email: 'new@email.com'
      // })

      // if (response?.error) throw new Error(response?.error?.message)
      // toast.success(t('FormMessage.profile_has_been_successfully_changed'))
    } catch (e: unknown) {
      toast.error((e as Error)?.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-2">
      <div>
        <span className="text-sm font-semibold">
          {t('PrimaryEmailAddress.title')}
        </span>
        <p className="text-xs">{t('PrimaryEmailAddress.description')}</p>
      </div>
      <Form {...form}>
        <form
          method="POST"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="flex w-full max-w-sm space-x-2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel></FormLabel> */}
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl className="max-w-72">
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
                        return email_confirmed_at ? (
                          <SelectItem key={id} value={email ?? ''}>
                            {email}
                          </SelectItem>
                        ) : null
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {/* <FormDescription></FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <SubmitButton
            isSubmitting={isSubmitting}
            text="FormSubmit.save"
            translate="yes"
          />
        </form>
      </Form>
    </div>
  )
}
