import { MetadataRoute } from 'next';
import packageJSON from '@/package.json';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: packageJSON.name,
    short_name: packageJSON.name,
    description: packageJSON.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
