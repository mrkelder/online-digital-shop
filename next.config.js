/** @type {import('next').NextConfig} */
module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"]
    });

    return config;
  },
  images: {
    // FIXME: remove www.vodafone.ua when going to production
    domains: ["firebasestorage.googleapis.com", "www.vodafone.ua"]
  },
  reactStrictMode: true
};
