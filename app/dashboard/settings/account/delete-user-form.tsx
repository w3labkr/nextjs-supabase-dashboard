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

import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/use-auth'
import { useAccount } from '@/hooks/api/use-account'

const FormSchema = z.object({
  email: z.string().nonempty().max(255).email(),
  password: z.string().nonempty().min(6).max(72).optional(),
  confirmationPhrase: z
    .string()
    .nonempty()
    .refine((val) => val === 'delete my account'),
})

type FormValues = z.infer<typeof FormSchema>

const defaultValues: Partial<FormValues> = {
  email: '',
  password: '',
  confirmationPhrase: '',
}

export function DeleteUserForm({ user }: { user: User | null }) {
  const router = useRouter()
  const { t } = useTranslation()

  const auth = useAuth()
  const { account } = useAccount(user?.id ?? null)
  const hasSetPassword = React.useMemo(
    () => account?.has_set_password,
    [account?.has_set_password]
  )

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    defaultValues,
    shouldUnregister: true,
  })
  const { register, unregister } = form
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  React.useEffect(() => {
    hasSetPassword ? register('password') : unregister('password')
  }, [register, unregister, hasSetPassword])

  const onSubmit = async (formValues: FormValues) => {
    try {
      setIsSubmitting(true)
      const supabase = createClient()

      if (formValues?.email !== user?.email) {
        throw new Error('Your email address is invalid.')
      }

      if (hasSetPassword) {
        const verified = await supabase.rpc('verify_user_password', {
          password: formValues?.password as string,
        })
        if (verified?.error) throw new Error(verified?.error?.message)
        if (verified?.data === false) {
          throw new Error('Your password is invalid.')
        }
      }

      const deleted = await supabase.rpc('delete_user')
      if (deleted?.error) throw new Error(deleted?.error?.message)

      toast.success(t('FormMessage.account_has_been_successfully_deleted'))

      auth.setSession(null)
      auth.setUser(null)

      router.replace('/')
      router.refresh()
    } catch (e: unknown) {
      switch ((e as Error)?.message) {
        case 'Your email address is invalid.':
          form.setError('email', { message: t('FormMessage.email_is_invalid') })
          break
        case 'Your password is invalid.':
          form.setError('password', {
            message: t('FormMessage.password_is_invalid'),
          })
          break
        default:
          toast.error((e as Error)?.message)
          break
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!account) return null

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
              {hasSetPassword ? (
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
              ) : null}
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
