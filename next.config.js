/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV !== "development",
  },
  images: {
    domains: [
      "links.papareact.com",
      "lh3.googleusercontent.com",
      "firebasestorage.googleapis.com",
      "cloudflare-ipfs.com",
    ],
  },
};

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const withTM = require("next-transpile-modules")([
  "@pusher/push-notifications-web",
]);

module.exports = withPWA(withTM(nextConfig));
