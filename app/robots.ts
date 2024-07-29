import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL!

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/auth/', '/policy/', '/dashboard/', 'robots.txt'],
    },
    sitemap: [
      BASE_URL + '/sitemap.xml',
      process.env.NODE_ENV === 'production'
        ? BASE_URL + '/posts/sitemap/1.xml'
        : BASE_URL + '/posts/sitemap.xml/1',
    ],
  }
}
