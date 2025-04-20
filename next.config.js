/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  webpack: (config, { isServer }) => {
    // This helps with npm link resolution issues
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Replace the module resolution for bndy-ui
    config.resolve.alias = {
      ...config.resolve.alias,
      'bndy-ui': path.resolve(__dirname, '../bndy-ui/dist'),
    };

    return config;
  },
};

module.exports = nextConfig;
