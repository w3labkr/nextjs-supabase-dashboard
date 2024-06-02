'use client'

import * as React from 'react'

const useMounted = () => {
  const [mounted, setMounted] = React.useState<boolean>(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  return mounted
}

const useDebounceMounted = (wait: number = 0) => {
  const [mounted, setMounted] = React.useState<boolean>(false)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
    }, wait)
    return () => clearTimeout(timer)
  }, [wait])

  return mounted
}

export { useMounted, useDebounceMounted }
