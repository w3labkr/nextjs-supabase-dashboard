import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { defaultLng, fallbackLng } from '@/i18next.config'
import HttpBackend, { HttpBackendOptions } from 'i18next-http-backend'

import { z } from 'zod'
import { makeZodI18nMap } from 'zod-i18n-map'

i18n
  // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  // want your translations to be loaded from a professional CDN? => https://github.com/locize/react-tutorial#step-2---use-the-locize-cdn
  .use(HttpBackend)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init<HttpBackendOptions>({
    // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option
    lng: defaultLng,

    // It is recommended to read up on IETF Language Codes.
    // If you're using a language detector, do not define the lng option
    // https://en.wikipedia.org/wiki/IETF_language_tag
    fallbackLng,

    // do not load a fallback
    // fallbackLng: false,

    // allow keys to be phrases having `:`, `.`
    // nsSeparator: false, // ':'
    // keySeparator: false, // '.'

    interpolation: {
      escapeValue: false, // react already safes from xss
      // formatSeparator: ',',
    },

    // react: {
    //   useSuspense: false, // The useTranslation hook will trigger a Suspense if not ready.
    // },

    backend: {
      loadPath:
        process.env.NEXT_PUBLIC_SITE_URL + '/locales/{{lng}}/{{ns}}.json',
    },
  })

// Translating zod error messages.
z.setErrorMap(makeZodI18nMap({ ns: ['zod', 'zod-custom'] }))

export default i18n
