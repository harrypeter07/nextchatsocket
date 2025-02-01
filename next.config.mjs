/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // WebSocket support
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil',
    });

    return config;
  },
  // Disable x-powered-by header for security
  poweredByHeader: false,
};

export default nextConfig;