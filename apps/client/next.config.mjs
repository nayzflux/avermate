import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatar.vercel.sh",
      },
    ],
  },
  webpack: (config) => {
    // This ensures recharts alpha works in production
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve.fallback,
        util: false,
        crypto: false,
        assert: false,
        stream: false,
        fs: false,
        os: false,
        path: false,
      },
    };
    return config;
  },
};

export default withNextIntl(nextConfig);
