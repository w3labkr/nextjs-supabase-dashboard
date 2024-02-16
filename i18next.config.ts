import {
  LngProp,
  FallbackLngProp,
  DefaultNSProp,
  LanguageProps,
} from '@/types/i18next'

// It is recommended to read up on IETF Language Codes.
// If you're using a language detector, do not define the lng option
// https://en.wikipedia.org/wiki/IETF_language_tag
export const lng: LngProp = 'en'
export const fallbackLng: FallbackLngProp = 'ko'

// If passing the ns option, the defaultNS will, by default, be set to the first ns passed.
export const defaultNS: DefaultNSProp = 'translation'

// LanguageSwitcher
export const languages: LanguageProps[] = [
  { value: 'en', label: 'English (United States)' },
  { value: 'ko', label: '한국어' },
]
