import * as React from 'react'
import dayjs from 'dayjs'

interface EntryPublishedProps
  extends React.TimeHTMLAttributes<HTMLTimeElement> {}

const EntryPublished = ({ dateTime, ...props }: EntryPublishedProps) => {
  if (!dateTime) return null

  return (
    <time dateTime={dateTime} {...props}>
      {dayjs(dateTime).format('MMMM D, YYYY')}
    </time>
  )
}

export { EntryPublished, type EntryPublishedProps }
