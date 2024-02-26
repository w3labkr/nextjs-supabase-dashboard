'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation, Trans } from 'react-i18next'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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

import { PostgrestApi } from '@/types/api'
import { fetcher } from '@/lib/utils'

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(72),
  confirmationPhrase: z.string().refine((val) => val === 'delete my account'),
})

type FormValues = z.infer<typeof formSchema>

const defaultValues: Partial<FormValues> = {
  email: '',
  password: '',
  confirmationPhrase: '',
}

export function DeleteUserForm() {
  const router = useRouter()
  const { t } = useTranslation(['translation', 'zod'])

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('email', values.email)
      formData.append('password', values.password)

      const { error } = await fetcher<PostgrestApi>(
        '/api/v1/account/delete-user',
        {
          method: 'POST',
          body: formData,
        }
      )

      if (error) throw new Error(error?.message)

      toast.success(t('FormMessage.your_account_has_been_successfully_deleted'))

      form.reset()
      router.replace('/')
    } catch (e: unknown) {
      const error = e as Error
      switch (error?.message) {
        case 'Your account information is invalid.':
          form.setError('email', {
            message: t('FormMessage.your_account_information_is_invalid'),
          })
          form.setError('password', {
            message: t('FormMessage.your_account_information_is_invalid'),
          })
          break
        default:
          toast.error(error?.message)
          break
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <Title
        text="DeleteUserForm.title"
        translate="yes"
        className="text-destructive"
      />
      <Separator />
      <Description text="DeleteUserForm.description" translate="yes" />
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="text-destructive">
            {t('DeleteAccountDialog.trigger')}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{t('DeleteAccountDialog.title')}</DialogTitle>
            <DialogDescription className="text-destructive">
              {t('DeleteAccountDialog.description')}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              method="POST"
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('FormLabel.your_email')}:</FormLabel>
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
                    <FormLabel>
                      {t('FormLabel.confirm_your_password')}:
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoCapitalize="none"
                        autoComplete="current-password"
                        autoCorrect="off"
                        placeholder={t('FormLabel.password')}
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
                name="confirmationPhrase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <Trans components={{ i: <i /> }}>
                        FormLabel.verify_delete_my_account
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
              <SubmitButton
                variant="destructive"
                disabled={!form?.formState?.isValid || isSubmitting}
                isSubmitting={isSubmitting}
                text="DeleteUserForm.submit"
                translate="yes"
              />
            </form>
          </Form>
          {/* <DialogFooter></DialogFooter> */}
        </DialogContent>
      </Dialog>
    </div>
  )
}
