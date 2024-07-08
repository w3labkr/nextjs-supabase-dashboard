'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

import { useTranslation } from 'react-i18next'
import { defaultLng, fallbackLng, languages, Language } from '@/i18next.config'
import { Flag } from '@/lib/country-flag-icons'

import { cn } from '@/lib/utils'
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'
import { setAppLanguage } from '@/store/reducers/app-reducer'

interface CountryFlagButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {}

const CountryFlagButton = ({ className, ...props }: CountryFlagButtonProps) => {
  const router = useRouter()

  const dispatch = useAppDispatch()
  const { i18n } = useTranslation()
  const { language } = useAppSelector(({ app }) => app)

  const onClick = () => {
    const currentValue = language === defaultLng ? fallbackLng : defaultLng

    i18n.changeLanguage(currentValue)
    dispatch(setAppLanguage(currentValue))

    router.refresh()
  }

  const code = languages?.find(
    (lang: Language) => lang?.value === language
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
