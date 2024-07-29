import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL!

  return [
    {
      url: BASE_URL,
      lastModified: new Date().toISOString(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: BASE_URL + '/posts',
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]
}
