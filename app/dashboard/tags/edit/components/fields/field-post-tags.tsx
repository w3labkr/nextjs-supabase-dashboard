'use client'

import * as React from 'react'
import { useFormContext } from 'react-hook-form'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const FieldPostTags = () => {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name="post_tags"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <input type="hidden" {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  )
}

export { FieldPostTags }
