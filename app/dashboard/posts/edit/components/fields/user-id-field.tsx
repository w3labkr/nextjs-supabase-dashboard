'use client'

import * as React from 'react'

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
import { usePostForm } from '../../context/post-form-provider'

export function UserIdField() {
  const { form } = usePostForm()

  return (
    <FormField
      control={form.control}
      name="user_id"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Input type="hidden" {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  )
}
