/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'disasterrecoveryqld.au',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      }
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Only apply HSTS in production
          ...(process.env.NODE_ENV === 'production' 
            ? [{
                key: 'Strict-Transport-Security',
                value: 'max-age=31536000; includeSubDomains'
              }] 
            : []),
        ],
      },
    ];
  },
  // Environment-specific settings
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NODE_ENV === 'production' 
      ? 'https://disasterrecoveryqld.au'
      : 'http://localhost:3003'
  },
  webpack(config, { isServer }) {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg')
    );

    config.module.rules.push(
      {
        test: /\.svg$/,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: /url/ },
        use: ['@svgr/webpack'],
      },
      {
        test: /\.svg$/,
        resourceQuery: /url/,
        use: fileLoaderRule.use,
      }
    );

    fileLoaderRule.exclude = /\.svg$/i;

    if (!isServer) {
      // Client-side specific configuration
      config.resolve.fallback = {
        ...config.resolve.fallback,
        net: false,
        tls: false,
        dns: false,
        fs: false,
        path: false,
        stream: false,
        child_process: false,
        timers: require.resolve('timers-browserify'),
        'timers/promises': false,
        crypto: require.resolve('crypto-browserify'),
        buffer: require.resolve('buffer/'),
        util: require.resolve('util/'),
        assert: require.resolve('assert/'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        os: require.resolve('os-browserify/browser'),
        url: require.resolve('url/'),
        zlib: require.resolve('browserify-zlib'),
      };
    }

    return config;
  },
};

module.exports = nextConfig;
