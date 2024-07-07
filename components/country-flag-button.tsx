'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

import { useTranslation } from 'react-i18next'
import { defaultLng, fallbackLng, languages, Language } from '@/i18next.config'
import { Flag } from '@/lib/country-flag-icons'

import { cn } from '@/lib/utils'
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'
import { setResolvedLanguage } from '@/store/features/i18n-slice'

interface CountryFlagButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {}

const CountryFlagButton = ({ className, ...props }: CountryFlagButtonProps) => {
  const router = useRouter()

  const dispatch = useAppDispatch()
  const { resolvedLanguage } = useAppSelector(({ i18n }) => i18n)
  const [currentLanguage, setCurrentLanguage] =
    React.useState<string>(resolvedLanguage)
  const { i18n } = useTranslation()

  const onClick = () => {
    const currentValue =
      currentLanguage === defaultLng ? fallbackLng : defaultLng

    i18n.changeLanguage(currentValue)
    document.documentElement.lang = currentValue
    dispatch(setResolvedLanguage(currentValue))
    setCurrentLanguage(currentValue)

    router.refresh()
  }

  const code = languages?.find(
    (l: Language) => l.value === currentLanguage
  )?.code

  return (
    <button
      type="button"
      className={cn(code === 'KR' ? 'border' : 'border-transparent', className)}
      onClick={onClick}
      {...props}
    >
      {code ? <Flag code={code} className="w-8 min-w-8" /> : null}
    </button>
  )
}

export { CountryFlagButton, type CountryFlagButtonProps }
