'use client'

import * as React from 'react'
import { useTranslation, Trans } from 'react-i18next'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { SubmitButton } from '@/components/submit-button'
import { Title } from '@/components/title'
import { Description } from '@/components/description'

const formSchema = z.object({
  username: z.string().min(2).max(30),
})

type FormValues = z.infer<typeof formSchema>

const defaultValues: Partial<FormValues> = {
  username: '',
}

export function ChangeUsernameForm() {
  const { t } = useTranslation(['translation', 'zod'])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    try {
      // ...
      // if (error) throw new Error(error?.message)
    } catch (e: unknown) {
      // const error = e as Error
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <Title text="ChangeUsernameForm.title" translate="yes" />
      <Separator />
      <Description text="ChangeUsernameForm.description" translate="yes" />
      <Form {...form}>
        <form
          method="POST"
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('FormLabel.username')}</FormLabel>
                <FormControl className="max-w-60">
                  <Input placeholder="Username" {...field} />
                </FormControl>
                <FormDescription>
                  <Trans values={{ count: 30 }}>
                    FormDescription.you_can_change_it_only_once_every_%d_days
                  </Trans>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <SubmitButton
            isSubmitting={isSubmitting}
            text="ChangeUsernameForm.submit"
            translate="yes"
            disabled
          />
        </form>
      </Form>
    </div>
  )
}
