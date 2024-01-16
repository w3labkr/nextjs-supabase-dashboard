import { isRtlLang } from 'rtl-detect';
import { useLocale } from 'next-intl';

export function useTextDirection(locale: string) {
  const defaultLocale = useLocale();
  if (!locale) locale = defaultLocale;
  return isRtlLang(locale) ? 'rtl' : 'ltr';
}
