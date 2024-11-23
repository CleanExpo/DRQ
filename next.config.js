/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Image optimization configuration
  images: {
    domains: ['pixabay.com', 'images.unsplash.com'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },

  // Experimental features for performance
  experimental: {
    // Temporarily disable experimental features for debugging
    optimizeCss: false,
    scrollRestoration: false,
  },

  // Headers for security and performance
  async headers() {
    // Only apply strict headers in production
    if (process.env.NODE_ENV === 'production') {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'X-DNS-Prefetch-Control',
              value: 'on'
            },
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=63072000; includeSubDomains; preload'
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff'
            },
            {
              key: 'X-Frame-Options',
              value: 'SAMEORIGIN'
            },
            {
              key: 'X-XSS-Protection',
              value: '1; mode=block'
            },
            {
              key: 'Referrer-Policy',
              value: 'origin-when-cross-origin'
            },
            {
              key: 'Permissions-Policy',
              value: 'camera=(), microphone=(), geolocation=()'
            }
          ]
        },
        {
          source: '/:path*.(jpg|jpeg|png|webp|avif|ico)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable'
            }
          ]
        },
        {
          source: '/:path*.(js|css)',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable'
            }
          ]
        }
      ];
    }
    return [];
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/services',
        destination: '/',
        permanent: true,
      },
      {
        source: '/contact',
        destination: '/#contact',
        permanent: true,
      }
    ];
  },

  // Webpack configuration for optimization
  webpack: (config, { dev, isServer }) => {
    // Optimize CSS only in production
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        styles: {
          name: 'styles',
          test: /\.(css|scss)$/,
          chunks: 'all',
          enforce: true,
        },
      };
    }

    return config;
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NODE_ENV === 'production' 
      ? 'https://disasterrecoveryqld.au'
      : 'http://localhost:3000',
    NEXT_PUBLIC_GOOGLE_ANALYTICS: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS,
  },

  // Powered by header removal
  poweredByHeader: false,
};

module.exports = nextConfig;
