'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

const useTrans = () => {
  const { t } = useTranslation()

  const trans = React.useCallback(
    <T extends Record<string, any>, U extends Record<string, any>>(
      key: string,
      options?: { components?: T; values?: U }
    ) => {
      let translated: string = t(key)
      let sentence: (string | React.JSX.Element)[] | null = null

      const values: U | undefined = options?.values
      const components: T | undefined = options?.components

      const valuesToken = (
        token: string | React.JSX.Element,
        values: U
      ): string | React.JSX.Element => {
        Object.keys(values).forEach((k: string) => {
          if (typeof token === 'string' && token.startsWith('{{')) {
            token =
              typeof values[k] === 'number'
                ? values[k]?.toLocaleString()
                : values[k]
          }
        })

        return token
      }

      const componentsToken = (
        token: string | React.JSX.Element,
        components: T
      ): string | React.JSX.Element => {
        Object.keys(components).forEach((k: string) => {
          const startTag: RegExp = new RegExp(`<${k}>`)
          if (typeof token === 'string' && startTag.test(token)) {
            const str: string = token.replace(/<[^>]*>/g, '').trim()
            const Element: React.JSX.Element = React.cloneElement(
              components[k],
              {},
              str
            )
            token = <React.Fragment key={k}>{Element}</React.Fragment>
          }
        })

        return token
      }

      const tokenToSentence = (
        tokens: (string | React.JSX.Element)[]
      ): (string | React.JSX.Element)[] | null => {
        return tokens?.reduce(
          (
            acc: (string | React.JSX.Element)[] | null,
            curr: string | React.JSX.Element
          ): (string | React.JSX.Element)[] | null => {
            return acc === null ? [curr] : [...acc, ' ', curr]
          },
          null
        )
      }

      if (values) {
        const tokenized: string[] = ((str: string) => {
          return str?.split(/({{.*?}})/g)?.map((s) => s.trim())
        })(translated)

        const tokens: (string | React.JSX.Element)[] = tokenized?.map(
          (token: string | React.JSX.Element) => {
            return valuesToken(token, values)
          }
        )

        translated = tokens.join(' ')
      }

      if (components) {
        const tokenized: string[] = ((str: string) => {
          return str?.split(/(<.*?>.*?<\/.*?>)/g)?.map((s) => s.trim())
        })(translated)

        const tokens: (string | React.JSX.Element)[] = tokenized?.map(
          (token: string | React.JSX.Element) => {
            return componentsToken(token, components)
          }
        )

        sentence = tokenToSentence(tokens)
      }

      return options && sentence ? sentence : translated
    },
    []
  )

  return { trans }
}

export { useTrans }
