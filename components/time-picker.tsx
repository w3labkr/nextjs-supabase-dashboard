'use client'

import * as React from 'react'
import { TimePickerInput } from '@/components/ui-custom/time-picker-input'

interface TimePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

const TimePicker = ({ date, setDate }: TimePickerProps) => {
  const minuteRef = React.useRef<HTMLInputElement>(null)
  const hourRef = React.useRef<HTMLInputElement>(null)
  const secondRef = React.useRef<HTMLInputElement>(null)

  return (
    <div className="flex items-center gap-2">
      <TimePickerInput
        picker="hours"
        date={date}
        setDate={setDate}
        ref={hourRef}
        onRightFocus={() => minuteRef.current?.focus()}
      />
      <div>:</div>
      <TimePickerInput
        picker="minutes"
        date={date}
        setDate={setDate}
        ref={minuteRef}
        onLeftFocus={() => hourRef.current?.focus()}
        onRightFocus={() => secondRef.current?.focus()}
      />
      <div>:</div>
      <TimePickerInput
        picker="seconds"
        date={date}
        setDate={setDate}
        ref={secondRef}
        onLeftFocus={() => minuteRef.current?.focus()}
      />
    </div>
  )
}

export { TimePicker, type TimePickerProps }
