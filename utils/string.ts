export function camelCase(str: string) {
  return str.replace(/\W+(.)/g, (g) => g[1].toUpperCase())
}

export function capitalize(str: string) {
  return str.replace(/^./, (s) => s.toUpperCase())
}
