import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface EntryTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  text: string | null
  href?: string
}

const EntryTitle = ({ className, href, text, ...props }: EntryTitleProps) => {
  return (
    <h3
      className={cn(
        'line-clamp-2 w-full font-serif text-3xl',
        href ? 'hover:underline' : '',
        className
      )}
      {...props}
    >
      {href ? <Link href={href}>{text}</Link> : text}
    </h3>
  )
}

export { EntryTitle, type EntryTitleProps }
