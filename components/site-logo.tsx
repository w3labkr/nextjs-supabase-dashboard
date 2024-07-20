import * as React from 'react'

interface SiteLogoProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {}

const SiteLogo = ({ className, props }: SiteLogoProps) => {
  return (
    <img
      className={className}
      src="/assets/icons/manifest/icon.svg"
      alt=""
      {...props}
    />
  )
}

export { SiteLogo, type SiteLogoProps }
