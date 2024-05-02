'use client'

import * as React from 'react'
import { useTranslation } from 'react-i18next'

export function useTrans<
  T extends Record<string, any>,
  U extends Record<string, any>,
>(key: string, options?: { components?: T; values?: U }) {
  const [trans, setTrans] = React.useState<
    string | (string | React.JSX.Element)[] | null
  >(null)

  const { t } = useTranslation()
  const translated = t(key)

  const componentsTokenizer = (str: string) => {
    return str?.split(/(<.*?>.*?<\/.*?>)/g)?.map((s) => s.trim())
  }

  const componentsToken = (
    token: string | React.JSX.Element,
    components: T
  ) => {
    Object.keys(components).forEach((k: string) => {
      const startTag: RegExp = new RegExp(`<${k}>`)
      if (typeof token === 'string' && startTag.test(token)) {
        const str: string = token.replace(/<[^>]*>/g, '').trim()
        const cloned: React.JSX.Element = React.cloneElement(
          components[k],
          [],
          str
        )
        token = <React.Fragment key={k}>{cloned}</React.Fragment>
      }
    })

    return token
  }

  const valuesTokenizer = (str: string) => {
    return str?.split(/({{.*?}})/g)?.map((s) => s.trim())
  }

  const valuesToken = (token: string | React.JSX.Element, values: U) => {
    Object.keys(values).forEach((k: string) => {
      if (typeof token === 'string' && /{{/.test(token)) {
        token =
          typeof values[k] === 'number'
            ? values[k].toLocaleString('en-US')
            : values[k]
      }
    })

    return token
  }

  const generateSentence = (tokens: (string | React.JSX.Element)[]) => {
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

  React.useEffect(() => {
    let sentence: string | (string | React.JSX.Element)[] | null = null

    const values = options?.values
    const components = options?.components

    if (values) {
      const tokenized = valuesTokenizer(translated)
      const tokens = tokenized?.map((token: string | React.JSX.Element) => {
        return valuesToken(token, values)
      })
      sentence = tokens.join(' ')
    }

    if (components) {
      const tokenized = componentsTokenizer(sentence ?? translated)
      const tokens = tokenized?.map((token: string | React.JSX.Element) => {
        return componentsToken(token, components)
      })
      sentence = generateSentence(tokens)
    }

    options && sentence ? setTrans(sentence) : setTrans(translated)
  }, [translated])

  return { trans }
}
