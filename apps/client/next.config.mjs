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
  transpilePackages: ['recharts', '@types/d3-scale', '@types/d3-array', '@types/d3-shape'],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        // Force using ESM version
        'recharts': 'recharts/es6'
      };
    }
    return config;
  },
};

export default withNextIntl(nextConfig);
