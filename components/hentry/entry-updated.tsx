import * as React from 'react'
import dayjs from 'dayjs'

interface EntryUpdatedProps extends React.TimeHTMLAttributes<HTMLTimeElement> {}

const EntryUpdated = ({ dateTime, ...props }: EntryUpdatedProps) => {
  if (!dateTime) return null

  return (
    <time dateTime={dateTime} {...props}>
      {dayjs(dateTime).format('MMMM D, YYYY')}
    </time>
  )
}

export { EntryUpdated, type EntryUpdatedProps }
