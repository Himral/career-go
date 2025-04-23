/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... other config
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        stream: false,
        crypto: false,
      };
    }
    return config;
  },
};



export default nextConfig;
