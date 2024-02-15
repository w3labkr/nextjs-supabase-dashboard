export function camelCase(str: string) {
  return str.replace(/\W+(.)/gi, (g) => g[1].toUpperCase())
}

export function capitalize(str: string) {
  return str.replace(/^./, (s) => s.toUpperCase())
}

export function removeAllSpecialCharacters(str: string) {
  return str.replace(/[^\w\s]/gi, '')
}

export function i18nKey(str: string) {
  return str
    .toLowerCase()
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, '-')
}
