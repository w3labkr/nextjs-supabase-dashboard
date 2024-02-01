'use client'

import * as React from 'react'
import Error from 'next/error'

export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <Error statusCode={404} />
      </body>
    </html>
  )
}
