'use client'

import { z } from 'zod'

export const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(72),
})

export const formValues = {
  email: '',
  password: '',
}

export type FormTypes = z.infer<typeof formSchema>
