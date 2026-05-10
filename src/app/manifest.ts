import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Kisii Market',
    short_name: 'Kisii Market',
    description: 'The ultimate student marketplace for Kisii University. Buy and sell secondhand items easily.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#10b981',
    icons: [
      {
        src: '/images/logo.webp',
        sizes: 'any',
        type: 'image/webp',
      },
      {
        src: '/images/logo.webp',
        sizes: '192x192',
        type: 'image/webp',
        purpose: 'maskable',
      },
      {
        src: '/images/logo.webp',
        sizes: '512x512',
        type: 'image/webp',
        purpose: 'maskable',
      },
    ],
  }
}
