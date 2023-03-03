const nextConfig = {
  reactStrictMode: true,

  webpack: (config) => {
    // Replace node:buffer with buffer from Node.js
    config.resolve.alias = {
      ...config.resolve.alias,
      "node-fetch": "node-fetch/lib/index.js",
      encoding: "node-libs-browser/mock/empty.js",
      buffer: "buffer",
    };
    return config;
  },
};

module.exports = nextConfig;
