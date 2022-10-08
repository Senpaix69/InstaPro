if (!self.define) {
  let e,
    s = {};
  const c = (c, n) => (
    (c = new URL(c + ".js", n).href),
    s[c] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = c), (e.onload = s), document.head.appendChild(e);
        } else (e = c), importScripts(c), s();
      }).then(() => {
        let e = s[c];
        if (!e) throw new Error(`Module ${c} didn’t register its module`);
        return e;
      })
  );
  self.define = (n, i) => {
    const a =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (s[a]) return;
    let t = {};
    const r = (e) => c(e, a),
      o = { module: { uri: a }, exports: t, require: r };
    s[a] = Promise.all(n.map((e) => o[e] || r(e))).then((e) => (i(...e), t));
  };
}
define(["./workbox-6a1bf588"], function (e) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/static/chunks/253-447b23077736ad14.js",
          revision: "447b23077736ad14",
        },
        {
          url: "/_next/static/chunks/271-fc459a25a71375f6.js",
          revision: "fc459a25a71375f6",
        },
        {
          url: "/_next/static/chunks/351-299192949abe52d8.js",
          revision: "299192949abe52d8",
        },
        {
          url: "/_next/static/chunks/385-5e23cc7bd3bd9edd.js",
          revision: "5e23cc7bd3bd9edd",
        },
        {
          url: "/_next/static/chunks/675-70343703159d5baf.js",
          revision: "70343703159d5baf",
        },
        {
          url: "/_next/static/chunks/7112840a-aff5a4f777a741ea.js",
          revision: "aff5a4f777a741ea",
        },
        {
          url: "/_next/static/chunks/75fc9c18-4275c2966b1879ef.js",
          revision: "4275c2966b1879ef",
        },
        {
          url: "/_next/static/chunks/783-321867849ba2433b.js",
          revision: "321867849ba2433b",
        },
        {
          url: "/_next/static/chunks/framework-9b5d6ec4444c80fa.js",
          revision: "9b5d6ec4444c80fa",
        },
        {
          url: "/_next/static/chunks/main-a2196cfdfba7b46d.js",
          revision: "a2196cfdfba7b46d",
        },
        {
          url: "/_next/static/chunks/pages/Chats-241187fa16c5c942.js",
          revision: "241187fa16c5c942",
        },
        {
          url: "/_next/static/chunks/pages/_app-7e9e599ffc424596.js",
          revision: "7e9e599ffc424596",
        },
        {
          url: "/_next/static/chunks/pages/_error-7397496ca01950b1.js",
          revision: "7397496ca01950b1",
        },
        {
          url: "/_next/static/chunks/pages/auth/signin-81de9844165601c9.js",
          revision: "81de9844165601c9",
        },
        {
          url: "/_next/static/chunks/pages/chat/%5Bid%5D-c2c7a68c53c8081f.js",
          revision: "c2c7a68c53c8081f",
        },
        {
          url: "/_next/static/chunks/pages/index-e6c169fe1dcf6578.js",
          revision: "e6c169fe1dcf6578",
        },
        {
          url: "/_next/static/chunks/pages/login-58d90c5675d8cc8b.js",
          revision: "58d90c5675d8cc8b",
        },
        {
          url: "/_next/static/chunks/pages/profile/%5Bprofile%5D-b4942d4e34e93611.js",
          revision: "b4942d4e34e93611",
        },
        {
          url: "/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",
          revision: "837c0df77fd5009c9e46d446188ecfd0",
        },
        {
          url: "/_next/static/chunks/webpack-246c5233b889db27.js",
          revision: "246c5233b889db27",
        },
        {
          url: "/_next/static/css/0afb1727238b2205.css",
          revision: "0afb1727238b2205",
        },
        {
          url: "/_next/static/css/364f5ea9234ea45c.css",
          revision: "364f5ea9234ea45c",
        },
        {
          url: "/_next/static/lRA8WDN19luUf8UNA7Soh/_buildManifest.js",
          revision: "725ee1f99c1c1dc684229747641cfc03",
        },
        {
          url: "/_next/static/lRA8WDN19luUf8UNA7Soh/_ssgManifest.js",
          revision: "5352cb582146311d1540f6075d1f265e",
        },
        {
          url: "/_next/static/media/icon-512x512.c5786ca9.png",
          revision: "327b5a98289c7f6f95688b2ce5487a45",
        },
        {
          url: "/_next/static/media/userimg.1262d2ad.jpg",
          revision: "3812e3d2d41a521470bf1cc7e24e78ad",
        },
        {
          url: "/_next/static/media/verified.ffc2810b.png",
          revision: "e1f6c72da85d3f78dee14c75947cfbcf",
        },
        { url: "/favicon.ico", revision: "327b5a98289c7f6f95688b2ce5487a45" },
        {
          url: "/icon-192x192.png",
          revision: "ed2677be233c1866ff8f9bcec1355f08",
        },
        {
          url: "/icon-256x256.png",
          revision: "35ab7bd79a92997fb34384eabdb33394",
        },
        {
          url: "/icon-384x384.png",
          revision: "6b04a2eba5c0f117427c148358498bb3",
        },
        {
          url: "/icon-512x512.png",
          revision: "327b5a98289c7f6f95688b2ce5487a45",
        },
        { url: "/manifest.json", revision: "6da66118ed0c05751fe0078c7fcb6778" },
        {
          url: "/service-worker.js",
          revision: "671a1d463000f9644886997d65b05606",
        },
        { url: "/userimg.jpg", revision: "3812e3d2d41a521470bf1cc7e24e78ad" },
        { url: "/verified.png", revision: "e1f6c72da85d3f78dee14c75947cfbcf" },
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({
              request: e,
              response: s,
              event: c,
              state: n,
            }) =>
              s && "opaqueredirect" === s.type
                ? new Response(s.body, {
                    status: 200,
                    statusText: "OK",
                    headers: s.headers,
                  })
                : s,
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        const s = e.pathname;
        return !s.startsWith("/api/auth/") && !!s.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1;
        return !e.pathname.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "others",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET"
    );
});
