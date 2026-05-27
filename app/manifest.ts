import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Luci · plano Felipe',
    short_name: 'Luci',
    description: 'Meia maratona 19/07/2026',
    start_url: '/hoje',
    display: 'standalone',
    background_color: '#F3EEE4',
    theme_color: '#1B1815',
    orientation: 'portrait',
    icons: [
      { src: '/icons/luci.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/icons/luci.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
    ],
  };
}
