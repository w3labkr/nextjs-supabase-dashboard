'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useTrans } from '@/hooks/i18next'

import { useForm, useFormContext } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
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

import { useSWRConfig } from 'swr'
import { createClient } from '@/supabase/client'
import { fetcher, getFavoritesPath, getProfilePath } from '@/lib/utils'
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
    .refine((val: string) => val === 'delete my account'),
})

type FormValues = z.infer<typeof FormSchema>

const defaultValues: Partial<FormValues> = {
  email: '',
  password: '',
  confirmationPhrase: '',
}

interface DeleteUserFormProps {
  user: User
}

const DeleteUserForm = ({ user }: DeleteUserFormProps) => {
  const { t } = useTranslation()
  const [open, setOpen] = React.useState<boolean>(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    defaultValues,
    shouldUnregister: true,
  })
  const { register, unregister } = form

  React.useEffect(() => {
    user?.has_set_password ? register('password') : unregister('password')
  }, [user?.has_set_password, register, unregister])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="text-destructive">
          {t('delete_your_account')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{t('delete_account')}</DialogTitle>
          <DialogDescription className="text-destructive">
            {t(
              'if_you_delete_your_account_your_posts_and_other_related_information_will_be_permanently_deleted_and_cannot_be_recovered'
            )}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form method="POST" noValidate className="space-y-4">
            <EmailField />
            {user?.has_set_password ? <PasswordField /> : null}
            <ConfirmationPhraseField />
            <SubmitButton open={open} onOpenChange={setOpen} />
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
          <FormLabel>{t('your_email')}:</FormLabel>
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
          <FormLabel>{t('confirm_your_password')}:</FormLabel>
          <FormControl>
            <Input
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect="off"
              placeholder={t('password')}
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
            {trans('to_verify_type_delete_my_account_below', {
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

const SubmitButton = ({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const router = useRouter()
  const { t } = useTranslation()
  const { session, setSession, setUser } = useAuth()
  const { user } = useUserAPI()
  const { mutate } = useSWRConfig()

  const { handleSubmit, reset, setError, getValues, formState } =
    useFormContext()
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const onSubmit = async () => {
    try {
      setIsSubmitting(true)

      const formValues = getValues()

      if (!user) throw new Error('Require is not defined.')
      if (!session?.user?.email) throw new Error('Require is not defined.')

      if (formValues?.email !== session?.user?.email) {
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

      const revalidatePaths = [getProfilePath(user), getFavoritesPath(user)]

      const { error } = await fetcher<UserAPI>(`/api/v1/user?id=${user?.id}`, {
        method: 'DELETE',
        body: JSON.stringify({
          options: { revalidatePaths },
        }),
      })

      if (error) throw new Error(error?.message)

      onOpenChange(false)
      reset()
      mutate(`/api/v1/user?id=${user?.id}`)

      setSession(null)
      setUser(null)

      toast.success(t('deleted_successfully'))

      router.replace('/auth/signin')
      router.refresh()
    } catch (e: unknown) {
      const err = (e as Error)?.message
      if (err.startsWith('Your email address is invalid')) {
        setError('email', { message: t('email_is_invalid') })
      } else if (err.startsWith('Your password is invalid')) {
        setError('password', {
          message: t('password_is_invalid'),
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
      {t('delete_your_account')}
    </Button>
  )
}

export { DeleteUserForm, type DeleteUserFormProps }
