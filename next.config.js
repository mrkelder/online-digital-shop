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
    domains: ["nl.proga.site"]
  },
  reactStrictMode: true,
  i18n: {
    locales: ["ru", "ua"],
    defaultLocale: "ru"
  }
};
