'use client'

import { z } from 'zod'

// If the password is larger than 72 chars, it will be truncated to the first 72 chars.
export const formSchema = z
  .object({
    email: z.string().trim().email(),
    password: z.string().trim().min(6).max(72),
    confirmPassword: z.string().trim().min(6).max(72),
  })
  .refine((val) => val.password === val.confirmPassword, {
    path: ['confirmPassword'],
    params: { i18n: 'invalid_confirm_password' },
  })

export const formValues = {
  email: '',
  password: '',
  confirmPassword: '',
}

export type FormTypes = z.infer<typeof formSchema>
