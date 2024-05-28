'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useTrans } from '@/hooks/use-trans'

import { useForm, useFormContext } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
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

import { fetcher, getUserPath } from '@/lib/utils'
import { createClient } from '@/supabase/client'
import { User } from '@/types/database'
import { UserAPI } from '@/types/api'
import { useAuth } from '@/hooks/use-auth'
import { useUserAPI } from '@/queries/client/users'

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

interface DeactivateUserFormProps {
  user: User | null
}

const DeactivateUserForm = (props: DeactivateUserFormProps) => {
  const { user } = props
  const { t } = useTranslation()
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    defaultValues,
    shouldUnregister: true,
  })
  const { register, unregister } = form
  const has_set_password = user?.has_set_password

  React.useEffect(() => {
    has_set_password ? register('password') : unregister('password')
  }, [register, unregister, has_set_password])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="text-destructive">
          {t('DeleteUserDialog.trigger')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{t('DeleteUserDialog.title')}</DialogTitle>
          <DialogDescription className="text-destructive">
            {t('DeleteUserDialog.description')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form method="POST" noValidate className="space-y-4">
            <EmailField />
            {has_set_password ? <PasswordField /> : null}
            <ConfirmationPhraseField />
            <SubmitButton />
          </form>
        </Form>
        {/* <DialogFooter></DialogFooter> */}
      </DialogContent>
    </Dialog>
  )
}

const EmailField = () => {
  const { t } = useTranslation()
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('FormLabel.your_email')}:</FormLabel>
          <FormControl>
            <Input placeholder="name@example.com" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const PasswordField = () => {
  const { t } = useTranslation()
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('FormLabel.confirm_your_password')}:</FormLabel>
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
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const ConfirmationPhraseField = () => {
  const { trans } = useTrans()
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name="confirmationPhrase"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {trans('FormLabel.verify_delete_my_account', {
              components: { i: <i /> },
            })}
          </FormLabel>
          <FormControl>
            <Input placeholder="delete my account" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

const SubmitButton = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const { handleSubmit, setError, getValues, formState } = useFormContext()
  const { setSession, setUser } = useAuth()
  const { user } = useUserAPI()

  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)

      const formValues = getValues()

      if (!user) throw new Error('Require is not defined.')
      if (!user?.email) throw new Error('Require is not defined.')
      if (formValues?.email !== user?.email) {
        throw new Error('Your email address is invalid.')
      }

      const supabase = createClient()

      if (user?.has_set_password) {
        if (!formValues?.password) throw new Error('Require is not defined.')
        const verified = await supabase.rpc('verify_user_password', {
          userid: user?.id,
          password: formValues?.password,
        })
        if (verified?.error) throw new Error(verified?.error?.message)
        if (verified?.data === false) {
          throw new Error('Your password is invalid.')
        }
      }

      const fetchUrl = `/api/v1/user?id=${user?.id}`
      const deleted = await fetcher<UserAPI>(fetchUrl, {
        method: 'POST',
        body: JSON.stringify({
          data: { deleted: new Date().toISOString() },
          options: { revalidatePaths: getUserPath(user?.username) },
        }),
      })

      if (deleted?.error) throw new Error(deleted?.error?.message)

      setSession(null)
      setUser(null)

      toast.success(t('FormMessage.deleted_successfully'))

      router.replace('/')
      router.refresh()
    } catch (e: unknown) {
      const err = (e as Error)?.message
      if (err.startsWith('Your email address is invalid')) {
        setError('email', { message: t('FormMessage.email_is_invalid') })
      } else if (err.startsWith('Your password is invalid')) {
        setError('password', {
          message: t('FormMessage.password_is_invalid'),
        })
      } else {
        toast.error(err)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Button
      variant="destructive"
      type="submit"
      onClick={handleSubmit(onSubmit)}
      disabled={!formState?.isValid || isSubmitting}
    >
      {t('FormSubmit.delete_your_account')}
    </Button>
  )
}

export { DeactivateUserForm, type DeactivateUserFormProps }
