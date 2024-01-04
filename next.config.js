const withNextIntl = require('next-intl/plugin')('./app/i18n.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // reactStrictMode: true,
  swcMinify: true,
  eslint: {
    dirs: ['app', 'components', 'contexts', 'hooks', 'lib'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = withNextIntl(nextConfig);
