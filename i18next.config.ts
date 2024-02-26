import { Lng, FallbackLng, DefaultNS, Languages } from '@/types/i18next'

// It is recommended to read up on IETF Language Codes.
// If you're using a language detector, do not define the lng option
// https://en.wikipedia.org/wiki/IETF_language_tag
export const lng: Lng = 'en'
export const fallbackLng: FallbackLng = 'ko'

// If passing the ns option, the defaultNS will, by default, be set to the first ns passed.
export const defaultNS: DefaultNS = ['translation', 'zod', 'zod-custom']

// LanguageSwitcher
export const languages: Languages[] = [
  { value: 'en', label: 'English (United States)' },
  { value: 'ko', label: '한국어' },
]
