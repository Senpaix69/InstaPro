if(!self.define){let e,s={};const n=(n,c)=>(n=new URL(n+".js",c).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(c,a)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let t={};const r=e=>n(e,i),o={module:{uri:i},exports:t,require:r};s[i]=Promise.all(c.map((e=>o[e]||r(e)))).then((e=>(a(...e),t)))}}define(["./workbox-6a1bf588"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/chunks/0f24dcc5-bb73453142a5c31e.js",revision:"bb73453142a5c31e"},{url:"/_next/static/chunks/126-f68461f65b144b14.js",revision:"f68461f65b144b14"},{url:"/_next/static/chunks/186068ac-2ac0c72ecc0790f9.js",revision:"2ac0c72ecc0790f9"},{url:"/_next/static/chunks/396-75d06b8bf71c1032.js",revision:"75d06b8bf71c1032"},{url:"/_next/static/chunks/3f2376d1-077a809b7a5f9c67.js",revision:"077a809b7a5f9c67"},{url:"/_next/static/chunks/410-0f8a7c7b092c15ed.js",revision:"0f8a7c7b092c15ed"},{url:"/_next/static/chunks/607-e3e7037ce2d1f6c7.js",revision:"e3e7037ce2d1f6c7"},{url:"/_next/static/chunks/675-70343703159d5baf.js",revision:"70343703159d5baf"},{url:"/_next/static/chunks/7112840a-aff5a4f777a741ea.js",revision:"aff5a4f777a741ea"},{url:"/_next/static/chunks/75fc9c18-4275c2966b1879ef.js",revision:"4275c2966b1879ef"},{url:"/_next/static/chunks/829-13d48bdcc29f4d16.js",revision:"13d48bdcc29f4d16"},{url:"/_next/static/chunks/8eb7616c-d495bfa641a4ac5b.js",revision:"d495bfa641a4ac5b"},{url:"/_next/static/chunks/framework-9b5d6ec4444c80fa.js",revision:"9b5d6ec4444c80fa"},{url:"/_next/static/chunks/main-a2196cfdfba7b46d.js",revision:"a2196cfdfba7b46d"},{url:"/_next/static/chunks/pages/Chats-11e2d982dd917ece.js",revision:"11e2d982dd917ece"},{url:"/_next/static/chunks/pages/_app-f2712a840976ad96.js",revision:"f2712a840976ad96"},{url:"/_next/static/chunks/pages/_error-7397496ca01950b1.js",revision:"7397496ca01950b1"},{url:"/_next/static/chunks/pages/auth/signin-3c2829c40064e096.js",revision:"3c2829c40064e096"},{url:"/_next/static/chunks/pages/chat/%5Bid%5D-0b51b70c5a072617.js",revision:"0b51b70c5a072617"},{url:"/_next/static/chunks/pages/index-1a554aef1d95e118.js",revision:"1a554aef1d95e118"},{url:"/_next/static/chunks/pages/like/%5Bpostid%5D-2e8b002464a3ac96.js",revision:"2e8b002464a3ac96"},{url:"/_next/static/chunks/pages/login-37d2c70c2fc6a4d1.js",revision:"37d2c70c2fc6a4d1"},{url:"/_next/static/chunks/pages/profile-2985366b2e9fef9a.js",revision:"2985366b2e9fef9a"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-246c5233b889db27.js",revision:"246c5233b889db27"},{url:"/_next/static/css/be4d1ebdbd4dfa02.css",revision:"be4d1ebdbd4dfa02"},{url:"/_next/static/xbxx4XyMBUFkg8LGEUGiZ/_buildManifest.js",revision:"042f67880eff49396b875ecee1cb067d"},{url:"/_next/static/xbxx4XyMBUFkg8LGEUGiZ/_ssgManifest.js",revision:"5352cb582146311d1540f6075d1f265e"},{url:"/favicon.ico",revision:"327b5a98289c7f6f95688b2ce5487a45"},{url:"/icon-192x192.png",revision:"ed2677be233c1866ff8f9bcec1355f08"},{url:"/icon-256x256.png",revision:"35ab7bd79a92997fb34384eabdb33394"},{url:"/icon-384x384.png",revision:"6b04a2eba5c0f117427c148358498bb3"},{url:"/icon-512x512.png",revision:"327b5a98289c7f6f95688b2ce5487a45"},{url:"/manifest.json",revision:"917fab812754605b2b8c52bb16b93cbe"},{url:"/vercel.svg",revision:"26bf2d0adaf1028a4d4c6ee77005e819"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:n,state:c})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
