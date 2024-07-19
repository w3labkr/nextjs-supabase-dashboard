'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

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
import { fetcher } from '@/lib/utils'
import { slugify } from '@/lib/slugify'
import { useUserAPI } from '@/queries/client/users'
import { type UserAPI } from '@/types/api'

const FormSchema = z.object({
  username: z
    .string()
    .nonempty()
    .min(2)
    .max(30)
    .refine((val: string) => !/[^A-Za-z0-9-_]/g.test(val), {
      params: { i18n: 'invalid_username' },
    }),
})

type FormValues = z.infer<typeof FormSchema>

const ChangeUsernameForm = () => {
  const { t } = useTranslation()
  const { user } = useUserAPI()

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    mode: 'onSubmit',
    values: {
      username: user?.username ?? '',
    },
  })

  const [open, setOpen] = React.useState<boolean>(false)
  const onOpenChange = (value: boolean) => {
    if (!value) form.reset()
    setOpen(value)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline">
          {t('change_username')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[320px]">
        <DialogHeader>
          <DialogTitle>{t('username')}</DialogTitle>
          <DialogDescription>
            {t('you_can_change_it_only_once_every_%d_days', { count: 30 })}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form method="POST" noValidate className="space-y-4">
            <UsernameField />
            <SubmitButton open={open} onOpenChange={setOpen} />
          </form>
        </Form>
        {/* <DialogFooter></DialogFooter> */}
      </DialogContent>
    </Dialog>
  )
}

const UsernameField = () => {
  const { t } = useTranslation()
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name="username"
      render={({ field }) => (
        <FormItem>
          <FormLabel>{t('username')}:</FormLabel>
          <FormControl>
            <Input placeholder="Username" {...field} />
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
      if (formValues?.username === user?.username) {
        throw new Error('Nothing has changed.')
      }

      const username = user?.username
      const revalidatePaths = [`/${username}`, `/${username}/favorites`]

      const result = await fetcher<UserAPI>(`/api/v1/user?id=${user?.id}`, {
        method: 'POST',
        body: JSON.stringify({
          data: { username: slugify(formValues?.username) },
          options: { revalidatePaths },
        }),
      })

      if (result?.error) throw new Error(result?.error?.message)

      onOpenChange(false)
      reset()
      mutate(`/api/v1/user?id=${user?.id}`)

      toast.success(t('changed_successfully'))

      router.refresh()
    } catch (e: unknown) {
      const err = (e as Error)?.message
      if (err.startsWith('duplicate key value violates unique constraint')) {
        setError('username', {
          message: t('duplicate_username'),
        })
      } else if (err.startsWith('You can change it after')) {
        const count = err?.replace(/[^0-9]/g, '') ?? '0'
        toast.error(t('you_can_change_it_after_%d_days', { count: +count }))
      } else if (err.startsWith('Nothing has changed')) {
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
      disabled={!formState?.isValid || isSubmitting}
    >
      {t('change_username')}
    </Button>
  )
}

export { ChangeUsernameForm }
