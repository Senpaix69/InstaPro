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
      "www.hotelbenitsesarches.com",
    ],
  },
  env: {
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    BEAMS_INSTANCE_ID: process.env.BEAMS_INSTANCE_ID,
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
