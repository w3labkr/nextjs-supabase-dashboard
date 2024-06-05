import slug from 'slugify'

type SlugifyOptions =
  | string
  | {
      replacement?: string
      remove?: RegExp
      lower?: boolean
      strict?: boolean
      locale?: string
      trim?: boolean
    }
  | undefined

const slugify = (string: string, options?: SlugifyOptions): string => {
  const defaults = {
    replacement: '-', // replace spaces with replacement character, defaults to `-`
    remove: /[^\p{L}\d\s]+/gu, // remove characters that match regex, defaults to `undefined`
    lower: true, // convert to lower case, defaults to `false`
    strict: false, // strip special characters except replacement, defaults to `false`
    trim: true, // trim leading and trailing replacement chars, defaults to `true`
  }

  let settings: SlugifyOptions = defaults

  if (
    typeof options === 'object' &&
    !Array.isArray(options) &&
    Object.keys(options).length > 0
  ) {
    settings = Object.assign({}, defaults, options)
  } else if (typeof options === 'string') {
    settings = options
  }

  return slug(string, settings)
}

export { slugify, type SlugifyOptions }
