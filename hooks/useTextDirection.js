import PropTypes from 'prop-types';
import { isRtlLang } from 'rtl-detect';
import { useLocale } from 'next-intl';

export default function useTextDirection(locale = '') {
  const defaultLocale = useLocale();
  if (!locale) locale = defaultLocale;
  return isRtlLang(locale) ? 'rtl' : 'ltr';
}

useTextDirection.propTypes = {
  locale: PropTypes.string,
};
