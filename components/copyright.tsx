import * as React from 'react'

interface CopyrightProps extends React.HTMLAttributes<HTMLSpanElement> {}

const Copyright = (props: CopyrightProps) => {
  return <span {...props}>&copy; {' 2024. '}</span>
}

export { Copyright, type CopyrightProps }
